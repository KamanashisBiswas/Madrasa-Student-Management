import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let details: any = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorCode = 'VALIDATION_ERROR';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field ${err.path}`;
    errorCode = 'INVALID_ID';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
    errorCode = 'DUPLICATE_ENTRY';
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`, err);

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorCode,
    details,
  });
};
