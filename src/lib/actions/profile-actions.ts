'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Profile, Unit } from '@prisma/client';

import prisma from '@/lib/db';
import {
  memberDetailsSchema,
  waiverDataSchema,
  phoneOtpSchema,
  PartnerMemberSchema,
} from '@/lib/validations';
import { checkAuth, getOrCreateProfileById } from '@/lib/server-utils';
import {
  TMemberDetailsForm,
  TPhoneOtpForm,
  TPartnerMemberForm,
} from '@/lib/types';
import { createServerClient } from '@/lib/supabase/server';
import { signOut } from './auth-actions';
import {
  createCustomer,
  deleteCustomer,
  updateCustomerName,
} from './payment-actions';

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
        phone: `1${phone}`,
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
  // console.log({ profileEmail: profile?.email });
  // console.log({ userEmail: user.email });

  if (profile && profile.email.toLowerCase() !== user.email?.toLowerCase()) {
    console.error('Phone is registered to a different account.');
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

  // create / reinstate profile record
  await createProfile();

  // save number in profile record
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { phone: `1${phone}` },
    });
  } catch (e) {
    console.error(e);
    // return {
    //   error: 'Error saving verified phone to profile',
    // };
    redirect('/member-details');
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
  if (!user?.user_metadata?.name) {
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

  // update stripe customer name
  const { stripeCustomerId } = await getOrCreateProfileById(user.id);
  const updateCustResp = await updateCustomerName({
    stripeCustomerId,
    name,
  });
  if (updateCustResp?.error) {
    console.error('Error updating stripe customer:', updateCustResp.error);
    return {
      error: 'Failed to update stripe customer',
    };
  }

  redirect('/waiver');
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
    console.error(e);
    return {
      error: 'Failed to complete sign waiver operation',
    };
  }

  redirect('/');
}

export async function createProfile() {
  const user = await checkAuth();

  const { id, email } = user;

  if (!email) {
    signOut();
    redirect('/signin');
    // return { data: null, error: 'Email not found.' };
  }

  // Create stripe customer id
  const { stripeCustomerId, error } = await createCustomer({
    email,
  });
  if (!stripeCustomerId) {
    console.error('Error creating stripe customer id:', error);
    return { data: null, error: 'Failed to create profile' };
  }

  // Grab deleted profile based on email, if it exists
  let profile;
  try {
    profile = await prisma.profile.findUnique({
      where: {
        email,
        // deleted: true,
      },
    });
  } catch (e) {
    console.error('Error checking for existing profile:', e);
    return { data: null, error: 'Failed to create profile' };
  }

  // reinstate deleted profile if it exists (with new customer id)
  if (profile && profile.deleted) {
    try {
      const reinstatedProfile = await prisma.profile.update({
        where: {
          email,
        },
        data: {
          id,
          stripeCustomerId,
          deleted: false,
          deletedAt: null,
        },
      });

      console.log('Profile reinstated successfully');

      return { data: reinstatedProfile, error: null };
    } catch (e) {
      console.error('Error reinstating profile', e);
      return { error: 'Failed to create profile' };
    }
  }

  // create new profile otherwise
  if (!profile) {
    try {
      const newProfile = await prisma.profile.create({
        data: {
          id,
          email,
          stripeCustomerId,
          freeCredits: 1,
        },
      });

      console.log('Profile created successfully');

      return { data: newProfile, error: null };
    } catch (e) {
      console.error('Error creating profile:', e);
      return { data: null, error: 'Failed to create profile' };
    }
  }

  // return profile if it already exists and is active
  return { data: profile, error: null };
}

export async function deleteProfile() {
  const user = await checkAuth();
  const { id } = user;

  // delete stripe customer
  let stripeCustomerId;
  try {
    const profile = await prisma.profile.findUnique({ where: { id } });
    stripeCustomerId = profile?.stripeCustomerId;
  } catch (e) {
    console.error(e);
    return {
      error: 'Error getting customer id',
    };
  }

  if (stripeCustomerId) {
    await deleteCustomer({ stripeCustomerId });
  }

  // mark profile as deleted
  try {
    await prisma.profile.update({
      where: { id },
      data: {
        name: null,
        // stripeCustomerId: null,
        isWaiverSigned: false,
        waiverSignedAt: null,
        waiverSigName: null,
        isMember: false,
        memberPayFailed: null,
        memberPeriodEnd: null,
        memberRenewing: null,
        sweat440MemberEmail: null,
        hasS440MemberCredit: false,
        deleted: true,
        deletedAt: new Date(),
      },
    });

    console.log('Profile successfully marked as deleted and reset');
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to delete profile',
    };
  }

  // delete user sessions
  try {
    await prisma.session.deleteMany({ where: { profileId: id } });
    console.log('Profile sessions deleted successfully');
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to delete sessions',
    };
  }

  return {
    message: 'Profile successfully marked as deleted',
  };
}

export async function confirmPartnerMembership(data: {
  email: TPartnerMemberForm['email'];
  unitId: Unit['id'];
  singlePlunge: boolean;
  unlimitedMembership: boolean;
  extraCredit: boolean;
}) {
  // get user
  const user = await checkAuth();

  // validation check
  const validatedData = PartnerMemberSchema.extend({
    unitId: z.string(),
    singlePlunge: z.boolean(),
    unlimitedMembership: z.boolean(),
    extraCredit: z.boolean(),
  }).safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, unitId, singlePlunge, unlimitedMembership, extraCredit } =
    validatedData.data;

  // check if provided email already assigned to another account
  let isMembershipAssigned;
  try {
    const profile = await prisma.profile.findFirst({
      where: { email: email.toLowerCase(), id: { not: user.id } },
    });
    isMembershipAssigned = !profile?.sweat440MemberEmail;
  } catch (e) {
    console.error(e);
    return { error: 'Lookup error, please try again' };
  }

  if (isMembershipAssigned) {
    return { error: 'Membership is assigned to a different account.' };
  }

  // check if provided email is in sweat400 member email list
  let sweat440Member;
  try {
    sweat440Member = await prisma.sweat440Member.findUnique({
      where: { email: email.toLowerCase() },
    });
  } catch (e) {
    console.error(e);
    return { error: 'Lookup error, please try again.' };
  }

  if (!sweat440Member?.email) {
    console.log({ sweat440Member });
    return { error: 'No member found with this email' };
  }

  // add sweat440 email to user record, and add extra member credit
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        sweat440MemberEmail: email.toLowerCase(),
        hasS440MemberCredit: extraCredit,
      },
    });
  } catch (e) {
    console.error(e);
    return { error: 'No member found with this email.' };
  }

  if (singlePlunge) {
    redirect(`/unit/${unitId}?sweat440Member=true`);
  }

  if (unlimitedMembership) {
    return;
  }

  redirect('/');
}
