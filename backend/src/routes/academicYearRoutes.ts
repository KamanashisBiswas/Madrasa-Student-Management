import { Router } from 'express';
import {
  getAcademicYears,
  getActiveAcademicYear,
  createAcademicYear,
  setActiveAcademicYear,
} from '../controllers/academicYearController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAcademicYears);
router.get('/active', getActiveAcademicYear);
router.post('/', requireRoles(['PRINCIPAL']), createAcademicYear);
router.patch('/:id/set-active', requireRoles(['PRINCIPAL']), setActiveAcademicYear);

export default router;
