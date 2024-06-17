import prisma from '@/lib/db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.costructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  // reflect payment in session record in db
  switch (event.type) {
    case 'checkout.session.completed':
      // prisma.user.update({
      //   where: { email: event.data.object.customer_email },
      //   data: {
      //     hasAccess: true,
      //   },
      // });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // return 200 OK
  return Response.json(null, { status: 200 });
}
