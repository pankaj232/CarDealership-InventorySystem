import { Request, Response } from 'express';
import { authorizeRoles } from '../middleware/authorization.middleware';
import { ForbiddenError } from '../utils/errors';
import { UserRole } from '../interfaces/user.interface';

const createRequest = (role?: UserRole): Request =>
  ({
    user: role ? { id: '1', email: `${role}@example.com`, role } : undefined,
  }) as Request;

describe('authorizeRoles', () => {
  it('should allow a matching role', () => {
    const middleware = authorizeRoles('admin');
    const next = jest.fn();

    middleware(createRequest('admin'), {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should allow any of multiple roles', () => {
    const middleware = authorizeRoles('user', 'admin');
    const next = jest.fn();

    middleware(createRequest('user'), {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should reject a non-matching role', () => {
    const middleware = authorizeRoles('admin');
    const next = jest.fn();

    middleware(createRequest('user'), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should reject when user is missing', () => {
    const middleware = authorizeRoles('admin');
    const next = jest.fn();

    middleware(createRequest(), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });
});
