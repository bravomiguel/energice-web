import { IS_STRIPE_LIVE_ENV, IS_STRIPE_TEST_ENV } from '@/lib/constants';
import prisma from '@/lib/db';

let stripeSecretKey;
if (IS_STRIPE_TEST_ENV) {
  stripeSecretKey = process.env.STRIPE_SECRET_KEY_TEST;
} else if (IS_STRIPE_LIVE_ENV) {
  stripeSecretKey = process.env.STRIPE_SECRET_KEY_LIVE;
}

const stripe = require('stripe')(stripeSecretKey);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // verify webhook came from stripe
  let event;
  let stripeWebhookSecret;
  if (IS_STRIPE_TEST_ENV) {
    stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;
  } else if (IS_STRIPE_LIVE_ENV) {
    stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE;
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.log('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  // reflect payment in session record in db
  switch (event.type) {
    case 'checkout.session.completed':
      await prisma.session.update({
        where: { id: event.data.object.metadata.session_id },
        data: {
          hasPaid: true,
          amountSubtotal: event.data.object.amount_subtotal,
          amountTotal: event.data.object.amount_total,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // return 200 OK
  return Response.json(null, { status: 200 });
}
