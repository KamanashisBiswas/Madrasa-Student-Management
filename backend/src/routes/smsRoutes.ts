import { Router } from 'express';
import {
  getSMSLogs,
  getSMSSettings,
  updateSMSSettings,
  sendTestSMS,
  retryFailedSMS,
} from '../controllers/smsController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/logs', requireRoles(['PRINCIPAL']), getSMSLogs);
router.get('/settings', requireRoles(['PRINCIPAL']), getSMSSettings);
router.put('/settings', requireRoles(['PRINCIPAL']), updateSMSSettings);
router.post('/test', requireRoles(['PRINCIPAL']), sendTestSMS);
router.post('/retry-failed', requireRoles(['PRINCIPAL']), retryFailedSMS);

export default router;
