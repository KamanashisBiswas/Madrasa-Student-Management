import mongoose, { Schema, Document } from 'mongoose';

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
export type GuardianRelation = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';

export interface IStudent extends Document {
  userId?: mongoose.Types.ObjectId;
  studentId: string; // e.g. "STD-2026-001"
  admissionNumber: string; // e.g. "ADM-2026-001"
  fullName: string;
  bengaliName?: string;
  photoUrl?: string;
  dob?: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  status: StudentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGuardian extends Document {
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  relationship: GuardianRelation;
  mobile: string;
  altMobile?: string;
  email?: string;
  address?: string;
  occupation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentGuardian extends Document {
  studentId: mongoose.Types.ObjectId;
  guardianId: mongoose.Types.ObjectId;
  isPrimaryGuardian: boolean;
  isEmergencyContact: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  rollNumber: number;
  status: 'ACTIVE' | 'PROMOTED' | 'PASSED_OUT';
  admissionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    studentId: { type: String, required: true, unique: true, trim: true },
    admissionNumber: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    bengaliName: { type: String, trim: true },
    photoUrl: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'MALE' },
    bloodGroup: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

const guardianSchema = new Schema<IGuardian>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true, trim: true },
    relationship: { type: String, enum: ['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER'], required: true },
    mobile: { type: String, required: true, trim: true, index: true },
    altMobile: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String },
    occupation: { type: String },
  },
  { timestamps: true }
);

const studentGuardianSchema = new Schema<IStudentGuardian>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true },
    isPrimaryGuardian: { type: Boolean, default: false },
    isEmergencyContact: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentGuardianSchema.index({ studentId: 1, guardianId: 1 }, { unique: true });

const studentEnrollmentSchema = new Schema<IStudentEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    rollNumber: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'PROMOTED', 'PASSED_OUT'], default: 'ACTIVE' },
    admissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

studentEnrollmentSchema.index({ academicYearId: 1, studentId: 1 }, { unique: true });
studentEnrollmentSchema.index({ academicYearId: 1, classId: 1, sectionId: 1, rollNumber: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
export const Guardian = mongoose.model<IGuardian>('Guardian', guardianSchema);
export const StudentGuardian = mongoose.model<IStudentGuardian>('StudentGuardian', studentGuardianSchema);
export const StudentEnrollment = mongoose.model<IStudentEnrollment>('StudentEnrollment', studentEnrollmentSchema);
