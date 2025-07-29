import { NextRequest, NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';
    import { sendEmail } from '../../../../server/utils/email';
    import { generateToken } from '../../../../server/utils/jwt';
    import { z } from 'zod';

    const prisma = new PrismaClient();

    const requestSchema = z.object({
      email: z.string().email(),
    });

    export async function POST(req: NextRequest) {
      try {
        const body = await req.json();
        const { email } = requestSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const token = generateToken(user.id, user.email);
        const resetLink = \`\${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=\${token}\`;

        const emailSent = await sendEmail({
          to: email,
          subject: 'Password Reset Request',
          html: \`
            <p>Please click the following link to reset your password:</p>
            <a href="\${resetLink}">\${resetLink}</a>
          \`,
        });

        if (!emailSent) {
          return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
        }

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        });

        return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    }
