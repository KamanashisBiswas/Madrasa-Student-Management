import mongoose from 'mongoose';
import { env } from './env.js';

let mongoMemoryServer: any = null;

export const connectDB = async (): Promise<string> => {
  let uri = env.MONGODB_URI;

  if (!uri) {
    if (env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is missing in production environment');
    }

    console.log('No MONGODB_URI provided. Starting MongoMemoryServer for development/testing...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    uri = mongoMemoryServer.getUri();
  }

  try {
    await mongoose.connect(uri!);
    console.log(`[Database] MongoDB connected successfully to ${uri!.includes('127.0.0.1') ? 'local/memory instance' : 'remote database'}`);
    return uri!;
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
  console.log('[Database] MongoDB disconnected');
};
