import { PrismaClient } from '@prisma/client';
    import bcrypt from 'bcrypt';

    const prisma = new PrismaClient();

    async function main() {
      const hashedPassword = await bcrypt.hash('password', 10);

      const defaultUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          passwordHash: hashedPassword,
        },
      });

      const monthlyPlan = await prisma.plan.upsert({
        where: { id: 'monthly' },
        update: {},
        create: {
          id: 'monthly',
          stripePriceId: 'price_1234567890', // Replace with your Stripe Price ID
          name: 'Monthly Plan',
          interval: 'month',
          amountCents: 1000, // $10.00
        },
      });

      console.log({ defaultUser, monthlyPlan });
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
