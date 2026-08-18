import { Router } from 'express';
import { getPrincipalDashboardStats } from '../controllers/reportController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', requireRoles(['PRINCIPAL']), getPrincipalDashboardStats);

export default router;
