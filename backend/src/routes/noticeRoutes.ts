import { Router } from 'express';
import { getNotices, createNotice } from '../controllers/noticeController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getNotices);
router.post('/', authenticate, requireRoles(['PRINCIPAL']), createNotice);

export default router;
