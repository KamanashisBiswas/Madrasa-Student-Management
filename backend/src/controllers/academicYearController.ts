import { Request, Response, NextFunction } from 'express';
import { AcademicYear } from '../models/AcademicYear.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const createAcademicYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string(),
  endDate: z.string(),
  isCurrent: z.boolean().optional(),
});

export const getAcademicYears = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const years = await AcademicYear.find().sort({ startDate: -1 });
    return sendResponse({ res, data: years });
  } catch (error) {
    next(error);
  }
};

export const getActiveAcademicYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let year = await AcademicYear.findOne({ isCurrent: true, isArchived: false });
    if (!year) {
      year = await AcademicYear.findOne().sort({ startDate: -1 });
    }
    return sendResponse({ res, data: year });
  } catch (error) {
    next(error);
  }
};

export const createAcademicYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, startDate, endDate, isCurrent } = createAcademicYearSchema.parse(req.body);

    if (isCurrent) {
      await AcademicYear.updateMany({}, { isCurrent: false });
    }

    const year = await AcademicYear.create({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isCurrent: isCurrent || false,
    });

    return sendResponse({ res, statusCode: 201, message: 'Academic Year created', data: year });
  } catch (error) {
    next(error);
  }
};

export const setActiveAcademicYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AcademicYear.updateMany({}, { isCurrent: false });

    const year = await AcademicYear.findByIdAndUpdate(id, { isCurrent: true }, { new: true });
    if (!year) {
      return next(new ApiError(404, 'Academic year not found', 'NOT_FOUND'));
    }

    return sendResponse({ res, message: 'Active academic year updated', data: year });
  } catch (error) {
    next(error);
  }
};
