import mongoose, { Schema, Document } from 'mongoose';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type SMSDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED';

export interface IClassAttendance extends Document {
  academicYearId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format
  subjectId?: mongoose.Types.ObjectId; // Optional for subject-specific attendance
  status: AttendanceStatus;
  markedBy: mongoose.Types.ObjectId; // ref User
  modifiedBy?: mongoose.Types.ObjectId; // ref User
  modificationReason?: string;
  smsStatus: SMSDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMadrasahAttendance extends Document {
  academicYearId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  entryTime?: Date;
  exitTime?: Date;
  markedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const classAttendanceSchema = new Schema<IClassAttendance>(
  {
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    modificationReason: { type: String },
    smsStatus: { type: String, enum: ['PENDING', 'SENT', 'FAILED', 'SKIPPED'], default: 'SKIPPED' },
  },
  { timestamps: true }
);

// Compound unique index preventing duplicate records for same context
classAttendanceSchema.index(
  { academicYearId: 1, date: 1, studentId: 1, classId: 1, sectionId: 1, subjectId: 1 },
  { unique: true }
);

classAttendanceSchema.index({ classId: 1, sectionId: 1, date: 1 });
classAttendanceSchema.index({ studentId: 1, date: 1 });

const madrasahAttendanceSchema = new Schema<IMadrasahAttendance>(
  {
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], required: true },
    entryTime: { type: Date },
    exitTime: { type: Date },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

madrasahAttendanceSchema.index({ academicYearId: 1, date: 1, studentId: 1 }, { unique: true });

export const ClassAttendance = mongoose.model<IClassAttendance>('ClassAttendance', classAttendanceSchema);
export const MadrasahAttendance = mongoose.model<IMadrasahAttendance>('MadrasahAttendance', madrasahAttendanceSchema);
