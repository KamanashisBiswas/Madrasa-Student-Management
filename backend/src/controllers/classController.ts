import { Request, Response, NextFunction } from 'express';
import { ClassModel, Section } from '../models/Class.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { StudentEnrollment } from '../models/Student.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  code: z.string().min(1, 'Class code is required'),
});

const createSectionSchema = z.object({
  classId: z.string().min(1),
  name: z.string().min(1, 'Section name is required'),
  academicYearId: z.string().optional(),
  classTeacherId: z.string().optional(),
});

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await ClassModel.find().sort({ name: 1 });
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    const result = await Promise.all(
      classes.map(async (c) => {
        let sections: any[] = [];
        if (activeYear) {
          sections = await Section.find({ classId: c._id, academicYearId: activeYear._id }).populate('classTeacherId');
        }

        // Count students
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
          sections,
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
    const { name, code } = createClassSchema.parse(req.body);
    const newClass = await ClassModel.create({ name, code });
    return sendResponse({ res, statusCode: 201, message: 'Class created', data: newClass });
  } catch (error) {
    next(error);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId, name, academicYearId, classTeacherId } = createSectionSchema.parse(req.body);

    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (!activeYear) {
        return next(new ApiError(400, 'No active academic year found', 'NO_ACADEMIC_YEAR'));
      }
      yearId = activeYear._id.toString();
    }

    const section = await Section.create({
      classId,
      name,
      academicYearId: yearId,
      classTeacherId: classTeacherId || undefined,
    });

    const populated = await Section.findById(section._id).populate('classTeacherId');
    return sendResponse({ res, statusCode: 201, message: 'Section created', data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateClassTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sectionId } = req.params;
    const { classTeacherId } = req.body;

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { classTeacherId: classTeacherId || null },
      { new: true }
    ).populate('classTeacherId');

    if (!section) {
      return next(new ApiError(404, 'Section not found', 'NOT_FOUND'));
    }

    return sendResponse({ res, message: 'Class Teacher assigned successfully', data: section });
  } catch (error) {
    next(error);
  }
};
