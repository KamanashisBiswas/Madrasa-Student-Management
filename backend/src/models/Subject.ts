import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string; // e.g. "Mathematics", "Bangla", "Arabic"
  code: string; // e.g. "MATH-101"
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubjectAssignment extends Document {
  academicYearId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

const subjectAssignmentSchema = new Schema<ISubjectAssignment>(
  {
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  },
  { timestamps: true }
);

subjectAssignmentSchema.index(
  { academicYearId: 1, classId: 1, sectionId: 1, subjectId: 1 },
  { unique: true }
);

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
export const SubjectAssignment = mongoose.model<ISubjectAssignment>('SubjectAssignment', subjectAssignmentSchema);
