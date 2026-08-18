import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string; // e.g. "Class 6"
  code: string; // e.g. "C6"
  classTeacherId?: mongoose.Types.ObjectId; // ref Teacher
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const ClassModel = mongoose.model<IClass>('Class', classSchema);
