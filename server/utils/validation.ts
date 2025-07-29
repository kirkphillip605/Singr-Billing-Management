import { z } from 'zod';

    export const registerSchema = z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      businessName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    export const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
