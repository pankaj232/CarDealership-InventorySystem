import { NextFunction, Request, Response } from 'express';
import { DuplicateEmailError, ValidationError } from '../utils/errors';

export const domainErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ValidationError) {
    res.status(400).json({
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof DuplicateEmailError) {
    res.status(409).json({
      message: error.message,
    });
    return;
  }

  next(error);
};
