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
import { signIn, signOut } from '@/lib/auth-no-edge';
import {
  checkAuth,
  checkPlungeSession,
  getCodesbyLockId,
  getSessionById,
  getUnitById,
} from '@/lib/server-utils';
import { getTimeDiffSecs, sleep } from '@/lib/utils';
import {
  HealthQuizData,
  TSignupForm,
  TMemberDetailsForm,
  TSigninForm,
} from '@/lib/types';
import { BASE_URL, ONBOARDING_URLS } from '@/lib/constants';
import confirmEmail from '../../emails/confirm-email';
import passwordResetEmail from '../../emails/password-reset-email';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const seam = new Seam();
const resend = new Resend(process.env.RESEND_API_KEY);

// --- user actions ---

export async function signUp(
  data: TSignupForm & { callbackUrl: string | null },
) {
  // validation check
  const validatedData = signupSchema
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
      error: 'Account already exists',
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
  await signIn('credentials', { email, password });
}

export async function signInAction(
  data: TSigninForm & { callbackUrl: string | null },
) {
  // validation check
  const validatedData = signinSchema
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
        error: 'Invalid credentials',
      };

    hashedPassword = user.hashedPassword;
  } catch (e) {
    return {
      error: 'Invalid credentials provided',
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

  await signIn('credentials', { email, password });
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
        eConfCode: null,
        eConfCodeAt: null,
        pwResetCode: null,
        pwResetCodeAt: null,
        isEmailConfirmed: false,
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

    await prisma.session.deleteMany({ where: { userId: session.user.id } });
  } catch (e) {
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
  const validatedMemberDetails = memberDetailsSchema.safeParse(data);

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
      where: { id: session.user.id },
      data: { isWaiverSigned: true, waiverSigName, waiverSignedAt: new Date() },
    });
  } catch (e) {
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  // redirect to callback url, if available
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { authCallbackUrl: true },
  });
  const callbackUrl = user?.authCallbackUrl;

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

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeStatus } =
    await checkPlungeSession(session.user.id);
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
    };
  }

  const { unitId, plungeTimerSecs } = validatedData.data;

  // create new session
  let newSession;
  try {
    newSession = await prisma.session.create({
      data: { userId: session.user.id, unitId, plungeTimerSecs },
    });
  } catch (e) {
    // console.log(e);
    return {
      error: 'Failed to create new session',
    };
  }

  // create checkout session
  await createCheckoutSession({ unitId, sessionId: newSession.id });
  // redirect(`/unit/${unitId}/unlock`);
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

export async function createCheckoutSession(data: {
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
      customer_email: session.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_PRICE_ID,
          quantity: 1,
        },
      ],
      // automatic_tax: {
      //   enabled: true,
      // },
      mode: 'payment',
      success_url: `${BASE_URL}/session/${sessionId}/unlock`,
      cancel_url: `${BASE_URL}/unit/${unitId}`,
      metadata: { session_id: sessionId },
    });
  } catch (e) {
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

// --- email confirmation actions ---

export async function sendConfirmEmail() {
  // auth check
  const session = await checkAuth();
  if (!session.user?.email) redirect('/');

  // generate 6 digit code
  const eConfCode = String(Math.floor(100000 + Math.random() * 900000));
  const eConfCodeAt = new Date();

  // add code to user record
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { eConfCode, eConfCodeAt },
    });
  } catch (e) {
    return {
      error: 'Failed to create code',
    };
  }

  try {
    await resend.emails.send({
      from: 'KoldUp <info@koldup.com>',
      to: [session.user.email],
      subject: 'Confirm your email',
      react: confirmEmail({ eConfCode }),
    });
    // return { success: true, dataResend, recipient };
  } catch (error) {
    return { error: 'Failed to send email' };
  }
}

