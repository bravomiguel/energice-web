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
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  // reflect payment in db
  if (event.type === 'checkout.session.completed') {
    // update session record, if individual plunge payment
    if (
      event.data.object.metadata.price_id ===
      process.env.PLUNGE_PRICE_ID_NONMEMBERS
    ) {
      await prisma.session.update({
        where: { id: event.data.object.metadata.session_id },
        data: {
          hasPaid: true,
          amountSubtotal: event.data.object.amount_subtotal,
          amountTotal: event.data.object.amount_total,
        },
      });
      // update user record, if plunge pack payment
    } else if (
      event.data.object.metadata.price_id === process.env.PACK_PRICE_ID
    ) {
      const user = await prisma.user.findFirst({
        where: { email: event.data.object.customer_email },
      });

      if (!user) {
        console.log(`User not found`);
        return;
      }

      console.log({
        paidCredits:
          user.paidCredits + Number(event.data.object.metadata.quantity),
      });

      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: {
          paidCredits:
            user.paidCredits + Number(event.data.object.metadata.quantity),
        },
      });
    } else {
      console.log(
        `Unhandled payment intent ${event.data.object.payment_intent}`,
      );
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // switch (event.type) {
  //   case 'checkout.session.completed':
  //     await prisma.session.update({
  //       where: { id: event.data.object.metadata.session_id },
  //       data: {
  //         hasPaid: true,
  //         amountSubtotal: event.data.object.amount_subtotal,
  //         amountTotal: event.data.object.amount_total,
  //       },
  //     });
  //     break;
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // return 200 OK
  return Response.json(null, { status: 200 });
}
