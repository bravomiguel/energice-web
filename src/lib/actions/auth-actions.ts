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
  data: TSigninForm & { nonmemberCheckout: boolean; memberCheckout: boolean },
) {
  // console.log({ data });
  // validation check
  const validatedData = signinSchema
    .extend({ nonmemberCheckout: z.boolean(), memberCheckout: z.boolean() })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, nonmemberCheckout, memberCheckout } = validatedData.data;

  const supabase = await createServerClient();

  const origin = (await headers()).get('origin');

  const emailRedirectTo = memberCheckout
    ? `${origin}/api/auth/email-callback?memberCheckout=true&`
    : nonmemberCheckout
    ? `${origin}/api/auth/email-callback?nonmemberCheckout=true&`
    : `${origin}/api/auth/email-callback?`;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: { emailRedirectTo },
  });

  if (error) {
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  redirect(
    nonmemberCheckout
      ? '/signin?nonmemberCheckout=true&success=true'
      : '/signin?success=true',
  );
}

export async function signinWithGoogle(data: {
  nonmemberCheckout: boolean;
  memberCheckout: boolean;
}) {
  const validatedData = z
    .object({ nonmemberCheckout: z.boolean(), memberCheckout: z.boolean() })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error.message);
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { nonmemberCheckout, memberCheckout } = validatedData.data;

  const origin = (await headers()).get('origin');

  const supabase = await createServerClient();

  const redirectTo = memberCheckout
    ? `${origin}/api/auth/google-callback?memberCheckout=true`
    : nonmemberCheckout
    ? `${origin}/api/auth/google-callback?nonmemberCheckout=true`
    : `${origin}/api/auth/google-callback`;

  const { data: dataOAuth, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
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
