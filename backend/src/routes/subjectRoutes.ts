import { Router } from 'express';
import {
  getSubjects,
  createSubject,
  getSubjectAssignments,
  assignSubjectTeacher,
} from '../controllers/subjectController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSubjects);
router.post('/', requireRoles(['PRINCIPAL']), createSubject);
router.get('/assignments', getSubjectAssignments);
router.post('/assignments', requireRoles(['PRINCIPAL']), assignSubjectTeacher);

export default router;
