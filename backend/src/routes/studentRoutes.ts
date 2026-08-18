import { Router } from 'express';
import { getStudents, registerStudent, getStudentById } from '../controllers/studentController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', requireRoles(['PRINCIPAL']), registerStudent);

export default router;
