import express from 'express';
    import { createCheckoutSession, stripeWebhook } from '../controllers/subscription.controller';
    import { authenticateToken } from '../middleware/auth.middleware';

    const router = express.Router();

    router.post('/create-session', authenticateToken, createCheckoutSession);
    router.post('/webhook', stripeWebhook);

    export default router;
