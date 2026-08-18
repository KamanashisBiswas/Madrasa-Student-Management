import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  name: string; // e.g. "2026-2027"
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AcademicYear = mongoose.model<IAcademicYear>('AcademicYear', academicYearSchema);
