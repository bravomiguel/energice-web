import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  cancelSubscription,
  deleteCustomer,
  getCustomerSubId,
} from '@/lib/actions/payment-actions';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // console.log({ body });

  const { id } = body.old_record;

  if (!id) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

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
        stripeCustomerId: null,
        isWaiverSigned: false,
        waiverSignedAt: null,
        waiverSigName: null,
        freeCredits: 0,
        isMember: false,
        memberPayFailed: null,
        memberPeriodEnd: null,
        memberRenewing: null,
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

  return NextResponse.json({
    message: 'Profile successfully marked as deleted',
  });
}
