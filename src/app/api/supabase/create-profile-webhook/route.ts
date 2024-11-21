import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createCustomer } from '@/lib/actions/payment-actions';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // console.log({ body });

  const { id, email } = body.record;

  if (!id || !email) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Create stripe customer id
  const { stripeCustomerId, error } = await createCustomer({
    email,
  });
  if (!stripeCustomerId) {
    console.error('Error creating stripe customer id:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 },
    );
  }

  // Grab profile based on email, if it already exists
  let profile;
  try {
    profile = await prisma.profile.findUnique({
      where: {
        email,
        stripeCustomerId,
      },
    });
  } catch (e) {
    console.error('Error checking for existing profile:', e);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 },
    );
  }

  // reinstate profile if previously deleted
  if (profile && profile.deleted) {
    try {
      await prisma.profile.update({
        where: {
          email,
        },
        data: {
          id,
          deleted: false,
          deletedAt: null,
        },
      });

      console.log('Profile reinstated successfully');
    } catch (e) {
      console.error('Error reinstating profile', e);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 },
      );
    }
  }

  // create profile if it doesn't exist
  if (!profile) {
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
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: 'Profile created successfully' });
}
