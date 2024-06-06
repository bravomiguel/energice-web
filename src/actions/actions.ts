'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import { authFormSchema } from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';

// --- user actions ---

export async function signUp(formData: unknown) {
  const validatedFormData = authFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      errorCode: validatedFormData.error.issues[0].code,
      errorMessage: validatedFormData.error.issues[0].message,
    };
  }

  const hashedPassword = await bcrypt.hash(validatedFormData.data.password, 10);

  const user = await prisma.user.findUnique({
    where: {
      email: validatedFormData.data.email
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
        email: validatedFormData.data.email,
      },
      data: {
        hashedPassword,
        deleted: false,
        deletedAt: null,
      },
    });
  }

  if (!user) {
    await prisma.user.create({
      data: {
        email: validatedFormData.data.email,
        hashedPassword,
      },
    });
  }

  await signIn('credentials', validatedFormData.data);
}

export async function signInAction(formData: unknown) {
  const validatedFormData = authFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      errorCode: validatedFormData.error.issues[0].code,
      errorMessage: validatedFormData.error.issues[0].message,
    };
  }

  await signIn('credentials', validatedFormData.data);
}

export async function signOutAction() {
  await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount(email: unknown) {
  const validatedEmail = authFormSchema
    .pick({ email: true })
    .safeParse({ email });

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
