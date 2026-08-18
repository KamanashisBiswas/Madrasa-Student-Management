import { Request, Response, NextFunction } from 'express';
import { ClassAttendance } from '../models/Attendance.js';
import { StudentEnrollment, Student } from '../models/Student.js';
import { Section } from '../models/Class.js';
import { SubjectAssignment } from '../models/Subject.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { Setting } from '../models/Setting.js';
import { AuditLog } from '../models/AuditLog.js';
import { SMSService } from '../services/smsService.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';

const submitAttendanceSchema = z.object({
  classId: z.string().min(1),
  sectionId: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  academicYearId: z.string().optional(),
  attendance: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    })
  ),
});

const overrideAttendanceSchema = z.object({
  attendanceId: z.string().min(1),
  newStatus: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  reason: z.string().min(1, 'Modification reason is required'),
});

// Helper: Verify teacher permission for class/section
const verifyTeacherPermission = async (userId: string, role: string, refId: string | undefined, sectionId: string, yearId: string) => {
  if (role === 'PRINCIPAL') return true;
  if (role !== 'TEACHER' || !refId) return false;

  const isClassTeacher = await Section.exists({
    _id: sectionId,
    classTeacherId: refId,
    academicYearId: yearId,
  });

  if (isClassTeacher) return true;

  const isSubjectTeacher = await SubjectAssignment.exists({
    sectionId,
    teacherId: refId,
    academicYearId: yearId,
  });

  return !!isSubjectTeacher;
};

export const getClassRoster = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { classId, sectionId, date, academicYearId } = req.query;

    if (!classId || !sectionId) {
      return next(new ApiError(400, 'classId and sectionId are required', 'MISSING_PARAMS'));
    }

    let yearId = academicYearId as string;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (!activeYear) {
        return next(new ApiError(400, 'No active academic year found', 'NO_ACADEMIC_YEAR'));
      }
      yearId = activeYear._id.toString();
    }

    const hasPermission = await verifyTeacherPermission(
      req.user!.userId,
      req.user!.role,
      req.user!.refId,
      sectionId as string,
      yearId
    );

    if (!hasPermission) {
      return next(new ApiError(403, 'You are not assigned to this class or section', 'UNAUTHORIZED_CLASS'));
    }

    const enrollments = await StudentEnrollment.find({
      classId,
      sectionId,
      academicYearId: yearId,
      status: 'ACTIVE',
    })
      .populate('studentId')
      .sort({ rollNumber: 1 });

    const targetDate = (date as string) || new Date().toISOString().split('T')[0];

    const roster = await Promise.all(
      enrollments.map(async (e: any) => {
        const existingAttendance = await ClassAttendance.findOne({
          academicYearId: yearId,
          classId,
          sectionId,
          studentId: e.studentId._id,
          date: targetDate,
        });

        return {
          enrollmentId: e._id,
          studentId: e.studentId._id,
          studentName: e.studentId.fullName,
          bengaliName: e.studentId.bengaliName,
          studentIdCode: e.studentId.studentId,
          rollNumber: e.rollNumber,
          currentStatus: existingAttendance ? existingAttendance.status : 'PRESENT',
          attendanceId: existingAttendance ? existingAttendance._id : null,
          smsStatus: existingAttendance ? existingAttendance.smsStatus : null,
        };
      })
    );

    return sendResponse({
      res,
      data: {
        date: targetDate,
        academicYearId: yearId,
        students: roster,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { classId, sectionId, date, academicYearId, attendance } = submitAttendanceSchema.parse(req.body);

    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (!activeYear) {
        return next(new ApiError(400, 'No active academic year found', 'NO_ACADEMIC_YEAR'));
      }
      yearId = activeYear._id.toString();
    }

    const hasPermission = await verifyTeacherPermission(
      req.user!.userId,
      req.user!.role,
      req.user!.refId,
      sectionId,
      yearId
    );

    if (!hasPermission) {
      return next(new ApiError(403, 'You are not assigned to this class or section', 'UNAUTHORIZED_CLASS'));
    }

    // Check editing window if updating existing records as teacher
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    const windowMinutes = settings.attendanceEditWindowMinutes || 30;

    const savedRecords: any[] = [];
    const absentStudentIds: string[] = [];

    for (const item of attendance) {
      const existing = await ClassAttendance.findOne({
        academicYearId: yearId,
        classId,
        sectionId,
        studentId: item.studentId,
        date,
      });

      if (existing) {
        // Check window lock for non-principal users
        if (req.user!.role !== 'PRINCIPAL') {
          const diffMinutes = (new Date().getTime() - existing.createdAt.getTime()) / (1000 * 60);
          if (diffMinutes > windowMinutes) {
            return next(
              new ApiError(
                400,
                `Attendance editing window (${windowMinutes} mins) expired. Contact Principal for changes.`,
                'EDIT_WINDOW_EXPIRED'
              )
            );
          }
        }

        existing.status = item.status;
        existing.modifiedBy = req.user!.userId as any;
        await existing.save();
        savedRecords.push(existing);
      } else {
        const created = await ClassAttendance.create({
          academicYearId: yearId,
          classId,
          sectionId,
          studentId: item.studentId,
          date,
          status: item.status,
          markedBy: req.user!.userId,
          smsStatus: item.status === 'ABSENT' ? 'PENDING' : 'SKIPPED',
        });
        savedRecords.push(created);
      }

      if (item.status === 'ABSENT') {
        absentStudentIds.push(item.studentId);
      }
    }

    // Async trigger absent SMS notifications
    setImmediate(async () => {
      for (const studentId of absentStudentIds) {
        const smsLog = await SMSService.queueAbsentSMS(studentId, date);
        if (smsLog) {
          await ClassAttendance.findOneAndUpdate(
            { academicYearId: yearId, classId, sectionId, studentId, date },
            { smsStatus: 'PENDING' }
          );
        }
      }
    });

    return sendResponse({
      res,
      message: 'Attendance submitted successfully',
      data: {
        totalSubmitted: attendance.length,
        presentCount: attendance.filter((a) => a.status === 'PRESENT').length,
        absentCount: attendance.filter((a) => a.status === 'ABSENT').length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const overrideAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { attendanceId, newStatus, reason } = overrideAttendanceSchema.parse(req.body);

    const attendance = await ClassAttendance.findById(attendanceId);
    if (!attendance) {
      return next(new ApiError(404, 'Attendance record not found', 'NOT_FOUND'));
    }

    const previousStatus = attendance.status;
    attendance.status = newStatus;
    attendance.modifiedBy = req.user!.userId as any;
    attendance.modificationReason = reason;
    await attendance.save();

    // Create Audit Log
    await AuditLog.create({
      userId: req.user!.userId,
      userRole: req.user!.role,
      action: 'ATTENDANCE_OVERRIDE',
      entity: 'ClassAttendance',
      entityId: attendance._id.toString(),
      previousData: { status: previousStatus },
      newData: { status: newStatus, reason },
    });

    return sendResponse({
      res,
      message: 'Attendance overridden successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};
