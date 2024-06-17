'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AuthError } from 'next-auth';
import {
  Seam,
  isSeamActionAttemptFailedError,
  isSeamActionAttemptTimeoutError,
} from 'seam';
import { Session, Unit } from '@prisma/client';

import prisma from '@/lib/db';
import {
  authFormSchema,
  healthQuizDataSchema,
  memberDetailsFormSchema,
  plungeTimerSecsSchema,
} from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';
import {
  checkActivePlungeSession,
  checkAuth,
  getCodesbyLockId,
  getSessionById,
  getUnitById,
} from '@/lib/server-utils';
import { getTimeDiffSecs } from '@/lib/utils';
import { HealthQuizData, TAuthForm, TMemberDetailsForm } from '@/lib/types';
import { ONBOARDING_URLS } from '@/lib/constants';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const seam = new Seam();

// --- user actions ---

export async function signUp(data: TAuthForm & { callbackUrl: string | null }) {
  // validation check
  const validatedData = authFormSchema
    .extend({ callbackUrl: z.union([z.null(), z.string().trim().url()]) })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, password, callbackUrl: authCallbackUrl } = validatedData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  // existing account check
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (e) {
    return {
      message: 'Find account check failed',
    };
  }

  if (user && !user.deleted) {
    return {
      error: 'Email already exists',
    };
  }

  // update callback url (so long as not part of onboarding)
  const isCallbackUrlOnboarding =
    authCallbackUrl && ONBOARDING_URLS.includes(authCallbackUrl);

  if (user && user.deleted) {
    try {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          hashedPassword,
          firstName: null,
          lastName: null,
          dob: null,
          authCallbackUrl: !isCallbackUrlOnboarding ? authCallbackUrl : null,
          deleted: false,
          deletedAt: null,
        },
      });
    } catch (e) {
      return {
        error: 'Failed to recreate account',
      };
    }
  }

  // create account
  if (!user) {
    try {
      await prisma.user.create({
        data: {
          email,
          authCallbackUrl: !isCallbackUrlOnboarding ? authCallbackUrl : null,
          hashedPassword,
        },
      });
    } catch (e) {
      return {
        error: 'Failed to create account',
      };
    }
  }

  // signin
  try {
    await signIn('credentials', {
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: 'Error, could not sign up',
      };
    }
    throw error; // to deal with next.js redirect throwing error
  }
}

export async function signInAction(
  data: TAuthForm & { callbackUrl: string | null },
) {
  // validation check
  const validatedData = authFormSchema
    .extend({ callbackUrl: z.union([z.null(), z.string().trim().url()]) })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, password, callbackUrl: authCallbackUrl } = validatedData.data;

  // password check
  let hashedPassword;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        deleted: false,
      },
    });

    if (!user?.hashedPassword)
      return {
        error: 'Invalid credentials.',
      };

    hashedPassword = user.hashedPassword;
  } catch (e) {
    return {
      error: 'Invalid credentials.',
    };
  }

  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (!passwordsMatch)
    return {
      error: 'Error, invalid credentials',
    };

  // update callback url (so long as not part of onboarding)
  const isCallbackUrlOnboarding =
    authCallbackUrl && ONBOARDING_URLS.includes(authCallbackUrl);

  if (!isCallbackUrlOnboarding) {
    try {
      await prisma.user.update({
        where: {
          email: validatedData.data.email,
          hashedPassword,
          deleted: false,
        },
        data: {
          authCallbackUrl,
        },
      });
    } catch (e) {
      return {
        error: 'Sign in failed, please try again',
      };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            error: 'Invalid credentials',
          };
        }
        case 'CallbackRouteError': {
          return {
            error: 'Invalid credentials',
          };
        }
        default: {
          return {
            error: 'Error, could not sign in',
          };
        }
      }
    }
    throw error; // to deal with next.js redirect throwing error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount() {
  // authentication check
  const session = await checkAuth();

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName: null,
        lastName: null,
        dob: null,
        isWaiverSigned: false,
        healthQuiz: null,
        authCallbackUrl: null,
        deleted: true,
        deletedAt: new Date(),
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: 'Failed to delete user',
    };
  }

  await signOut({ redirectTo: '/signup' });
}

