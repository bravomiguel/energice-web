'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';
// import { AuthError } from 'next-auth';
import {
  Seam,
  isSeamActionAttemptFailedError,
  isSeamActionAttemptTimeoutError,
} from 'seam';
import { Session, Unit, User } from '@prisma/client';
import { Resend } from 'resend';
import { headers } from 'next/headers';

import prisma from '@/lib/db';
import {
  signupSchema,
  emailConfirmCodeSchema,
  healthQuizDataSchema,
  memberDetailsSchema,
  plungeTimerSecsSchema,
  pwResetCodeSchema,
  signinSchema,
  waiverDataSchema,
} from '@/lib/validations';

import {
  checkAuth,
  checkPlungeSession,
  getCodesbyLockId,
  getSessionById,
  getUnitById,
  getUserById,
} from '@/lib/server-utils';
import { getTimeDiffSecs, isUserOver18, sleep } from '@/lib/utils';
import {
  HealthQuizData,
  TSignupForm,
  TMemberDetailsForm,
  TSigninForm,
} from '@/lib/types';
import { BASE_URL, ONBOARDING_URLS } from '@/lib/constants';
import confirmEmail from '../../emails/confirm-email';
import passwordResetEmail from '../../emails/password-reset-email';
import { createServerClient } from '@/lib/supabase/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const seam = new Seam();
const resend = new Resend(process.env.RESEND_API_KEY);

// --- user actions ---

export async function signUpAction(data: TSignupForm) {
  // validation check
  const validatedData = signupSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email } = validatedData.data;

  const supabase = await createServerClient();
  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return {
      error: error.message,
    }
  } else {
    redirect('/signup?success=true')
  }
}

export async function signInAction(
  data: TSigninForm & { callbackUrl: string | null },
) {
  // validation check
  const validatedData = signinSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email } = validatedData.data;

  // // password check
  // let hashedPassword;
  // try {
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email,
  //       deleted: false,
  //     },
  //   });

  //   if (!user?.hashedPassword)
  //     return {
  //       error: 'Invalid credentials',
  //     };

  //   hashedPassword = user.hashedPassword;
  // } catch (e) {
  //   return {
  //     error: 'Invalid credentials provided',
  //   };
  // }

  // const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  // if (!passwordsMatch)
  //   return {
  //     error: 'Error, invalid credentials',
  //   };

  // // update callback url (so long as not part of onboarding)
  // const isCallbackUrlOnboarding =
  //   authCallbackUrl && ONBOARDING_URLS.includes(authCallbackUrl);

  // if (!isCallbackUrlOnboarding) {
  //   try {
  //     await prisma.user.update({
  //       where: {
  //         email: validatedData.data.email,
  //         hashedPassword,
  //         deleted: false,
  //       },
  //       data: {
  //         authCallbackUrl,
  //       },
  //     });
  //   } catch (e) {
  //     return {
  //       error: 'Sign in failed, please try again',
  //     };
  //   }
  // }

  // await signIn('credentials', { email, password });
}

export async function signOutAction() {
  // await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount() {
  // authentication check
  const session = await checkAuth();

  const user = await getUserById('1');
  if (user?.customerId) {
    await customerDeletion({ customerId: user.customerId });
  }

  try {
    await prisma.user.update({
      where: {
        id: '1',
      },
      data: {
        eConfCode: null,
        eConfCodeAt: null,
        pwResetCode: null,
        pwResetCodeAt: null,
        isEmailConfirmed: false,
        firstName: null,
        lastName: null,
        dob: null,
        isWaiverSigned: false,
        waiverSignedAt: null,
        waiverSigName: null,
        isGWaiverSigned: false,
        healthQuiz: null,
        authCallbackUrl: null,
        hasFreeCredit: false,
        paidCredits: 0,
        customerId: null,
        isMember: false,
        memberPayFailed: null,
        memberPeriodEnd: null,
        memberRenewing: null,
        deleted: true,
        deletedAt: new Date(),
      },
    });

    await prisma.session.deleteMany({ where: { userId: '1' } });
  } catch (e) {
    return {
      error: 'Failed to delete user',
    };
  }

  // await signOut({ redirectTo: '/signup' });
}

