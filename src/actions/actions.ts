'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import {
  authFormSchema,
  healthQuizDataSchema,
  memberDetailsFormSchema,
} from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// --- user actions ---

export async function signUp(data: unknown) {
  const validatedCredentials = authFormSchema.safeParse(data);

  if (!validatedCredentials.success) {
    return {
      errorCode: validatedCredentials.error.issues[0].code,
      errorMessage: validatedCredentials.error.issues[0].message,
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
      errorCode: 'already_signed_up',
      errorMessage: "You've already signed up, please sign in",
    };
  }

  if (user && user.deleted) {
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
  }

  if (!user) {
    await prisma.user.create({
      data: {
        email: validatedCredentials.data.email,
        hashedPassword,
      },
    });
  }

  await signIn('credentials', validatedCredentials.data);
}

export async function signInAction(data: unknown) {
  const validatedCredentials = authFormSchema.safeParse(data);

  if (!validatedCredentials.success) {
    return {
      errorCode: validatedCredentials.error.issues[0].code,
      errorMessage: validatedCredentials.error.issues[0].message,
    };
  }

  await signIn('credentials', validatedCredentials.data);
}

export async function signOutAction() {
  await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount(data: unknown) {
  const validatedEmail = authFormSchema
    .pick({ email: true })
    .safeParse({ email: data });

  if (!validatedEmail.success) {
    return {
      errorCode: validatedEmail.error.issues[0].code,
      errorMessage: validatedEmail.error.issues[0].message,
    };
  }

  await prisma.user.update({
    where: {
      email: validatedEmail.data.email,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
  });

  await signOut({ redirectTo: '/signup' });
}

export async function getUser() {
  const session = await auth();
  const email = session?.user?.email ?? undefined;

  if (!email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  return user;
}

// --- member details actions ---

export async function addMemberDetails(data: unknown) {
  const validatedMemberDetails = memberDetailsFormSchema.safeParse(data);

  if (!validatedMemberDetails.success) {
    return {
      errorCode: validatedMemberDetails.error.issues[0].code,
      errorMessage: validatedMemberDetails.error.issues[0].message,
    };
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    redirect('/signin');
  }

  await prisma.user.update({
    where: { email },
    data: { ...validatedMemberDetails.data },
  });

  redirect('/health-quiz');
}

// --- health quiz actions ---

export async function saveHealthQuiz(data: unknown) {
  const validatedQuizData = healthQuizDataSchema.safeParse(data);

  if (!validatedQuizData.success) {
    return {
      errorCode: validatedQuizData.error.issues[0].code,
      errorMessage: validatedQuizData.error.issues[0].message,
    };
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    redirect('/signin');
  }

  await prisma.user.update({
    where: { email },
    data: { healthQuiz: JSON.stringify(validatedQuizData.data) },
  });

  redirect('/health-quiz/outcome');
}
