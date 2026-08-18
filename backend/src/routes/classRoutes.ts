import { Router } from 'express';
import { getClasses, createClass, updateClassTeacher } from '../controllers/classController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getClasses);
router.post('/', requireRoles(['PRINCIPAL']), createClass);
router.put('/:classId/class-teacher', requireRoles(['PRINCIPAL']), updateClassTeacher);

export default router;
