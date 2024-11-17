import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cancelSubscription } from '@/lib/actions';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // console.log({ body });

  const { id } = body.old_record;

  if (!id) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // fetch subscription id to cancel subscription
  let stripeSubId;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id },
    });
    stripeSubId = profile?.stripeSubId;
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to fetch profile',
    };
  }

  // cancel subscription
  if (!!stripeSubId) {
    const error = await cancelSubscription({ stripeSubId });

    console.log('Stripe subscription successfully cancelled');
    if (error) {
      console.error('Error cancelling stripe subscription:', error);
      return NextResponse.json(
        { error: 'Failed to cancel stripe subscription' },
        { status: 500 },
      );
    }
  }

  // mark profile as deleted
  try {
    await prisma.profile.update({
      where: { id },
      data: {
        isWaiverSigned: false,
        waiverSignedAt: null,
        waiverSigName: null,
        credits: 0,
        stripeSubId: null,
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
