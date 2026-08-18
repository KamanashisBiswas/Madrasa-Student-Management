import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Teacher } from '../models/Teacher.js';
import { User } from '../models/User.js';
import { ClassModel } from '../models/Class.js';
import { SubjectAssignment } from '../models/Subject.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';

const createTeacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(),
  qualification: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
});

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teachers = await Teacher.find().sort({ fullName: 1 });
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    const result = await Promise.all(
      teachers.map(async (t) => {
        let classTeacherClasses: any[] = [];
        let subjectAssignments: any[] = [];

        if (activeYear) {
          classTeacherClasses = await ClassModel.find({
            classTeacherId: t._id,
          });

          subjectAssignments = await SubjectAssignment.find({
            teacherId: t._id,
            academicYearId: activeYear._id,
          })
            .populate('classId')
            .populate('subjectId');
        }

        return {
          ...t.toObject(),
          classTeacherClasses,
          subjectAssignments,
        };
      })
    );

    return sendResponse({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createTeacherSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      return next(new ApiError(400, 'User with this email already exists', 'DUPLICATE_EMAIL'));
    }

    const teacherCount = await Teacher.countDocuments();
    const teacherId = `TCH-${String(teacherCount + 1).padStart(3, '0')}`;

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email.toLowerCase(),
      passwordHash,
      role: 'TEACHER',
      status: 'ACTIVE',
    });

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      mobile: data.mobile,
      address: data.address,
      qualification: data.qualification,
      designation: data.designation || 'Assistant Teacher',
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
      status: 'ACTIVE',
    });

    user.refId = teacher._id as any;
    await user.save();

    return sendResponse({
      res,
      statusCode: 201,
      message: 'Teacher account created successfully',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return next(new ApiError(404, 'Teacher not found', 'NOT_FOUND'));
    }

    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    let classTeacherClasses: any[] = [];
    let subjectAssignments: any[] = [];

    if (activeYear) {
      classTeacherClasses = await ClassModel.find({
        classTeacherId: teacher._id,
      });

      subjectAssignments = await SubjectAssignment.find({
        teacherId: teacher._id,
        academicYearId: activeYear._id,
      })
        .populate('classId')
        .populate('subjectId');
    }

    return sendResponse({
      res,
      data: {
        ...teacher.toObject(),
        classTeacherClasses,
        subjectAssignments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacherStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(id, { status }, { new: true });
    if (!teacher) {
      return next(new ApiError(404, 'Teacher not found', 'NOT_FOUND'));
    }

    await User.findByIdAndUpdate(teacher.userId, { status });

    return sendResponse({ res, message: `Teacher status updated to ${status}`, data: teacher });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return next(new ApiError(404, 'Teacher not found', 'NOT_FOUND'));
    }

    if (teacher.userId) {
      await User.findByIdAndDelete(teacher.userId);
    }
    await Teacher.findByIdAndDelete(id);
    await ClassModel.updateMany({ classTeacherId: id }, { $unset: { classTeacherId: '' } });
    await SubjectAssignment.deleteMany({ teacherId: id });

    return sendResponse({ res, message: 'Teacher deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMyClasses = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'TEACHER' || !user.refId) {
      return next(new ApiError(403, 'Only teachers can access assigned classes', 'FORBIDDEN'));
    }

    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    if (!activeYear) {
      return sendResponse({ res, data: [] });
    }

    const classTeacherClasses = await ClassModel.find({
      classTeacherId: user.refId,
    });

    const subjectAssignments = await SubjectAssignment.find({
      teacherId: user.refId,
      academicYearId: activeYear._id,
    })
      .populate('classId')
      .populate('subjectId');

    const result = {
      classTeacherClasses,
      subjectAssignments,
    };

    return sendResponse({ res, data: result });
  } catch (error) {
    next(error);
  }
};
