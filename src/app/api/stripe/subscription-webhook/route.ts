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
      process.env.SUBSCRIPTION_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  // console.log({ eventData: event.data.object });

  switch (event.type) {
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: {
          customerId: event.data.object.customer,
          isMember: true,
          memberPeriodEnd: new Date(
            event.data.object.lines.data[0].period.end * 1000,
          ),
          memberRenewing: true,
        },
      });
      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: {
          customerId: event.data.object.customer,
          isMember: true,
          memberRenewing: true,
          memberPayFailed: false,
          memberPeriodEnd: new Date(
            event.data.object.lines.data[0].period.end * 1000,
          ),
        },
      });
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: {
          customerId: event.data.object.customer,
          isMember: false,
          memberPayFailed: true,
        },
      });
      break;
    case 'customer.subscription.updated':
      await prisma.user.update({
        where: { customerId: event.data.object.customer },
        data: {
          customerId: event.data.object.customer,
          memberPeriodEnd: new Date(
            event.data.object.current_period_end * 1000,
          ),
          memberRenewing: !event.data.object.cancel_at_period_end,
        },
      });
      break;
    case 'customer.subscription.deleted':
      await prisma.user.update({
        where: { customerId: event.data.object.customer },
        data: {
          customerId: event.data.object.customer,
          isMember: false,
          memberPayFailed: null,
          memberPeriodEnd: null,
          memberRenewing: null,
        },
      });
      break;
    default:
    // Unhandled event type
  }

  // return 200 OK
  return Response.json(null, { status: 200 });
}
