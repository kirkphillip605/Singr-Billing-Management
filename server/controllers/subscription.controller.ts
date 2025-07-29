import { Request, Response, NextFunction } from 'express';
    import Stripe from 'stripe';
    import { PrismaClient } from '@prisma/client';
    import { config } from 'dotenv';

    config();

    const prisma = new PrismaClient();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });

    export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
      try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const { planId } = req.body; // Assuming planId is sent in the request body

        // Fetch the plan details from your database
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
        });

        if (!plan) {
          return res.status(404).json({ message: 'Plan not found' });
        }

        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: plan.stripePriceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: \`\${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={\${CHECKOUT_SESSION_ID}}\`, // Redirect to dashboard on success
          cancel_url: \`\${process.env.NEXT_PUBLIC_BASE_URL}/billing\`, // Redirect to billing on cancel
          metadata: {
            userId: userId,
            planId: planId,
          },
        });

        res.status(200).json({ sessionId: session.id });
      } catch (error) {
        next(error);
      }
    };

    export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
      const sig = req.headers['stripe-signature'];
      const body = req.body;

      if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.log('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
        return res.status(400).send('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.log(\`Webhook Error: \${err.message}\`);
        return res.status(400).send(\`Webhook Error: \${err.message}\`);
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;
          // Then define and call a function to handle the event checkout.session.completed
          await handleCheckoutSessionCompleted(checkoutSessionCompleted);
          break;
        case 'invoice.payment_succeeded':
          const invoicePaymentSucceeded = event.data.object;
          // Then define and call a function to handle the event invoice.payment_succeeded
          await handleInvoicePaymentSucceeded(invoicePaymentSucceeded);
          break;
        case 'invoice.payment_failed':
          const invoicePaymentFailed = event.data.object;
          // Then define and call a function to handle the event invoice.payment_failed
          await handleInvoicePaymentFailed(invoicePaymentFailed);
          break;
        case 'customer.subscription.deleted':
          const subscriptionDeleted = event.data.object;
          // Then define and call a function to handle the event customer.subscription.deleted
          await handleSubscriptionDeleted(subscriptionDeleted);
          break;
        default:
          console.log(\`Unhandled event type \${event.type}\`);
      }

      res.status(200).send();
    };

    async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (!userId || !planId || !session.subscription) {
        console.log('Missing metadata or subscription ID');
        return;
      }

      const subscriptionId = session.subscription.toString();

      // Fetch plan details
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        console.log('Plan not found');
        return;
      }

      // Update or create StripeCustomer
      await prisma.stripeCustomer.upsert({
        where: { userId: userId },
        update: { stripeCustomerId: session.customer?.toString() },
        create: {
          userId: userId,
          stripeCustomerId: session.customer?.toString()!,
        },
      });

      // Create subscription
      await prisma.subscription.create({
        data: {
          userId: userId,
          stripeSubscriptionId: subscriptionId,
          planInterval: plan.interval,
          status: 'active', // Or 'trialing' if applicable
          currentPeriodStart: new Date(session.subscription_details?.period?.start! * 1000),
          currentPeriodEnd: new Date(session.subscription_details?.period?.end! * 1000),
        },
      });
    }

    async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
      const subscriptionId = invoice.subscription?.toString();

      if (!subscriptionId) {
        console.log('Missing subscription ID');
        return;
      }

      // Update subscription status
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'active' },
      });
    }

    async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
      const subscriptionId = invoice.subscription?.toString();

      if (!subscriptionId) {
        console.log('Missing subscription ID');
        return;
      }

      // Update subscription status
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'past_due' },
      });
    }

    async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
      const subscriptionId = subscription.id;

      if (!subscriptionId) {
        console.log('Missing subscription ID');
        return;
      }

      // Update subscription status
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'canceled' },
      });
    }