// --- member details actions ---

export async function addMemberDetails(data: TMemberDetailsForm) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedMemberDetails = memberDetailsFormSchema.safeParse(data);

  if (!validatedMemberDetails.success) {
    return {
      error: validatedMemberDetails.error.issues[0].message,
    };
  }

  // update user record with member details
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { ...validatedMemberDetails.data },
    });
  } catch (e) {
    return {
      error: 'Failed to save member details',
    };
  }

  redirect('/health-quiz');
}

// --- health quiz actions ---

export async function saveHealthQuiz(data: HealthQuizData) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedQuizData = healthQuizDataSchema.safeParse(data);

  if (!validatedQuizData.success) {
    return {
      error: validatedQuizData.error.issues[0].message,
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { healthQuiz: JSON.stringify(validatedQuizData.data) },
    });
  } catch (e) {
    return {
      error: 'Failed to save health quiz answers',
    };
  }

  redirect('/health-quiz/outcome');
}

// --- waiver actions ---

export async function signWaiver() {
  // authentication check
  const session = await checkAuth();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isWaiverSigned: true },
    });
  } catch (e) {
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  // redirect to callback url, if available
  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { authCallbackUrl: true },
  });
  const callbackUrl = data?.authCallbackUrl;

  if (!callbackUrl) redirect('/');

  // clear callback from db, before redirecting
  await prisma.user.update({
    where: { id: session.user.id },
    data: { authCallbackUrl: null },
  });

  redirect(callbackUrl);
}

// --- unit actions ---

export async function createLockCode(data: {
  lockDeviceId: Unit['lockDeviceId'];
  minsLaterEndTime: number;
}) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      lockDeviceId: z.string().trim().min(1),
      minsLaterEndTime: z.number().positive(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { lockDeviceId, minsLaterEndTime } = validatedData.data;

  // create code action
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + minsLaterEndTime * 60 * 1000);
  const code = String(Math.floor(1000 + Math.random() * 9000));

  try {
    await seam.accessCodes.create({
      device_id: lockDeviceId,
      name: `code ${code}`,
      starts_at: startTime.toISOString(),
      ends_at: endTime.toISOString(),
      code,
    });
  } catch (e) {
    return {
      error: 'Failed to create code',
    };
  }
}

export async function getLatestEligibleCode(data: { unitId: Unit['id'] }) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId } = validatedData.data;

  let lockDeviceId;
  // get unit's lock id
  try {
    const unit = await getUnitById(unitId);
    if (!unit)
      return {
        data: null,
        error: 'Unit does not exist',
      };
    lockDeviceId = unit.lockDeviceId;
  } catch (e) {
    return {
      data: null,
      error: 'Failed to find unit',
    };
  }

  // get eligible codes
  let eligibleCodes;
  try {
    const codes = await getCodesbyLockId(lockDeviceId);
    eligibleCodes = codes
      .filter((code: any) => code.status === 'set')
      .filter((code) => code.type === 'time_bound')
      .filter((code) => {
        if (!code.ends_at) return false;
        const now = new Date();
        const endsAt = new Date(code.ends_at);
        const timeDiffSecs = getTimeDiffSecs(now, endsAt);
        if (!timeDiffSecs) return false;
        return timeDiffSecs >= 60;
      });

    if (eligibleCodes.length === 0) {
      return {
        data: null,
        error: 'No code available',
      };
    }
  } catch (e) {
    return {
      data: null,
      error: 'Failed to get codes',
    };
  }

  // return latest eligible code
  return {
    data: eligibleCodes.at(-1),
    error: null,
  };
}