// --- member details actions ---

export async function addMemberDetails(data: TMemberDetailsForm) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedMemberDetails = memberDetailsSchema.safeParse(data);

  if (!validatedMemberDetails.success) {
    return {
      error: validatedMemberDetails.error.issues[0].message,
    };
  }

  // update user record with member details
  try {
    await prisma.user.update({
      where: { id: '1' },
      data: { ...validatedMemberDetails.data },
    });
  } catch (e) {
    return {
      error: 'Failed to save member details',
    };
  }

  const isOver18 = isUserOver18(validatedMemberDetails.data.dob);

  if (isOver18) {
    redirect('/health-quiz');
  } else {
    redirect('/guardian-waiver');
  }
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
      where: { id: '1' },
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

export async function signWaiver(data: Pick<User, 'waiverSigName'>) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedWaiverData = waiverDataSchema.safeParse(data);

  if (!validatedWaiverData.success) {
    return {
      error: validatedWaiverData.error.issues[0].message,
    };
  }

  const { waiverSigName } = validatedWaiverData.data;

  try {
    await prisma.user.update({
      where: { id: '1' },
      data: { isWaiverSigned: true, waiverSigName, waiverSignedAt: new Date() },
    });
  } catch (e) {
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  // redirect to callback url, if available
  const user = await prisma.user.findUnique({
    where: { id: '1' },
    select: { authCallbackUrl: true },
  });
  const callbackUrl = user?.authCallbackUrl;

  if (!callbackUrl) redirect('/');

  // clear callback from db, before redirecting
  await prisma.user.update({
    where: { id: '1' },
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

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeStatus } =
    await checkPlungeSession('1');
  if (plungeStatus === 'none_valid') {
    return {
      error: 'No valid session found',
    };
  }

  if (plungeSession && plungeSession.unitId !== unitId) {
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
  if (
    process.env.VERCEL_ENV === 'development' ||
    process.env.PREVIEW_ENV === 'preview' ||
    process.env.PREVIEW_ENV === 'preview-pay'
  ) {
    await sleep(8000);
    return;
  } else if (
    process.env.VERCEL_ENV === 'production' ||
    process.env.PREVIEW_ENV === 'preview-lock'
  ) {
    // unlock unit
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
        return {
          error: 'Unlocking unsuccessful, try again',
        };
      }
      if (isSeamActionAttemptTimeoutError(e)) {
        return {
          error: 'Locking took too long',
        };
      }
      return {
        error: 'Unlocking unsuccessful, please try again',
      };
    }
  }
}

// --- session actions ---

export async function createSession(data: {
  unitId: Unit['id'];
  plungeTimerSecs: Session['plungeTimerSecs'];
}) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      plungeTimerSecs: plungeTimerSecsSchema,
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
      data: null,
    };
  }

  const { unitId, plungeTimerSecs } = validatedData.data;

  // create new session
  let newSession;
  try {
    newSession = await prisma.session.create({
      data: { userId: '1', unitId, plungeTimerSecs },
    });
  } catch (e) {
    // console.log(e);
    return {
      error: 'Failed to create new session',
      data: null,
    };
  }

  // create checkout session
  // await plungeCheckoutSession({ unitId, sessionId: newSession.id });
  // redirect(`/unit/${unitId}/unlock`);

  return {
    error: null,
    data: { newSessionId: newSession.id },
  };
}

