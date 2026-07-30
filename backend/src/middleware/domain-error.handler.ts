import { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError } from '../utils/errors';

export const domainErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  next(error);
};
