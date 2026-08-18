import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().optional(),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  JWT_ACCESS_SECRET: z.string().default('madrasah_access_secret_super_secure_key_12345'),
  JWT_REFRESH_SECRET: z.string().default('madrasah_refresh_secret_super_secure_key_67890'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  SMS_PROVIDER: z.enum(['MOCK', 'HTTP']).default('MOCK'),
  SMS_API_URL: z.string().optional(),
  SMS_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().default('MadrasahEdu'),

  ATTENDANCE_EDIT_WINDOW_MINUTES: z.string().default('30'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Invalid environment variables:', parseResult.error.format());
  process.exit(1);
}

export const env = parseResult.data;

if (env.NODE_ENV === 'production' && !env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is required in production environment!');
  process.exit(1);
}
