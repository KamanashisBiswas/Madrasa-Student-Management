import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  madrasahName: string;
  madrasahAddress: string;
  madrasahPhone: string;
  madrasahEmail?: string;
  absentSmsEnabled: boolean;
  presentSmsEnabled: boolean;
  smsSenderId: string;
  absentSmsTemplate: string;
  presentSmsTemplate: string;
  attendanceEditWindowMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    madrasahName: { type: String, default: 'Al-Hikmah International Madrasah' },
    madrasahAddress: { type: String, default: 'Dhaka, Bangladesh' },
    madrasahPhone: { type: String, default: '+8801700000000' },
    madrasahEmail: { type: String, default: 'info@alhikmah.edu.bd' },
    absentSmsEnabled: { type: Boolean, default: true },
    presentSmsEnabled: { type: Boolean, default: false },
    smsSenderId: { type: String, default: 'MadrasahEdu' },
    absentSmsTemplate: {
      type: String,
      default: 'প্রিয় অভিভাবক, আপনার সন্তান {studentName} আজ {date} তারিখে মাদ্রাসায় অনুপস্থিত রয়েছে। - {madrasahName}',
    },
    presentSmsTemplate: {
      type: String,
      default: 'প্রিয় অভিভাবক, আপনার সন্তান {studentName} আজ {date} তারিখে মাদ্রাসায় উপস্থিত হয়েছে। - {madrasahName}',
    },
    attendanceEditWindowMinutes: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>('Setting', settingSchema);
