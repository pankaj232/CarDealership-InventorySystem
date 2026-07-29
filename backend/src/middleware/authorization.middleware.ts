import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../interfaces/user.interface';
import { ForbiddenError } from '../utils/errors';

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
