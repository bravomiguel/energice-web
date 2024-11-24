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
import { checkAuth, getProfileById } from '@/lib/server-utils';
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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

  if (profile && profile.email !== user.email) {
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
  const { stripeCustomerId } = await getProfileById(user.id);
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
  }

  // Create stripe customer id
  const { stripeCustomerId, error } = await createCustomer({
    email,
  });
  if (!stripeCustomerId) {
    console.error('Error creating stripe customer id:', error);
    return {
      error: 'Failed to create profile',
    };
  }

  // Grab deleted profile based on email, if it exists
  let deletedProfile;
  try {
    deletedProfile = await prisma.profile.findUnique({
      where: {
        email,
        deleted: true,
      },
    });
  } catch (e) {
    console.error('Error checking for existing profile:', e);
    return { error: 'Failed to create profile' };
  }

  // reinstate deleted profile if it exists (with new customer id)
  if (deletedProfile) {
    try {
      await prisma.profile.update({
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
    } catch (e) {
      console.error('Error reinstating profile', e);
      return { error: 'Failed to create profile' };
    }
  }

  // create new profile otherwise
  if (!deletedProfile) {
    try {
      await prisma.profile.create({
        data: {
          id,
          email,
          stripeCustomerId,
          freeCredits: 1,
        },
      });

      console.log('Profile created successfully');
    } catch (e) {
      console.error('Error creating profile:', e);
      return { error: 'Failed to create profile' };
    }
  }

  return { message: 'Profile created successfully' };
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
  navToUnit: boolean;
}) {
  // get user
  const user = await checkAuth();

  // validation check
  const validatedData = PartnerMemberSchema.extend({
    unitId: z.string(),
    navToUnit: z.boolean(),
  }).safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email, unitId, navToUnit } = validatedData.data;

  // check if provided email is in sweat400 member email list
  let sweat440Email;
  try {
    sweat440Email = await prisma.sweat440Member.findUnique({
      where: { email },
    });
  } catch (e) {
    console.error(e);
    return { error: 'Lookup error, please try again' };
  }

  // return error message if no member email found
  if (!sweat440Email) {
    return { error: 'No member found with this email' };
  }

  // return error if member email already assigned to different user
  const profile = await getProfileById(user.id);
  if (profile.sweat440MemberEmail === email) {
    return { error: 'Membership already assigned to a different account.' };
  }

  // add sweat440 email to user record, and add extra member credit
  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { sweat440MemberEmail: email, hasS440MemberCredit: true },
    });
  } catch (e) {
    console.error(e);
    return { error: 'No member found with this email.' };
  }

  if (navToUnit) {
    redirect(`/unit/${unitId}`);
  }

  redirect('/');
}
