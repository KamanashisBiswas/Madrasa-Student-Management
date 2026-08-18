import { Router } from 'express';
import {
  getClassRoster,
  submitAttendance,
  overrideAttendance,
} from '../controllers/attendanceController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/roster', getClassRoster);
router.post('/submit', submitAttendance);
router.put('/override', requireRoles(['PRINCIPAL']), overrideAttendance);

export default router;
