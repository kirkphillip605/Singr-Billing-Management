import express from 'express';
    import { register, login, logout, getMe } from '../controllers/auth.controller';
    import { authenticateToken } from '../middleware/auth.middleware';

    const router = express.Router();

    router.post('/register', register);
    router.post('/login', login);
    router.post('/logout', logout);
    router.get('/me', authenticateToken, getMe);

    export default router;
