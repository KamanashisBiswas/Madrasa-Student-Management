import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import academicYearRoutes from './routes/academicYearRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL || true,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Version 1 Routes
const apiV1 = '/api/v1';

app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/academic-years`, academicYearRoutes);
app.use(`${apiV1}/classes`, classRoutes);
app.use(`${apiV1}/subjects`, subjectRoutes);
app.use(`${apiV1}/teachers`, teacherRoutes);
app.use(`${apiV1}/students`, studentRoutes);
app.use(`${apiV1}/attendance`, attendanceRoutes);
app.use(`${apiV1}/sms`, smsRoutes);
app.use(`${apiV1}/reports`, reportRoutes);
app.use(`${apiV1}/notices`, noticeRoutes);
app.use(`${apiV1}/audit`, auditRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Madrasah ERP API is operational' });
});

app.use(errorHandler);

export default app;
