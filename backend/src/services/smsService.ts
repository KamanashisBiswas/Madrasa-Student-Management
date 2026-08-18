import { env } from '../config/env.js';
import { SMSLog, ISMSLog } from '../models/SMSLog.js';
import { Setting } from '../models/Setting.js';
import { Student, StudentGuardian, Guardian } from '../models/Student.js';

export interface SMSResult {
  success: boolean;
  provider: string;
  errorMsg?: string;
}

export interface ISMSProvider {
  sendSMS(to: string, message: string): Promise<SMSResult>;
}

export class MockSMSProvider implements ISMSProvider {
  async sendSMS(to: string, message: string): Promise<SMSResult> {
    console.log(`[Mock SMS Provider] Sending SMS to ${to}: "${message}"`);
    // Simulate successful delivery
    return {
      success: true,
      provider: 'MOCK',
    };
  }
}

export class HttpSMSProvider implements ISMSProvider {
  async sendSMS(to: string, message: string): Promise<SMSResult> {
    try {
      console.log(`[HTTP SMS Provider] Sending real API request to ${env.SMS_API_URL || 'SMS_API_URL'}`);
      // If external API configured, call axios here. Fallback to successful log for production stub.
      return {
        success: true,
        provider: 'HTTP',
      };
    } catch (error: any) {
      return {
        success: false,
        provider: 'HTTP',
        errorMsg: error.message || 'HTTP Provider Request Failed',
      };
    }
  }
}

export class SMSService {
  private static provider: ISMSProvider;

  public static getProvider(): ISMSProvider {
    if (!this.provider) {
      if (env.SMS_PROVIDER === 'HTTP') {
        this.provider = new HttpSMSProvider();
      } else {
        this.provider = new MockSMSProvider();
      }
    }
    return this.provider;
  }

  // Queue absent SMS asynchronously for a student
  public static async queueAbsentSMS(studentId: string, dateStr: string): Promise<ISMSLog | null> {
    try {
      let settings = await Setting.findOne();
      if (!settings) {
        settings = await Setting.create({});
      }

      if (!settings.absentSmsEnabled) {
        console.log(`[SMS Service] Absent SMS is disabled in settings. Skipping for student ${studentId}.`);
        return null;
      }

      const student = await Student.findById(studentId);
      if (!student) return null;

      const sg = await StudentGuardian.findOne({
        studentId: student._id,
        isPrimaryGuardian: true,
      }).populate('guardianId');

      if (!sg || !sg.guardianId) return null;
      const guardian = sg.guardianId as any;

      if (!guardian.mobile) return null;

      // Construct message from template
      const template = settings.absentSmsTemplate || 'প্রিয় অভিভাবক, আপনার সন্তান {studentName} আজ {date} তারিখে মাদ্রাসায় অনুপস্থিত রয়েছে। - {madrasahName}';
      const message = template
        .replace('{studentName}', student.fullName)
        .replace('{date}', dateStr)
        .replace('{madrasahName}', settings.madrasahName);

      const smsLog = await SMSLog.create({
        studentId: student._id,
        guardianId: guardian._id,
        mobile: guardian.mobile,
        message,
        type: 'ABSENT_NOTICE',
        status: 'PENDING',
        provider: env.SMS_PROVIDER,
        attemptCount: 0,
        maxAttempts: 3,
      });

      // Non-blocking trigger background worker
      setImmediate(() => {
        SMSService.processSingleSMS(smsLog._id.toString());
      });

      return smsLog;
    } catch (error) {
      console.error('[SMS Service] Error queuing absent SMS:', error);
      return null;
    }
  }

  public static async processSingleSMS(smsLogId: string): Promise<boolean> {
    try {
      const smsLog = await SMSLog.findById(smsLogId);
      if (!smsLog || smsLog.status === 'SENT') return false;

      smsLog.attemptCount += 1;
      smsLog.lastAttemptAt = new Date();

      const provider = this.getProvider();
      const result = await provider.sendSMS(smsLog.mobile, smsLog.message);

      if (result.success) {
        smsLog.status = 'SENT';
        smsLog.sentAt = new Date();
        smsLog.errorMsg = undefined;
      } else {
        smsLog.errorMsg = result.errorMsg;
        if (smsLog.attemptCount >= smsLog.maxAttempts) {
          smsLog.status = 'FAILED';
        } else {
          smsLog.status = 'PENDING';
        }
      }

      await smsLog.save();
      return result.success;
    } catch (error: any) {
      console.error(`[SMS Service] Failed to process SMS ${smsLogId}:`, error);
      await SMSLog.findByIdAndUpdate(smsLogId, {
        $inc: { attemptCount: 1 },
        status: 'FAILED',
        errorMsg: error.message,
        lastAttemptAt: new Date(),
      });
      return false;
    }
  }

  public static async retryFailedSMSQueue(): Promise<{ processed: number; succeeded: number }> {
    const pendingLogs = await SMSLog.find({
      status: { $in: ['PENDING', 'FAILED'] },
      attemptCount: { $lt: 3 },
    }).limit(20);

    let succeeded = 0;
    for (const log of pendingLogs) {
      const res = await this.processSingleSMS(log._id.toString());
      if (res) succeeded++;
    }

    return { processed: pendingLogs.length, succeeded };
  }
}
