import { Router } from 'express';
import {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacherStatus,
  getMyClasses,
} from '../controllers/teacherController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/my-classes', requireRoles(['TEACHER']), getMyClasses);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', requireRoles(['PRINCIPAL']), createTeacher);
router.patch('/:id/status', requireRoles(['PRINCIPAL']), updateTeacherStatus);

export default router;
