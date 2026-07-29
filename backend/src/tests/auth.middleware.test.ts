import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.middleware';
import { UnauthorizedError } from '../utils/errors';
import { TokenPayload } from '../interfaces/token-service.interface';

describe('authenticate middleware', () => {
  const jwtSecret = 'test-jwt-secret';

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeAll(() => {
    process.env.JWT_SECRET = jwtSecret;
  });

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  const createToken = (
    payload: TokenPayload,
    options?: jwt.SignOptions
  ): string => jwt.sign(payload, jwtSecret, { expiresIn: '1h', ...options });

  const userPayload: TokenPayload = {
    id: '507f1f77bcf86cd799439011',
    email: 'jane@example.com',
    role: 'user',
  };

  it('should attach user to request and call next for a valid Bearer token', () => {
    const token = createToken(userPayload);
    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({
      id: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });
  });

  it('should reject when Authorization header is missing', () => {
    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0] as unknown as Error;
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toBe('Authentication required');
    expect(req.user).toBeUndefined();
  });

  it('should reject when Authorization header is not Bearer', () => {
    req.headers = { authorization: `Basic ${createToken(userPayload)}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    expect(req.user).toBeUndefined();
  });

  it('should reject when token is missing after Bearer', () => {
    req.headers = { authorization: 'Bearer ' };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    expect(req.user).toBeUndefined();
  });

  it('should reject when token is invalid', () => {
    req.headers = { authorization: 'Bearer not.a.valid.token' };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    expect((next.mock.calls[0][0] as unknown as Error).message).toBe(
      'Invalid or expired token'
    );
    expect(req.user).toBeUndefined();
  });

  it('should reject when token is signed with a different secret', () => {
    const token = jwt.sign(userPayload, 'wrong-secret', { expiresIn: '1h' });
    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    expect(req.user).toBeUndefined();
  });

  it('should reject when token is expired', () => {
    const token = createToken(userPayload, { expiresIn: -1 });
    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    expect((next.mock.calls[0][0] as unknown as Error).message).toBe(
      'Invalid or expired token'
    );
    expect(req.user).toBeUndefined();
  });
});
