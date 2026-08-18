import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  classId: mongoose.Types.ObjectId;
  name: string; // e.g. "A", "B"
  academicYearId: mongoose.Types.ObjectId;
  classTeacherId?: mongoose.Types.ObjectId; // ref Teacher
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface IClass extends Document {
  name: string; // e.g. "Class 6"
  code: string; // e.g. "C6"
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    name: { type: String, required: true, trim: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

sectionSchema.index({ classId: 1, name: 1, academicYearId: 1 }, { unique: true });

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const ClassModel = mongoose.model<IClass>('Class', classSchema);
export const Section = mongoose.model<ISection>('Section', sectionSchema);
