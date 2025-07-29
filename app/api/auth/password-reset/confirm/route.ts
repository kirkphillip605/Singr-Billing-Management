import { NextRequest, NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';
    import bcrypt from 'bcrypt';
    import { z } from 'zod';
    import { verifyToken } from '../../../../server/utils/jwt';

    const prisma = new PrismaClient();

    const confirmSchema = z.object({
      token: z.string(),
      password: z.string().min(6),
    });

    export async function POST(req: NextRequest) {
      try {
        const body = await req.json();
        const { token, password } = confirmSchema.parse(body);

        const decoded: any =```typescript
        verifyToken(token);

        if (!decoded || !decoded.userId) {
          return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findFirst({
          where: {
            userId: decoded.userId,
            token: token,
            expiresAt: { gte: new Date() },
            usedAt: null,
          },
        });

        if (!resetToken) {
          return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
          where: { id: decoded.userId },
          data: { passwordHash: hashedPassword },
        });

        await prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { usedAt: new Date() },
        });

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    }
