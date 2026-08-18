import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { ClassModel } from '../models/Class.js';
import { ClassAttendance } from '../models/Attendance.js';
import { SMSLog } from '../models/SMSLog.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getPrincipalDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ startDate: -1 });
    }

    const totalStudents = await Student.countDocuments({ status: 'ACTIVE' });
    const totalTeachers = await Teacher.countDocuments({ status: 'ACTIVE' });
    const totalClasses = await ClassModel.countDocuments({ status: 'ACTIVE' });

    const todayStr = new Date().toISOString().split('T')[0];

    const todayPresent = await ClassAttendance.countDocuments({
      date: todayStr,
      status: 'PRESENT',
    });

    const todayAbsent = await ClassAttendance.countDocuments({
      date: todayStr,
      status: 'ABSENT',
    });

    const totalMarkedToday = todayPresent + todayAbsent;
    const attendancePercentage = totalMarkedToday > 0 ? Math.round((todayPresent / totalMarkedToday) * 100) : 100;

    const smsSent = await SMSLog.countDocuments({ status: 'SENT' });
    const smsFailed = await SMSLog.countDocuments({ status: 'FAILED' });

    const recentActivity = await ClassAttendance.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId')
      .populate('classId')
      .populate('markedBy', 'email role');

    return sendResponse({
      res,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        todayPresent,
        todayAbsent,
        attendancePercentage,
        smsSent,
        smsFailed,
        recentActivity,
        activeYear,
      },
    });
  } catch (error) {
    next(error);
  }
};
