import { NextFunction, Request, Response } from 'express';
import {
  DuplicateEmailError,
  InvalidCredentialsError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';

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

  if (error instanceof InvalidCredentialsError) {
    res.status(401).json({
      message: error.message,
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      message: error.message,
    });
    return;
  }

  next(error);
};
