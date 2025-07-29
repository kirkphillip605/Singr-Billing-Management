import express from 'express';
    import { config } from 'dotenv';
    import cors from 'cors';
    import authRoutes from './routes/auth.routes';
    import subscriptionRoutes from './routes/subscription.routes';
    import { errorHandler } from './middleware/error.middleware';
    import cookieParser from 'cookie-parser';

    config(); // Load environment variables

    const app = express();
    const port = process.env.PORT || 3001;

    // Middleware
    app.use(cors({
      origin: process.env.NEXT_PUBLIC_BASE_URL,
      credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/subscriptions', subscriptionRoutes);

    // Error handling middleware (must be after routes)
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(\`Server is running on port \${port}\`);
    });
