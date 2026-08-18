import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { AcademicYear } from '../models/AcademicYear.js';
import { Teacher } from '../models/Teacher.js';
import { ClassModel } from '../models/Class.js';
import { Subject, SubjectAssignment } from '../models/Subject.js';
import { Student, Guardian, StudentGuardian, StudentEnrollment } from '../models/Student.js';
import { ClassAttendance } from '../models/Attendance.js';
import { SMSLog } from '../models/SMSLog.js';
import { Notice } from '../models/Notice.js';
import { Setting } from '../models/Setting.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    AcademicYear.deleteMany({}),
    Teacher.deleteMany({}),
    ClassModel.deleteMany({}),
    Subject.deleteMany({}),
    SubjectAssignment.deleteMany({}),
    Student.deleteMany({}),
    Guardian.deleteMany({}),
    StudentGuardian.deleteMany({}),
    StudentEnrollment.deleteMany({}),
    ClassAttendance.deleteMany({}),
    SMSLog.deleteMany({}),
    Notice.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  // 1. Create Default Settings
  await Setting.create({
    madrasahName: 'Al-Hikmah International Madrasah',
    madrasahAddress: 'Mirpur-10, Dhaka-1216, Bangladesh',
    madrasahPhone: '+8801700000000',
    madrasahEmail: 'info@alhikmah.edu.bd',
    absentSmsEnabled: true,
    presentSmsEnabled: false,
    smsSenderId: 'MadrasahEdu',
    absentSmsTemplate: 'প্রিয় অভিভাবক, আপনার সন্তান {studentName} আজ {date} তারিখে মাদ্রাসায় অনুপস্থিত রয়েছে। - {madrasahName}',
    attendanceEditWindowMinutes: 30,
  });

  // 2. Create Principal Account
  const principalPassword = await bcrypt.hash('principal123', 10);
  const principalUser = await User.create({
    email: 'principal@madrasah.edu',
    passwordHash: principalPassword,
    role: 'PRINCIPAL',
    status: 'ACTIVE',
  });

  // 3. Create Active Academic Year
  const academicYear = await AcademicYear.create({
    name: '2026-2027',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    isCurrent: true,
    isArchived: false,
  });

  // 4. Create Teachers
  const teacherPassword = await bcrypt.hash('teacher123', 10);

  const teacherData = [
    { name: 'Abdullah Sir', email: 'abdullah@madrasah.edu', mobile: '01711111111', id: 'TCH-001', desig: 'Senior Quran & Hadith Teacher' },
    { name: 'Rahman Sir', email: 'rahman@madrasah.edu', mobile: '01722222222', id: 'TCH-002', desig: 'Bangla & History Teacher' },
    { name: 'Karim Sir', email: 'karim@madrasah.edu', mobile: '01733333333', id: 'TCH-003', desig: 'English & Math Teacher' },
  ];

  const createdTeachers: any[] = [];
  for (const t of teacherData) {
    const user = await User.create({
      email: t.email,
      passwordHash: teacherPassword,
      role: 'TEACHER',
      status: 'ACTIVE',
    });

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId: t.id,
      fullName: t.name,
      email: t.email,
      mobile: t.mobile,
      designation: t.desig,
      status: 'ACTIVE',
    });

    user.refId = teacher._id as any;
    await user.save();
    createdTeachers.push(teacher);
  }

  // 5. Create Classes and Assign Class Teachers Directly
  const classesData = [
    { name: 'Class 6', code: 'C6', classTeacherId: createdTeachers[0]._id }, // Abdullah Sir
    { name: 'Class 7', code: 'C7', classTeacherId: createdTeachers[1]._id }, // Rahman Sir
    { name: 'Class 8', code: 'C8', classTeacherId: createdTeachers[2]._id }, // Karim Sir
  ];

  const createdClasses: any[] = [];
  for (let i = 0; i < classesData.length; i++) {
    const c = await ClassModel.create(classesData[i]);
    createdClasses.push(c);
  }

  // 6. Create Subjects and Assignments directly per Class
  const subjectsData = [
    { name: 'Quran & Hadith', code: 'QRN-101' },
    { name: 'Bangla Language', code: 'BNG-101' },
    { name: 'English Literature', code: 'ENG-101' },
    { name: 'Mathematics', code: 'MTH-101' },
    { name: 'Arabic Grammar', code: 'ARB-101' },
  ];

  const createdSubjects: any[] = [];
  for (const s of subjectsData) {
    const subj = await Subject.create(s);
    createdSubjects.push(subj);
  }

  // Assign Subject Teachers for Class 6
  await SubjectAssignment.create([
    {
      academicYearId: academicYear._id,
      classId: createdClasses[0]._id,
      subjectId: createdSubjects[0]._id,
      teacherId: createdTeachers[0]._id, // Abdullah Sir
    },
    {
      academicYearId: academicYear._id,
      classId: createdClasses[0]._id,
      subjectId: createdSubjects[1]._id,
      teacherId: createdTeachers[1]._id, // Rahman Sir
    },
    {
      academicYearId: academicYear._id,
      classId: createdClasses[0]._id,
      subjectId: createdSubjects[2]._id,
      teacherId: createdTeachers[2]._id, // Karim Sir
    },
  ]);

  // 7. Create Sample Students and Guardians directly in Class 6
  const studentsData = [
    { name: 'Hasan Al-Mahmud', bengaliName: 'হাসান আল-মাহমুদ', guardianName: 'Md. Rafiqul Islam', mobile: '01811111111', roll: 1 },
    { name: 'Karim Ullah', bengaliName: 'করিম উল্লাহ', guardianName: 'Md. Shafiqul Alam', mobile: '01822222222', roll: 2 },
    { name: 'Tariq Ahmed', bengaliName: 'তারিক আহমেদ', guardianName: 'Md. Zainal Abedin', mobile: '01833333333', roll: 3 },
    { name: 'Omar Farooq', bengaliName: 'ওমর ফারুক', guardianName: 'Md. Nurul Huda', mobile: '01844444444', roll: 4 },
    { name: 'Usman Ali', bengaliName: 'উসমান আলী', guardianName: 'Md. Jahangir Kabir', mobile: '01855555555', roll: 5 },
  ];

  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    const stdId = `STD-2026-${String(i + 1).padStart(3, '0')}`;
    const admNo = `ADM-2026-${String(i + 1).padStart(3, '0')}`;

    const student = await Student.create({
      studentId: stdId,
      admissionNumber: admNo,
      fullName: s.name,
      bengaliName: s.bengaliName,
      gender: 'MALE',
      status: 'ACTIVE',
    });

    let guardian = await Guardian.findOne({ mobile: s.mobile });
    if (!guardian) {
      guardian = await Guardian.create({
        fullName: s.guardianName,
        relationship: 'FATHER',
        mobile: s.mobile,
      });
    }

    await StudentGuardian.create({
      studentId: student._id,
      guardianId: guardian._id,
      isPrimaryGuardian: true,
      isEmergencyContact: true,
    });

    await StudentEnrollment.create({
      studentId: student._id,
      academicYearId: academicYear._id,
      classId: createdClasses[0]._id,
      rollNumber: s.roll,
      status: 'ACTIVE',
    });
  }

  // 8. Create Sample Notice
  await Notice.create({
    title: 'Welcome to New Academic Year 2026-2027',
    content: 'Assalamu Alaikum. We are pleased to welcome all teachers and students to the new academic year.',
    authorId: principalUser._id,
    targetRoles: ['ALL'],
    isImportant: true,
  });

  console.log('✅ Seed Data Created Successfully!');
  console.log('-------------------------------------------------------');
  console.log('Principal Login:  principal@madrasah.edu  / principal123');
  console.log('Teacher Login:    abdullah@madrasah.edu   / teacher123');
  console.log('-------------------------------------------------------');

  if (process.env.NODE_ENV !== 'test') {
    await disconnectDB();
  }
};

if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase();
}
