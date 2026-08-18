import { Request, Response, NextFunction } from 'express';
import { Student, Guardian, StudentGuardian, StudentEnrollment } from '../models/Student.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { ClassAttendance } from '../models/Attendance.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';

const registerStudentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  bengaliName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z.string().optional(),
  classId: z.string().min(1, 'Class is required'),
  rollNumber: z.number().min(1, 'Roll number is required'),
  academicYearId: z.string().optional(),

  // Primary Guardian
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianRelationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']),
  guardianMobile: z.string().min(10, 'Guardian mobile is required'),
  guardianAltMobile: z.string().optional(),
  guardianEmail: z.string().optional(),
  guardianAddress: z.string().optional(),

  fatherName: z.string().optional(),
  motherName: z.string().optional(),
});

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, classId, academicYearId, status } = req.query;

    let activeYearId = academicYearId as string;
    if (!activeYearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (activeYear) {
        activeYearId = activeYear._id.toString();
      }
    }

    const enrollmentQuery: any = {};
    if (activeYearId) enrollmentQuery.academicYearId = activeYearId;
    if (classId) enrollmentQuery.classId = classId;

    let enrollments = await StudentEnrollment.find(enrollmentQuery)
      .populate('studentId')
      .populate('classId')
      .populate('academicYearId')
      .sort({ rollNumber: 1 });

    // Filter by search string if provided
    if (search) {
      const queryStr = String(search).toLowerCase();
      enrollments = enrollments.filter((e: any) => {
        const student = e.studentId;
        if (!student) return false;
        return (
          student.fullName?.toLowerCase().includes(queryStr) ||
          student.studentId?.toLowerCase().includes(queryStr) ||
          student.admissionNumber?.toLowerCase().includes(queryStr)
        );
      });
    }

    const result = await Promise.all(
      enrollments.map(async (e: any) => {
        const student = e.studentId;
        if (!student) return null;

        // Fetch primary guardian
        const sg = await StudentGuardian.findOne({
          studentId: student._id,
          isPrimaryGuardian: true,
        }).populate('guardianId');

        return {
          enrollmentId: e._id,
          student: student,
          rollNumber: e.rollNumber,
          class: e.classId,
          academicYear: e.academicYearId,
          primaryGuardian: sg ? sg.guardianId : null,
        };
      })
    );

    return sendResponse({ res, data: result.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

export const registerStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerStudentSchema.parse(req.body);

    let yearId = data.academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (!activeYear) {
        return next(new ApiError(400, 'No active academic year found', 'NO_ACADEMIC_YEAR'));
      }
      yearId = activeYear._id.toString();
    }

    const currentYearStr = new Date().getFullYear();
    const count = await Student.countDocuments();
    const studentId = `STD-${currentYearStr}-${String(count + 1).padStart(3, '0')}`;
    const admissionNumber = `ADM-${currentYearStr}-${String(count + 1).padStart(3, '0')}`;

    // Create Student record
    const student = await Student.create({
      studentId,
      admissionNumber,
      fullName: data.fullName,
      bengaliName: data.bengaliName,
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender || 'MALE',
      bloodGroup: data.bloodGroup,
      status: 'ACTIVE',
    });

    // Create or find Guardian record
    let guardian = await Guardian.findOne({ mobile: data.guardianMobile });
    if (!guardian) {
      guardian = await Guardian.create({
        fullName: data.guardianName,
        relationship: data.guardianRelationship,
        mobile: data.guardianMobile,
        altMobile: data.guardianAltMobile,
        email: data.guardianEmail,
        address: data.guardianAddress,
      });
    }

    // Link Student to Guardian
    await StudentGuardian.create({
      studentId: student._id,
      guardianId: guardian._id,
      isPrimaryGuardian: true,
      isEmergencyContact: true,
    });

    // Create Student Enrollment for active year
    const enrollment = await StudentEnrollment.create({
      studentId: student._id,
      academicYearId: yearId,
      classId: data.classId,
      rollNumber: data.rollNumber,
      status: 'ACTIVE',
    });

    return sendResponse({
      res,
      statusCode: 201,
      message: 'Student registered successfully',
      data: {
        student,
        guardian,
        enrollment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return next(new ApiError(404, 'Student not found', 'NOT_FOUND'));
    }

    const enrollments = await StudentEnrollment.find({ studentId: student._id })
      .populate('classId')
      .populate('academicYearId')
      .sort({ createdAt: -1 });

    const studentGuardians = await StudentGuardian.find({ studentId: student._id }).populate('guardianId');

    // Attendance stats
    const totalDays = await ClassAttendance.countDocuments({ studentId: student._id });
    const presentDays = await ClassAttendance.countDocuments({ studentId: student._id, status: 'PRESENT' });
    const absentDays = await ClassAttendance.countDocuments({ studentId: student._id, status: 'ABSENT' });
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    const recentAttendance = await ClassAttendance.find({ studentId: student._id })
      .sort({ date: -1 })
      .limit(15)
      .populate('markedBy', 'email role');

    return sendResponse({
      res,
      data: {
        student,
        enrollments,
        guardians: studentGuardians.map((sg) => ({
          ...((sg.guardianId as any).toObject ? (sg.guardianId as any).toObject() : sg.guardianId),
          isPrimaryGuardian: sg.isPrimaryGuardian,
        })),
        attendanceSummary: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage,
        },
        recentAttendance,
      },
    });
  } catch (error) {
    next(error);
  }
};
