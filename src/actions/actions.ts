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
      errors: validatedFormData.error.flatten().fieldErrors,
    };
  }

  try {
    const deletedUser = await prisma.user.findUnique({
      where: {
        email: validatedFormData.data.email,
        deleted: true,
      },
    });

    if (deletedUser) {
      await prisma.user.update({
        where: {
          email: validatedFormData.data.email,
        },
        data: {
          deleted: false,
          recreatedAt: new Date(),
        },
      });
    }
  } catch (e) {
    throw new Error('Failed to complete deleted user check');
  }

  try {
    const hashedPassword = await bcrypt.hash(
      validatedFormData.data.password,
      10,
    );

    await prisma.user.create({
      data: {
        email: validatedFormData.data.email,
        hashedPassword,
      },
    });
  } catch (e) {
    throw new Error('Failed to create user');
  }

  await signIn('credentials', validatedFormData.data);
}

export async function signInAction(formData: unknown) {
  const validatedFormData = authFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      errors: validatedFormData.error.flatten().fieldErrors,
    };
  }

  await signIn('credentials', validatedFormData.data);
}

export async function signOutAction() {
  await signOut({ redirectTo: '/signin' });
}

export async function deleteAccount(email: unknown) {
  const validatedEmail = authFormSchema.pick({ email: true }).safeParse(email);

  if (!validatedEmail.success) {
    return {
      errors: validatedEmail.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: {
        email: validatedEmail.data.email,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
  } catch (e) {
    throw new Error('Failed to delete account');
  }

  await signOut({ redirectTo: '/signup' });
}
