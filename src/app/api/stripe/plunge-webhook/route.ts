import prisma from '@/lib/db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.PLUNGE_PAYMENT_SECRET,
    );
  } catch (error) {
    console.error('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  const { session_id, user_name, is_sweat440_member } =
    event.data.object.metadata;

  // reflect payment in db
  if (event.type === 'checkout.session.completed') {
    // update session record
    await prisma.session.update({
      where: { id: session_id },
      data: {
        type: is_sweat440_member ? 'single_member' : 'single_nonmember',
        userName: user_name,
        amountSubtotal: event.data.object.amount_subtotal,
        amountTotal: event.data.object.amount_total,
      },
    });
  } else {
    console.error(`Unhandled event type ${event.type}`);
  }

  // return 200 OK
  return Response.json(null, { status: 200 });
}
