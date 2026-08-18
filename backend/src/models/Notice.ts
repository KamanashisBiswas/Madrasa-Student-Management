import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  publishedAt: Date;
  authorId: mongoose.Types.ObjectId; // ref User
  targetRoles: ('ALL' | 'TEACHER' | 'STUDENT' | 'GUARDIAN')[];
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRoles: [{ type: String, enum: ['ALL', 'TEACHER', 'STUDENT', 'GUARDIAN'], default: 'ALL' }],
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice = mongoose.model<INotice>('Notice', noticeSchema);
