'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
// import { AuthError } from 'next-auth';
import {
  Seam,
  isSeamActionAttemptFailedError,
  isSeamActionAttemptTimeoutError,
} from 'seam';
import { headers } from 'next/headers';
import { Session, Unit, Profile } from '@prisma/client';

import prisma from '@/lib/db';
import {
  memberDetailsSchema,
  plungeTimerSecsSchema,
  signinSchema,
  waiverDataSchema,
  phoneOtpSchema,
} from '@/lib/validations';
import {
  checkAuth,
  checkPlungeSession,
  getCodesbyLockId,
  getSessionById,
  getUnitById,
  getUserProfileById,
} from '@/lib/server-utils';
import { getTimeDiffSecs, isUserOver18, sleep } from '@/lib/utils';
import {
  TMemberDetailsForm,
  TSigninForm,
  TPhoneConfirmForm,
  TPhoneOtpForm,
} from '@/lib/types';
import { BASE_URL } from '@/lib/constants';
import { createServerAdminClient, createServerClient } from '@/lib/supabase/server';
import { UserAttributes } from '@supabase/supabase-js';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const seam = new Seam();

// --- user actions ---

export async function signinWithEmail(data: TSigninForm) {
  // validation check
  const validatedData = signinSchema.safeParse(data);

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
      emailRedirectTo: `${origin}/api/auth/email-callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return {
      error: error.message,
    };
  }

  redirect('/signin?success=true');
}

export async function signinWithGoogle() {
  const origin = (await headers()).get('origin');

  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/google-callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return {
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function sendPhoneOtp(data: TPhoneConfirmForm) {
  // data validation check
  const validatedData = z
    .object({
      phone: z.string().trim().length(10, { message: 'Invalid phone format' }),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { phone } = validatedData.data;

  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({ phone: `1${phone}` });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return {
      error: error.message,
    };
  }
}

export async function verifyPhone(data: TPhoneOtpForm & { phone: string }) {
  // data validation check
  const validatedData = phoneOtpSchema
    .merge(z.object({ phone: z.string().trim().length(10) }))
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { phone, token } = validatedData.data;

  const supabase = await createServerClient();

  const { error } = await supabase.auth.verifyOtp({
    phone: `1${phone}`,
    token,
    type: 'phone_change',
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return {
      error: error.message,
    };
  }
}

export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return redirect('/signin');
}

export async function createUserProfile() {
  //  grab profile based on email, if it already exists
  // let profile;
  // try {
  //   profile = await prisma.profile.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  // } catch (e) {
  //   console.error(e);
  //   return {
  //     error: 'Existing profile check failed',
  //   };
  // }
  // // if (profile && !profile.deleted) {
  // //   return {
  // //     error: 'Account already exists',
  // //   };
  // // }
  // // create stripe customer id for user
  // const { stripeCustomerId, error: stripeError } = await customerCreation({
  //   email,
  // });
  // if (stripeError) {
  //   console.error(stripeError);
  //   return {
  //     error: 'Stripe customer creation failed',
  //   };
  // }
  // // reinstate profile if previously deleted
  // if (profile && profile.deleted) {
  //   try {
  //     await prisma.profile.update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         id: user.id,
  //         stripeCustomerId,
  //         firstName: null,
  //         lastName: null,
  //         deleted: false,
  //         deletedAt: null,
  //       },
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return {
  //       error: 'Failed to reinstate profile',
  //     };
  //   }
  // }
  // // create profile if it doesn't exist
  // if (!profile) {
  //   try {
  //     await prisma.profile.create({
  //       data: {
  //         email,
  //       },
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return {
  //       error: 'Failed to create account',
  //     };
  //   }
  // }
}

export async function deleteAccount() {
  // const user = await getUserProfileById('1');
  // if (user?.stripeCustomerId) {
  //   await customerDeletion({ stripeCustomerId: user.stripeCustomerId });
  // }

  // try {
  //   await prisma.profile.update({
  //     where: {
  //       id: '1',
  //     },
  //     data: {
  //       firstName: null,
  //       lastName: null,
  //       isWaiverSigned: false,
  //       waiverSignedAt: null,
  //       waiverSigName: null,
  //       credits: 0,
  //       stripeCustomerId: null,
  //       isMember: false,
  //       memberPayFailed: null,
  //       memberPeriodEnd: null,
  //       memberRenewing: null,
  //       deleted: true,
  //       deletedAt: new Date(),
  //     },
  //   });

  //   await prisma.session.deleteMany({ where: { userId: '1' } });
  // } catch (e) {
  //   return {
  //     error: 'Failed to delete user',
  //   };
  // }

  // await signOut({ redirectTo: '/signup' });

  const supabase = await createServerAdminClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    console.error(getUserError.code + ' ' + getUserError.message);
    return {
      error: getUserError.message,
    };
  }

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
    user?.id ?? '',
  );

  if (deleteUserError) {
    console.error(deleteUserError.code + ' ' + deleteUserError.message);
    return {
      error: deleteUserError.message,
    };
  }

  redirect('/signin');
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
    await prisma.profile.update({
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

// --- waiver actions ---

export async function signWaiver(data: Pick<Profile, 'waiverSigName'>) {
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
    await prisma.profile.update({
      where: { id: '1' },
      data: { isWaiverSigned: true, waiverSigName, waiverSignedAt: new Date() },
    });
  } catch (e) {
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  redirect('/');
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

  // try {
  //   await prisma.profile.update({
  //     where: { id: '1' },
  //     data: {
  //       hasFreeCredit: false,
  //     },
  //   });
  // } catch (e) {
  //   return {
  //     error: 'Failed to apply free credit.',
  //   };
  // }

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
    const userRecord = await prisma.profile.findFirst({
      where: { id: '1' },
    });

    if (!userRecord) {
      return {
        error: 'Failed to apply plunge credit',
      };
    }

    await prisma.profile.update({
      where: { id: '1' },
      data: {
        credits: userRecord.credits - 1,
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

  // try {
  //   await prisma.profile.update({
  //     where: { id: '1' },
  //     data: {
  //       hasFreeCredit: false,
  //     },
  //   });
  // } catch (e) {
  //   return {
  //     error: 'Failed to apply unlimited membership.',
  //   };
  // }

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
  customerId: Profile['stripeCustomerId'];
}) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId } = validatedData.data;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${BASE_URL}/profile`,
  });

  // redirect user
  redirect(portalSession.url);
}

export async function customerDeletion(data: {
  stripeCustomerId: Profile['stripeCustomerId'];
}) {
  // authentication check
  // const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId } = validatedData.data;

  let deletedCustomer;
  try {
    deletedCustomer = await stripe.customers.del(stripeCustomerId);
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

export async function customerCreation(data: { email: Profile['email'] }) {
  // validation check
  const validatedData = z
    .object({
      email: z.string(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email } = validatedData.data;

  let customer;
  try {
    customer = await stripe.customers.create({ email });
  } catch (e) {
    // console.log("Customer deletion failed, please try again")
    return {
      error: 'Customer creation failed',
    };
  }

  // console.log({customer});
  const stripeCustomerId: string = customer.id;

  return { stripeCustomerId };
}
