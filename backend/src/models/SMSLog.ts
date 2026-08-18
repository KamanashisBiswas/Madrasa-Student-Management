import mongoose, { Schema, Document } from 'mongoose';

export type SMSType = 'ABSENT_NOTICE' | 'PRESENT_NOTICE' | 'MANUAL' | 'TEST';
export type SMSStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface ISMSLog extends Document {
  studentId?: mongoose.Types.ObjectId;
  guardianId?: mongoose.Types.ObjectId;
  mobile: string;
  message: string;
  type: SMSType;
  status: SMSStatus;
  provider: string;
  attemptCount: number;
  maxAttempts: number;
  lastAttemptAt?: Date;
  sentAt?: Date;
  errorMsg?: string;
  createdAt: Date;
  updatedAt: Date;
}

const smsLogSchema = new Schema<ISMSLog>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian' },
    mobile: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['ABSENT_NOTICE', 'PRESENT_NOTICE', 'MANUAL', 'TEST'], default: 'ABSENT_NOTICE' },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
    provider: { type: String, default: 'MOCK' },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastAttemptAt: { type: Date },
    sentAt: { type: Date },
    errorMsg: { type: String },
  },
  { timestamps: true }
);

smsLogSchema.index({ status: 1, attemptCount: 1 });
smsLogSchema.index({ studentId: 1, createdAt: -1 });

export const SMSLog = mongoose.model<ISMSLog>('SMSLog', smsLogSchema);
