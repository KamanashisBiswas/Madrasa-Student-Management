import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRoles(['PRINCIPAL']), getAuditLogs);

export default router;
