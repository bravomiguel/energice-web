'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/db';
// import { petFormSchema, petIdSchema } from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';

// --- user actions ---

export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());

  await signIn('credentials', authData);
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}