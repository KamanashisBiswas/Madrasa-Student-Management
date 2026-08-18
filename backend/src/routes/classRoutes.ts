import { Router } from 'express';
import { getClasses, createClass, updateClass, updateClassTeacher, deleteClass } from '../controllers/classController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getClasses);
router.post('/', requireRoles(['PRINCIPAL']), createClass);
router.put('/:id', requireRoles(['PRINCIPAL']), updateClass);
router.put('/:classId/class-teacher', requireRoles(['PRINCIPAL']), updateClassTeacher);
router.delete('/:id', requireRoles(['PRINCIPAL']), deleteClass);

export default router;
