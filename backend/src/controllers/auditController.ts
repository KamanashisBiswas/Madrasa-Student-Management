import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'email role')
      .sort({ timestamp: -1 })
      .limit(100);

    return sendResponse({ res, data: logs });
  } catch (error) {
    next(error);
  }
};
