export type Role = 'PRINCIPAL' | 'TEACHER';

export interface User {
  id: string;
  email: string;
  role: Role;
  refId?: string;
  profile?: any;
}

export interface Teacher {
  _id: string;
  teacherId: string;
  fullName: string;
  email: string;
  mobile: string;
  address?: string;
  qualification?: string;
  designation?: string;
  joiningDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
  photoUrl?: string;
  classTeacherSections?: Section[];
  subjectAssignments?: SubjectAssignment[];
}

export interface AcademicYear {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isArchived: boolean;
}

export interface ClassItem {
  _id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  sections?: Section[];
  studentCount?: number;
}

export interface Section {
  _id: string;
  classId: string | ClassItem;
  name: string;
  academicYearId: string;
  classTeacherId?: Teacher;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubjectAssignment {
  _id: string;
  academicYearId: string;
  classId: ClassItem;
  sectionId: Section;
  subjectId: Subject;
  teacherId: Teacher;
}

export interface Student {
  _id: string;
  studentId: string;
  admissionNumber: string;
  fullName: string;
  bengaliName?: string;
  photoUrl?: string;
  dob?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
}

export interface Guardian {
  _id: string;
  fullName: string;
  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  mobile: string;
  altMobile?: string;
  email?: string;
  address?: string;
  isPrimaryGuardian?: boolean;
}

export interface StudentRosterItem {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  bengaliName?: string;
  studentIdCode: string;
  rollNumber: number;
  currentStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  attendanceId?: string | null;
  smsStatus?: string | null;
}

export interface SMSLog {
  _id: string;
  mobile: string;
  message: string;
  type: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  provider: string;
  attemptCount: number;
  lastAttemptAt?: string;
  errorMsg?: string;
  createdAt: string;
  studentId?: Student;
  guardianId?: Guardian;
}

export interface SMSSettings {
  _id: string;
  madrasahName: string;
  madrasahAddress: string;
  madrasahPhone: string;
  madrasahEmail?: string;
  absentSmsEnabled: boolean;
  presentSmsEnabled: boolean;
  smsSenderId: string;
  absentSmsTemplate: string;
  attendanceEditWindowMinutes: number;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  publishedAt: string;
  isImportant: boolean;
}

export interface AuditLog {
  _id: string;
  userId?: { email: string; role: string };
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  previousData?: any;
  newData?: any;
  timestamp: string;
}
