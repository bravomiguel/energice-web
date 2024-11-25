'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { signinSchema } from '@/lib/validations';
import { TSigninForm } from '@/lib/types';
import {
  createServerAdminClient,
  createServerClient,
} from '@/lib/supabase/server';
import { deleteProfile } from './profile-actions';

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
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: `${origin}/api/auth/email-callback`,
    },
  });

  if (error) {
    console.error(error.code + ': ' + error.message);
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
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return redirect('/signin');
}

export async function deleteAccount() {
  const supabase = await createServerAdminClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  // reset profile and mark as deleted
  await deleteProfile();

  if (getUserError) {
    console.error(getUserError.code + ': ' + getUserError.message);
    return {
      error: getUserError.message,
    };
  }

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
    user?.id ?? '',
  );

  if (deleteUserError) {
    console.error(deleteUserError.code + ': ' + deleteUserError.message);
    return {
      error: deleteUserError.message,
    };
  }

  redirect('/signin');
}
