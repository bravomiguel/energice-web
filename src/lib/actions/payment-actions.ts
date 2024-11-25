'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Session, Unit, Profile } from '@prisma/client';

import { checkAuth, getOrCreateProfileById } from '@/lib/server-utils';
import { headers } from 'next/headers';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function plungeCheckoutSession(data: {
  unitId: Unit['id'];
  sessionId: Session['id'];
  sweat440MemberOption: boolean;
}) {
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      sessionId: z.string().trim().min(1),
      sweat440MemberOption: z.boolean(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId, sessionId, sweat440MemberOption } = validatedData.data;

  const origin = (await headers()).get('origin');

  const profile = await getOrCreateProfileById(user.id);

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      customer: profile.stripeCustomerId,
      // customer_email: user.email,
      line_items: [
        {
          price: sweat440MemberOption
            ? process.env.PLUNGE_PRICE_ID_MEMBER
            : process.env.PLUNGE_PRICE_ID_NONMEMBER,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      mode: 'payment',
      // allow_promotion_codes: true,
      success_url: `${origin}/session/${sessionId}/unlock`,
      cancel_url: sweat440MemberOption
        ? `${origin}/unit/${unitId}?sweat440Member=true`
        : `${origin}/unit/${unitId}`,
      metadata: {
        session_id: sessionId,
      },
    });
  } catch (e) {
    console.error(e);
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function subscriptionCheckoutSession(data: {
  sweat440MemberOption: boolean;
}) {
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sweat440MemberOption: z.boolean(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sweat440MemberOption } = validatedData.data;

  const profile = await getOrCreateProfileById(user.id);

  const origin = (await headers()).get('origin');

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      // allow_promotion_codes: true,
      // customer_email: user.email,
      customer: profile.stripeCustomerId,
      line_items: [
        {
          price: sweat440MemberOption
            ? process.env.SUBSCRIPTION_PRICE_ID_MEMBER
            : process.env.SUBSCRIPTION_PRICE_ID_NONMEMBER,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      discounts: [
        {
          coupon: sweat440MemberOption
            ? process.env.COUPON_FOUNDING_MEMBER
            : process.env.COUPON_EARLY_BIRD_NONMEMBER,
        },
      ],
      success_url: `${origin}/profile?success=true`,
      cancel_url: `${origin}/profile`,
      metadata: { price_id: process.env.SUBSCRIPTION_PRICE_ID_NONMEMBERS },
    });
  } catch (e) {
    return {
      error: 'Subscription checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function billingPortalSession(data: {
  stripeCustomerId: Profile['stripeCustomerId'];
}) {
  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId } = validatedData.data;

  const origin = (await headers()).get('origin');

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/`,
  });

  // redirect user
  redirect(portalSession.url);
}

export async function createCustomer(data: { email: Profile['email'] }) {
  // validation check
  const validatedData = z
    .object({
      email: z.string(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(
      'Error validating data:',
      validatedData.error.issues[0].message,
    );
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { email } = validatedData.data;

  let customer;
  try {
    customer = await stripe.customers.create({ email });
  } catch (e) {
    // @ts-ignore
    console.error(e.raw.code + ': ' + e.raw.message);
    return {
      // @ts-ignore
      error: `${e.raw.message}`,
    };
  }

  // console.log({customer});
  const stripeCustomerId: string = customer.id;

  return { stripeCustomerId };
}

export async function updateCustomerName(data: {
  stripeCustomerId: Profile['stripeCustomerId'];
  name: Profile['name'];
}) {
  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string(),
      name: z.string(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(
      'Error validating data:',
      validatedData.error.issues[0].message,
    );
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId, name } = validatedData.data;

  let customer;
  try {
    customer = await stripe.customers.update(stripeCustomerId, {
      name,
    });
  } catch (e) {
    // @ts-ignore
    console.error(e.raw.code + ': ' + e.raw.message);
    return {
      // @ts-ignore
      error: `${e.raw.message}`,
    };
  }
}

export async function deleteCustomer(data: {
  stripeCustomerId: Profile['stripeCustomerId'];
}) {
  // authentication check
  // const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId } = validatedData.data;

  let deletedCustomer;
  try {
    deletedCustomer = await stripe.customers.del(stripeCustomerId);
  } catch (e) {
    // console.log("Customer deletion failed, please try again")
    return {
      error: 'Customer deletion failed, please try again',
    };
  }

  // console.log({deletedCustomer});

  if (!deletedCustomer.deleted) {
    // console.log("Customer deletion failed, please try again.")
    return {
      error: 'Customer deletion failed, please try again.',
    };
  }
}

export async function getCustomerSubId(
  data: Pick<Profile, 'stripeCustomerId'>,
) {
  // validation check
  const validatedData = z
    .object({
      stripeCustomerId: z.string(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(
      'Error validating data:',
      validatedData.error.issues[0].message,
    );
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeCustomerId } = validatedData.data;

  let subscriptions;
  try {
    subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
    });
  } catch (e) {
    // @ts-ignore
    console.error(e.raw.code + ': ' + e.raw.message);
    return {
      // @ts-ignore
      error: `${e.raw.message}`,
    };
  }

  if (subscriptions.data.length === 0) {
    return { stripeSubId: undefined, error: undefined };
  }

  const stripeSubId: string = subscriptions.data[0].id;

  return { stripeSubId };
}

export async function cancelSubscription(data: { stripeSubId: string }) {
  // validation check
  const validatedData = z
    .object({
      stripeSubId: z.string(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    console.error(
      'Error validating data:',
      validatedData.error.issues[0].message,
    );
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { stripeSubId } = validatedData.data;

  let subscription;
  try {
    subscription = await stripe.subscriptions.delete(stripeSubId);
  } catch (e) {
    // @ts-ignore
    console.error(e.raw.code + ': ' + e.raw.message);
    return {
      // @ts-ignore
      error: `${e.raw.message}`,
    };
  }

  return { error: undefined };
}
