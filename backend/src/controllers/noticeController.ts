import { Request, Response, NextFunction } from 'express';
import { Notice } from '../models/Notice.js';
import { sendResponse } from '../utils/apiResponse.js';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';

const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  targetRoles: z.array(z.enum(['ALL', 'TEACHER', 'STUDENT', 'GUARDIAN'])).optional(),
  isImportant: z.boolean().optional(),
});

export const getNotices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notices = await Notice.find().sort({ publishedAt: -1 }).limit(50);
    return sendResponse({ res, data: notices });
  } catch (error) {
    next(error);
  }
};

export const createNotice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, targetRoles, isImportant } = createNoticeSchema.parse(req.body);

    const notice = await Notice.create({
      title,
      content,
      authorId: req.user!.userId,
      targetRoles: targetRoles || ['ALL'],
      isImportant: isImportant || false,
    });

    return sendResponse({ res, statusCode: 201, message: 'Notice published', data: notice });
  } catch (error) {
    next(error);
  }
};
