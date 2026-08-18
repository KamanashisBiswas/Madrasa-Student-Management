import { Router } from 'express';
import { login, refreshToken, logout, changePassword, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.post('/change-password', authenticate, changePassword);
router.get('/me', authenticate, getMe);

export default router;