export async function unlockAction(data: { unitId: Unit['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId } = validatedData.data;

  // active session check, for this unit
  const activePlungeSession = await checkActivePlungeSession(session.user.id);
  if (!activePlungeSession.data) {
    return {
      error: 'No active session found',
    };
  }

  if (activePlungeSession.data?.unitId !== unitId) {
    return {
      error: 'Not authorized to unlock this plunge',
    };
  }

  // get unit's lock id
  let lockDeviceId;
  try {
    const unit = await getUnitById(unitId);
    if (!unit)
      return {
        error: 'Unit does not exist',
      };
    lockDeviceId = unit.lockDeviceId;
  } catch (e) {
    return {
      error: 'Failed to find unit',
    };
  }

  // unlock action
  try {
    const actionResponse = await seam.locks.unlockDoor(
      { device_id: lockDeviceId },
      {
        waitForActionAttempt: {
          pollingInterval: 1000,
          timeout: 60000,
        },
      },
    );

    await seam.actionAttempts.get({
      action_attempt_id: actionResponse.action_attempt_id,
    });
  } catch (e) {
    if (isSeamActionAttemptFailedError(e)) {
      // console.log('Locking unsuccessful');
      return {
        error: 'Unlocking unsuccessful, try again',
      };
    }
    if (isSeamActionAttemptTimeoutError(e)) {
      // console.log('Lock action took too long to resolve.');
      return {
        error: 'Locking took too long',
      };
    }
    return {
      error: 'Unlocking unsuccessful, please try again',
    };
  }
}

// --- session actions ---

export async function createActiveSession(data: {
  unitId: Unit['id'];
  plungeTimerSecs: Session['plungeTimerSecs'];
  assignCode?: boolean;
}) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      plungeTimerSecs: plungeTimerSecsSchema,
      assignCode: z.union([z.undefined(), z.boolean()]),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      // data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId, assignCode, plungeTimerSecs } = validatedData.data;

  // get access code, if relevant
  let codeData;
  if (assignCode) {
    const response = await getLatestEligibleCode({ unitId });
    codeData = response?.data;
  }

  // prep initial data for new session
  let initialData: Pick<
    Session,
    'userId' | 'unitId' | 'isActive' | 'plungeTimerSecs'
  > &
    Partial<Pick<Session, 'accessCodeId' | 'accessCode' | 'accessCodeEndsAt'>> =
    {
      userId: session.user.id,
      unitId,
      isActive: true,
      plungeTimerSecs,
    };
  if (codeData) {
    initialData = {
      ...initialData,
      accessCodeId: codeData.access_code_id,
      accessCode: codeData.code,
      accessCodeEndsAt: codeData.ends_at ? new Date(codeData.ends_at) : null,
    };
  }

  // create new active session
  let newSession;
  try {
    newSession = await prisma.session.create({
      data: initialData,
    });
  } catch (e) {
    return {
      // data: null,
      error: 'Failed to create new active session',
    };
  }

  redirect(`/plunge/${unitId}/unlock`);
}

export async function startActiveSession(data: { sessionId: Session['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.log({ error: validatedData.error.issues[0].message });
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.userId !== session.user.id) {
    return {
      error: 'Not authorized',
    };
  }

  // update start date
  try {
    const sessionStart = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { sessionStart },
    });
  } catch (e) {
    return {
      error: 'Failed to start session',
    };
  }

  // redirect to session screen
  redirect(`/session/${sessionId}`);
}

export async function endActiveSession(data: {
  sessionId: Session['id'];
  totalPlungeSecs: Session['totalPlungeSecs'];
  hasPenalty: Session['hasPenalty'];
}) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
      totalPlungeSecs: z.number(),
      hasPenalty: z.boolean(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.log({ error: validatedData.error.issues[0].message });
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId, totalPlungeSecs, hasPenalty } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.userId !== session.user.id) {
    return {
      error: 'Not authorized',
    };
  }

  // update session in db
  try {
    const sessionEnd = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { sessionEnd, totalPlungeSecs, hasPenalty, isActive: false },
    });
  } catch (e) {
    return {
      error: 'Failed to end session',
    };
  }

  // redirect to session screen
  redirect(`/session/${sessionId}/end`);
}

// --- payment actions ---

export async function createCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: 'price_1PRzfQHR9Et3lW0UBz0TFUYj',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  // redirect user
  redirect(checkoutSession.url);
}
