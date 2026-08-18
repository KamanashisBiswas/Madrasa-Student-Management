import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  teacherId: string; // e.g. "TCH-001"
  fullName: string;
  email: string;
  mobile: string;
  address?: string;
  qualification?: string;
  designation?: string;
  joiningDate?: Date;
  status: 'ACTIVE' | 'INACTIVE';
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherId: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    address: { type: String },
    qualification: { type: String },
    designation: { type: String, default: 'Assistant Teacher' },
    joiningDate: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);
