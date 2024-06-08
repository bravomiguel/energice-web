'use server';

// import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import prisma from '@/lib/db';
import {
  authFormSchema,
  healthQuizDataSchema,
  memberDetailsFormSchema,
} from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';
import { checkAuth } from '@/lib/server-utils';

// --- user actions ---

export async function signUp(data: unknown) {
  const validatedCredentials = authFormSchema.safeParse(data);

  if (!validatedCredentials.success) {
    return {
      error: validatedCredentials.error.issues[0].message,
    };
  }

  const hashedPassword = await bcrypt.hash(
    validatedCredentials.data.password,
    10,
  );

  const user = await prisma.user.findUnique({
    where: {
      email: validatedCredentials.data.email,
    },
  });

  if (user && !user.deleted) {
    return {
      error: "You've already signed up, please sign in",
    };
  }

  if (user && user.deleted) {
    try {
      await prisma.user.update({
        where: {
          email: validatedCredentials.data.email,
        },
        data: {
          hashedPassword,
          firstName: null,
          lastName: null,
          dob: null,
          deleted: false,
          deletedAt: null,
        },
      });
    } catch (e) {
      return {
        error: 'Failed to recreate user',
      };
    }
  }

  if (!user) {
    try {
      await prisma.user.create({
        data: {
          email: validatedCredentials.data.email,
          hashedPassword,
        },
      });
    } catch (e) {
      return {
        error: 'Failed to create user',
      };
    }
  }

  await signIn('credentials', validatedCredentials.data);
}

export async function signInAction(data: unknown) {
  const validatedCredentials = authFormSchema.safeParse(data);

  if (!validatedCredentials.success) {
    return {
      error: validatedCredentials.error.issues[0].message,
    };
  }

  await signIn('credentials', validatedCredentials.data);
}

export async function signOutAction() {
  await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount() {
  // authentication check
  const session = await checkAuth();

  try {
    const resp = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
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

  redirect('/plunge');
}
