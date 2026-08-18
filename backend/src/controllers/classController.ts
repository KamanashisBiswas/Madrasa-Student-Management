import { Request, Response, NextFunction } from 'express';
import { ClassModel } from '../models/Class.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { StudentEnrollment } from '../models/Student.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  code: z.string().min(1, 'Class code is required'),
  classTeacherId: z.string().optional(),
});

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await ClassModel.find().populate('classTeacherId').sort({ name: 1 });
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    const result = await Promise.all(
      classes.map(async (c) => {
        let studentCount = 0;
        if (activeYear) {
          studentCount = await StudentEnrollment.countDocuments({
            classId: c._id,
            academicYearId: activeYear._id,
            status: 'ACTIVE',
          });
        }

        return {
          ...c.toObject(),
          studentCount,
          academicYear: activeYear,
        };
      })
    );

    return sendResponse({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code, classTeacherId } = createClassSchema.parse(req.body);
    const newClass = await ClassModel.create({
      name,
      code,
      classTeacherId: classTeacherId || undefined,
    });
    const populated = await ClassModel.findById(newClass._id).populate('classTeacherId');
    return sendResponse({ res, statusCode: 201, message: 'Class created', data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateClassTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const { classTeacherId } = req.body;

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { classTeacherId: classTeacherId || null },
      { new: true }
    ).populate('classTeacherId');

    if (!updatedClass) {
      return next(new ApiError(404, 'Class not found', 'NOT_FOUND'));
    }

    return sendResponse({ res, message: 'Class Teacher assigned successfully', data: updatedClass });
  } catch (error) {
    next(error);
  }
};
