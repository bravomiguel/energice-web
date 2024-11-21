'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Session, Unit, Profile } from '@prisma/client';

import { checkAuth } from '@/lib/server-utils';
import { BASE_URL } from '@/lib/constants';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function plungeCheckoutSession(data: {
  unitId: Unit['id'];
  sessionId: Session['id'];
}) {
  // authentication check
  const session = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId, sessionId } = validatedData.data;

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.PLUNGE_PRICE_ID,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      mode: 'payment',
      // allow_promotion_codes: true,
      success_url: `${BASE_URL}/session/${sessionId}/unlock`,
      cancel_url: `${BASE_URL}/unit/${unitId}`,
      metadata: {
        price_id: process.env.PLUNGE_PRICE_ID,
        session_id: sessionId,
      },
    });
  } catch (e) {
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function packCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.PACK_PRICE_ID,
          quantity: 5,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      mode: 'payment',
      success_url: `${BASE_URL}/profile`,
      cancel_url: `${BASE_URL}/profile`,
      metadata: { price_id: process.env.PACK_PRICE_ID, quantity: 5 },
    });
  } catch (e) {
    return {
      error: 'Checkout failed, please try again',
    };
  }

  // redirect user
  redirect(checkoutSession.url);
}

export async function subscriptionCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // create checkout session
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      allow_promotion_codes: true,
      customer_email: 'email@email.com',
      line_items: [
        {
          price: process.env.SUBSCRIPTION_PRICE_ID,
          quantity: 1,
          tax_rates: [process.env.TAX_RATE_ID],
        },
      ],
      success_url: `${BASE_URL}/profile`,
      cancel_url: `${BASE_URL}/profile`,
      metadata: { price_id: process.env.SUBSCRIPTION_PRICE_ID },
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
  // authentication check
  const session = await checkAuth();

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

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${BASE_URL}/profile`,
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