export async function applyFreeCredit(data: { sessionId: Session['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
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
  if (plungeSession.userId !== '1') {
    return {
      error: 'Not authorized',
    };
  }

  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hasUsedCredit: true,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply free credit',
    };
  }

  try {
    await prisma.user.update({
      where: { id: '1' },
      data: {
        hasFreeCredit: false,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply free credit.',
    };
  }

  // redirect to unlock screen
  redirect(`/session/${sessionId}/unlock`);
}

export async function applyPaidCredit(data: { sessionId: Session['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
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
  if (plungeSession.userId !== '1') {
    return {
      error: 'Not authorized',
    };
  }

  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hasUsedCredit: true,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply credit',
    };
  }

  try {
    const userRecord = await prisma.user.findFirst({
      where: { id: '1' },
    });

    if (!userRecord) {
      return {
        error: 'Failed to apply plunge credit',
      };
    }

    await prisma.user.update({
      where: { id: '1' },
      data: {
        paidCredits: userRecord.paidCredits - 1,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply credit.',
    };
  }

  // redirect to unlock screen
  redirect(`/session/${sessionId}/unlock`);
}

export async function applyUnlimited(data: { sessionId: Session['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
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
  if (plungeSession.userId !== '1') {
    return {
      error: 'Not authorized',
    };
  }

  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hasUsedUnlimited: true,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply unlimited membership',
    };
  }

  try {
    await prisma.user.update({
      where: { id: '1' },
      data: {
        hasFreeCredit: false,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply unlimited membership.',
    };
  }

  // redirect to unlock screen
  redirect(`/session/${sessionId}/unlock`);
}

export async function startSession(data: { sessionId: Session['id'] }) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
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
  if (plungeSession.userId !== '1') {
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

export async function endSession(data: {
  sessionId: Session['id'];
  totalPlungeSecs: Session['totalPlungeSecs'];
}) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
      totalPlungeSecs: z.number(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId, totalPlungeSecs } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.userId !== '1') {
    return {
      error: 'Not authorized',
    };
  }

  // update session in db
  try {
    const sessionEnd = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { sessionEnd, totalPlungeSecs },
    });
  } catch (e) {
    return {
      error: 'Failed to end session',
    };
  }

  // redirect to session screen
  redirect(`/session/${sessionId}/close`);
}

// --- payment actions ---

export async function plungeCheckoutSession(data: {
  unitId: Unit['id'];
  sessionId: Session['id'];
}) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId, sessionId } = validatedData.data;

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.PLUNGE_PRICE_ID,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      mode: 'payment',
      // allow_promotion_codes: true,
      success_url: `${BASE_URL}/session/${sessionId}/unlock`,
      cancel_url: `${BASE_URL}/unit/${unitId}`,
      metadata: {
        price_id: process.env.PLUNGE_PRICE_ID,
        session_id: sessionId,
      },
    });
  } catch (e) {
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function packCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.PACK_PRICE_ID,
          quantity: 5,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      mode: 'payment',
      success_url: `${BASE_URL}/profile`,
      cancel_url: `${BASE_URL}/profile`,
      metadata: { price_id: process.env.PACK_PRICE_ID, quantity: 5 },
    });
  } catch (e) {
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function subscriptionCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      allow_promotion_codes: true,
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.SUBSCRIPTION_PRICE_ID,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      success_url: `${BASE_URL}/profile`,
      cancel_url: `${BASE_URL}/profile`,
      metadata: { price_id: process.env.SUBSCRIPTION_PRICE_ID },
    });
  } catch (e) {
    return {
      error: 'Subscription checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function billingPortalSession(data: {
  customerId: User['customerId'];
}) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      customerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { customerId } = validatedData.data;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${BASE_URL}/profile`,
  });

  // redirect user
  redirect(portalSession.url);
}

export async function customerDeletion(data: {
  customerId: User['customerId'];
}) {
  // authentication check
  // const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      customerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { customerId } = validatedData.data;

  let deletedCustomer;
  try {
    deletedCustomer = await stripe.customers.del(customerId);
  } catch (e) {
    // console.log("Customer deletion failed, please try again")
    return {
      error: 'Customer deletion failed, please try again',
    };
  }

  // console.log({deletedCustomer});

  if (!deletedCustomer.deleted) {
    // console.log("Customer deletion failed, please try again.")
    return {
      error: 'Customer deletion failed, please try again.',
    };
  }
}
