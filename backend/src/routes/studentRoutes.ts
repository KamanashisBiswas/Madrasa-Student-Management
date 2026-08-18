import { Router } from 'express';
import {
  getStudents,
  registerStudent,
  getStudentById,
  deleteStudent,
} from '../controllers/studentController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', requireRoles(['PRINCIPAL']), registerStudent);
router.delete('/:id', requireRoles(['PRINCIPAL']), deleteStudent);

export default router;
