import { Request, Response, NextFunction } from 'express';
import { SMSLog } from '../models/SMSLog.js';
import { Setting } from '../models/Setting.js';
import { SMSService } from '../services/smsService.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  absentSmsEnabled: z.boolean().optional(),
  presentSmsEnabled: z.boolean().optional(),
  smsSenderId: z.string().optional(),
  absentSmsTemplate: z.string().optional(),
  presentSmsTemplate: z.string().optional(),
  attendanceEditWindowMinutes: z.number().optional(),
});

const sendTestSmsSchema = z.object({
  mobile: z.string().min(10, 'Mobile number is required'),
  message: z.string().min(1, 'Message is required'),
});

export const getSMSLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type, search } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) query.mobile = { $regex: String(search), $options: 'i' };

    const logs = await SMSLog.find(query)
      .populate('studentId')
      .populate('guardianId')
      .sort({ createdAt: -1 })
      .limit(100);

    return sendResponse({ res, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getSMSSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return sendResponse({ res, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSMSSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSettingsSchema.parse(req.body);

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }

    return sendResponse({ res, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    next(error);
  }
};

export const sendTestSMS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile, message } = sendTestSmsSchema.parse(req.body);

    const provider = SMSService.getProvider();
    const result = await provider.sendSMS(mobile, message);

    await SMSLog.create({
      mobile,
      message,
      type: 'TEST',
      status: result.success ? 'SENT' : 'FAILED',
      provider: result.provider,
      sentAt: result.success ? new Date() : undefined,
      errorMsg: result.errorMsg,
    });

    return sendResponse({
      res,
      message: result.success ? 'Test SMS sent successfully' : 'Failed to send test SMS',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const retryFailedSMS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SMSService.retryFailedSMSQueue();
    return sendResponse({
      res,
      message: `Processed ${result.processed} SMS logs (${result.succeeded} succeeded)`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
