import { Router } from 'express';
import {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacherStatus,
  deleteTeacher,
  getMyClasses,
} from '../controllers/teacherController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/my-classes', getMyClasses);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', requireRoles(['PRINCIPAL']), createTeacher);
router.patch('/:id/status', requireRoles(['PRINCIPAL']), updateTeacherStatus);
router.delete('/:id', requireRoles(['PRINCIPAL']), deleteTeacher);

export default router;
