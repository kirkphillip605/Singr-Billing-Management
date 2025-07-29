import { Request, Response, NextFunction } from 'express';
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import { PrismaClient } from '@prisma/client';
    import { ZodError, z } from 'zod';

    const prisma = new PrismaClient();

    const registerSchema = z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      businessName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    export const register = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { firstName, lastName, businessName, phone, email, password } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            businessName,
            phone,
            email,
            passwordHash: hashedPassword,
          },
        });

        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        next(error);
      }
    };

    export const login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
          expiresIn: '1h', // Adjust as needed
        });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        next(error);
      }
    };

    export const logout = async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        next(error);
      }
    };

    export const getMe = async (req: Request, res: Response, next: NextFunction) => {
      try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    };
