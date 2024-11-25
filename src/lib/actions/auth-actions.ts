'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';

import { signinSchema } from '@/lib/validations';
import { TSigninForm } from '@/lib/types';
import {
  createServerAdminClient,
  createServerClient,
} from '@/lib/supabase/server';
import { deleteProfile } from './profile-actions';

export async function signinWithEmail(
  data: TSigninForm & { prelaunchCheckout: boolean },
) {
  // console.log({ data });
  // validation check
  const validatedData = signinSchema
    .extend({ prelaunchCheckout: z.boolean() })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, prelaunchCheckout } = validatedData.data;

  const supabase = await createServerClient();

  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: prelaunchCheckout
        ? `${origin}/api/auth/email-callback?prelaunchCheckout=true&`
        : `${origin}/api/auth/email-callback?`,
    },
  });

  if (error) {
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  redirect(
    prelaunchCheckout
      ? '/signin?prelaunchCheckout=true&success=true'
      : '/signin?success=true',
  );
}

export async function signinWithGoogle(data: { prelaunchCheckout: boolean }) {
  const validatedData = z
    .object({ prelaunchCheckout: z.boolean() })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { prelaunchCheckout } = validatedData.data;

  const origin = (await headers()).get('origin');

  const supabase = await createServerClient();

  const { data: dataOAuth, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: prelaunchCheckout
        ? `${origin}/api/auth/google-callback?prelaunchCheckout=true`
        : `${origin}/api/auth/google-callback`,
    },
  });

  if (error) {
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  if (dataOAuth.url) {
    redirect(dataOAuth.url); // use the redirect API for your server framework
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
