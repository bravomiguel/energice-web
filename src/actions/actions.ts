'use server';

// import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import prisma from '@/lib/db';
import {
  authFormSchema,
  healthQuizDataSchema,
  memberDetailsFormSchema,
} from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';
import { checkAuth, getCodesbyLockId } from '@/lib/server-utils';
import { AuthError } from 'next-auth';
import { Seam } from 'seam';

// --- user actions ---

export async function signUp(data: unknown) {
  const validatedData = authFormSchema
    .extend({ callbackUrl: z.union([z.null(), z.string().trim().url()]) })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: validatedData.data.email,
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

  if (user && user.deleted) {
    try {
      await prisma.user.update({
        where: {
          email: validatedData.data.email,
        },
        data: {
          hashedPassword,
          firstName: null,
          lastName: null,
          dob: null,
          authCallbackUrl: validatedData.data.callbackUrl,
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

  if (!user) {
    try {
      await prisma.user.create({
        data: {
          email: validatedData.data.email,
          authCallbackUrl: validatedData.data.callbackUrl,
          hashedPassword,
        },
      });
    } catch (e) {
      return {
        error: 'Failed to create account',
      };
    }
  }

  try {
    await signIn('credentials', {
      email: validatedData.data.email,
      password: validatedData.data.password,
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

export async function signInAction(data: unknown) {
  const validatedData = authFormSchema
    .extend({ callbackUrl: z.union([z.null(), z.string().trim().url()]) })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  let hashedPassword;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.data.email,
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

  const passwordsMatch = await bcrypt.compare(
    validatedData.data.password,
    hashedPassword,
  );

  if (!passwordsMatch)
    return {
      error: 'Error, invalid credentials',
    };

  try {
    await prisma.user.update({
      where: {
        email: validatedData.data.email,
        hashedPassword,
        deleted: false,
      },
      data: {
        authCallbackUrl: validatedData.data.callbackUrl ?? null,
      },
    });
  } catch (e) {
    return {
      error: 'Sign in failed, please try again',
    };
  }

  try {
    await signIn('credentials', {
      email: validatedData.data.email,
      password: validatedData.data.password,
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

export async function addMemberDetails(data: unknown) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedMemberDetails = memberDetailsFormSchema.safeParse(data);

  if (!validatedMemberDetails.success) {
    return {
      error: validatedMemberDetails.error.issues[0].message,
    };
  }

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

export async function saveHealthQuiz(data: unknown) {
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

  // get callback url
  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { authCallbackUrl: true },
  });
  const callbackUrl = data?.authCallbackUrl;

  if (!callbackUrl) redirect('/');

  redirect(callbackUrl);
}

// --- session actions ---

export async function createActiveSession(data: unknown) {
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
      data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId } = validatedData.data;

  // create new active session
  let newSession;
  try {
    newSession = await prisma.session.create({
      data: { userId: session.user.id, unitId, isActive: true },
    });
  } catch (e) {
    return {
      data: null,
      error: 'Failed to create new active session',
    };
  }

  return {
    data: newSession.id,
    error: null,
  };
}

// --- unit actions ---

const seam = new Seam();

export async function createLockCode(data: unknown) {
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

export async function getLatestActiveCode(data: unknown) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      lockDeviceId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { lockDeviceId } = validatedData.data;

  // get active codes
  let activeTimeBoundCodes;
  try {
    const codes = await getCodesbyLockId(lockDeviceId);

    activeTimeBoundCodes = codes
      .filter((code: any) => code.status === 'set')
      .filter((code) => code.type === 'time_bound');

    if (activeTimeBoundCodes.length === 0) {
      // await createLockCode({
      //   lockDeviceId,
      //   minsLaterEndTime: 3,
      // });

      return {
        data: null,
        error: 'No active codes',
      };
    }
  } catch (e) {
    return {
      data: null,
      error: 'Failed to get codes',
    };
  }

  // return newest active code
  return {
    data: activeTimeBoundCodes.at(-1),
    error: null,
  };
}

export async function unlockAction(data: unknown) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      lockDeviceId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { lockDeviceId, unitId } = validatedData.data;

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
    // if (verifyResponse.status === 'success') {
    //   console.log('Unlocking successful.');
    // }
  } catch (e) {
    return {
      data: null,
      error: 'Unlocking unsuccessful, please try again',
    };
  }

  // fire "create new session" server action
  await createActiveSession({ unitId });
}
