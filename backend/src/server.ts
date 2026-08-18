import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Madrasah ERP API Server running on port ${env.PORT}`);
    console.log(`🌐 Mode: ${env.NODE_ENV}`);
    console.log(`📱 SMS Provider: ${env.SMS_PROVIDER}`);
    console.log(`=======================================================`);
  });
};

startServer();