export async function checkEmailConfirmCode(data: {
  eConfCode: User['eConfCode'];
}) {
  // auth check
  const session = await checkAuth();

  // validation check
  const validatedData = emailConfirmCodeSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { eConfCode } = validatedData.data;

  // get user data
  let user;
  try {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
  } catch (e) {
    return {
      error: 'Code check failed, please try again',
    };
  }

  // check user exists (possibly redundant check)
  if (!user) {
    redirect('/signup');
  }

  // check confirmation code exists
  if (!user.eConfCode) {
    return {
      error: 'No confirmation code found, please hit resend',
    };
  }

  // check code provided by user
  if (eConfCode !== user.eConfCode) {
    return {
      error: 'Code is not correct, please try again',
    };
  }

  // check code has not expired
  const now = new Date();
  const secsSinceCodeCreated = getTimeDiffSecs(user.eConfCodeAt, now);
  const hasCodeExpired = secsSinceCodeCreated && secsSinceCodeCreated > 10 * 60;
  if (hasCodeExpired) {
    return {
      error: 'Code has expired, please hit resend',
    };
  }

  // set user email to confirmed
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isEmailConfirmed: true },
    });
  } catch (e) {
    return {
      error: 'Code check failed, please try again.',
    };
  }

  redirect('/member-details');
}

// --- password reset actions ---

export async function sendPwResetEmail(data: { email: User['email'] }) {
  // validation check
  const validatedData = signupSchema.pick({ email: true }).safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email } = validatedData.data;

  // check user exists
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    return {
      error: 'Account does not exist, please try again',
    };
  }
  if (!user) {
    return {
      error: 'No account found with this email',
    };
  }

  // generate 6 digit code
  const pwResetCode = String(Math.floor(100000 + Math.random() * 900000));
  const pwResetCodeAt = new Date();

  // add code to user record
  try {
    await prisma.user.update({
      where: { email },
      data: { pwResetCode, pwResetCodeAt },
    });
  } catch (e) {
    return {
      error: 'Failed to create code',
    };
  }

  // send code
  try {
    await resend.emails.send({
      from: 'KoldUp <info@koldup.com>',
      to: [email],
      subject: 'Reset your password',
      react: passwordResetEmail({ pwResetCode }),
    });
    // return { success: true, dataResend, recipient };
  } catch (error) {
    return { error: 'Failed to send email' };
  }
}

export async function checkPwResetCode(data: {
  email: User['email'];
  pwResetCode: User['pwResetCode'];
}) {
  // validation check
  const validatedData = pwResetCodeSchema
    .pick({ pwResetCode: true, email: true })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { pwResetCode, email } = validatedData.data;

  // get user data
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    return {
      error: 'Account lookup failed, please try again',
    };
  }

  // check user exists
  if (!user) {
    return {
      error: 'No account found with this email',
    };
  }

  // check confirmation code exists
  if (!user.pwResetCode) {
    return {
      error: 'No password reset code found, please try again',
    };
  }

  // check code provided by user
  if (pwResetCode !== user.pwResetCode) {
    return {
      error: 'Code is not correct, please try again',
    };
  }

  // check code has not expired
  const now = new Date();
  const secsSinceCodeCreated = getTimeDiffSecs(user.pwResetCodeAt, now);
  const hasCodeExpired = secsSinceCodeCreated && secsSinceCodeCreated > 10 * 60;
  if (hasCodeExpired) {
    return {
      error: 'Code has expired, please try again',
    };
  }
}

export async function updatePassword(data: {
  email: User['email'];
  pwResetCode: User['pwResetCode'];
  newPassword: string;
  newPasswordConfirm: string;
}) {
  // validation check
  const validatedData = pwResetCodeSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, newPassword } = validatedData.data;

  // update user password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  try {
    await prisma.user.update({
      where: { email },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to update password',
    };
  }
}

export async function accessResetPassword() {
  // signin
  await signIn('credentials', {
    email: process.env.RESET_PASSWORD_EMAIL,
    password: process.env.RESET_PASSWORD_PW,
  });
}
