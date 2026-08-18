import { Request, Response, NextFunction } from 'express';
import { Subject, SubjectAssignment } from '../models/Subject.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
});

const assignSubjectSchema = z.object({
  academicYearId: z.string().optional(),
  classId: z.string().min(1),
  subjectId: z.string().min(1),
  teacherId: z.string().min(1),
});

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    return sendResponse({ res, data: subjects });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code, description } = createSubjectSchema.parse(req.body);
    const subject = await Subject.create({ name, code, description });
    return sendResponse({ res, statusCode: 201, message: 'Subject created', data: subject });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    const updated = await Subject.findByIdAndUpdate(id, { name, code, description }, { new: true });
    if (!updated) return next(new ApiError(404, 'Subject not found', 'NOT_FOUND'));
    return sendResponse({ res, message: 'Subject updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) return next(new ApiError(404, 'Subject not found', 'NOT_FOUND'));
    await SubjectAssignment.deleteMany({ subjectId: id });
    return sendResponse({ res, message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSubjectAssignments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    if (!activeYear) {
      return sendResponse({ res, data: [] });
    }

    const assignments = await SubjectAssignment.find({ academicYearId: activeYear._id })
      .populate('classId')
      .populate('subjectId')
      .populate('teacherId');

    return sendResponse({ res, data: assignments });
  } catch (error) {
    next(error);
  }
};

export const assignSubjectTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { academicYearId, classId, subjectId, teacherId } = assignSubjectSchema.parse(req.body);

    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (!activeYear) {
        return next(new ApiError(400, 'No active academic year found', 'NO_ACADEMIC_YEAR'));
      }
      yearId = activeYear._id.toString();
    }

    const assignment = await SubjectAssignment.findOneAndUpdate(
      { academicYearId: yearId, classId, subjectId },
      { teacherId },
      { upsert: true, new: true }
    )
      .populate('classId')
      .populate('subjectId')
      .populate('teacherId');

    return sendResponse({ res, message: 'Subject Teacher assigned successfully', data: assignment });
  } catch (error) {
    next(error);
  }
};
