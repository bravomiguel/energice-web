'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
// import { AuthError } from 'next-auth';
import { Profile } from '@prisma/client';

import prisma from '@/lib/db';
import {
  memberDetailsSchema,
  waiverDataSchema,
  phoneOtpSchema,
} from '@/lib/validations';
import { checkAuth } from '@/lib/server-utils';
import { TMemberDetailsForm, TPhoneOtpForm } from '@/lib/types';
import { createServerClient } from '@/lib/supabase/server';

export async function sendPhoneOtp(data: Pick<TPhoneOtpForm, 'phone'>) {
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

  // check if phone registered with different account
  let profile;
  try {
    profile = await prisma.profile.findFirst({
      where: {
        phone,
      },
    });
  } catch (e) {
    console.error('Error checking if phone is already registered:', e);
    return {
      error: 'Error checking if phone is already registered',
    };
  }

  const user = await checkAuth();

  // console.log(profile);
  // console.log({profileEmail: profile?.email});
  // console.log({userEmail: user.email});

  if (profile && profile.email !== user.email) {
    console.error('Error checking if phone is already registered');
    return {
      error: 'This phone is registered to a different account.',
    };
  }

  const { error } = await supabase.auth.updateUser({ phone: `1${phone}` });

  if (error) {
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  redirect('/confirm-phone?otpSent=true');
}

export async function verifyPhoneOtp(data: TPhoneOtpForm) {
  // get user
  const user = await checkAuth();

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
    console.error(error.code + ': ' + error.message);
    return {
      error: error.message,
    };
  }

  // save number in profile record
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { phone: `1${phone}` },
    });
  } catch (e) {
    console.error(e);
    return {
      error: 'Error saving verified phone to profile',
    };
  }

  redirect('/member-details');
}

export async function addMemberDetails(data: TMemberDetailsForm) {
  // get user
  const user = await checkAuth();

  // validation check
  const validatedData = memberDetailsSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const name = `${validatedData.data.firstName} ${validatedData.data.lastName}`;

  // update user metadata if needed
  if (!!user?.user_metadata?.name && name !== user?.user_metadata?.name) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({ data: { name } });

    if (error) {
      console.error(error.code + ': ' + error.message);
      return {
        error: error.message,
      };
    }
  }

  // update user record
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { name },
    });
  } catch (e) {
    return {
      error: 'Failed to save member details',
    };
  }

  redirect('waiver');
}

export async function signWaiver(data: Pick<Profile, 'waiverSigName'>) {
  // authentication check
  const user = await checkAuth();

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
      where: { id: user.id },
      data: { isWaiverSigned: true, waiverSigName, waiverSignedAt: new Date() },
    });
  } catch (e) {
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  redirect('/');
}
