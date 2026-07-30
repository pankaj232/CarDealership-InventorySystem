import { NextFunction, Request, Response } from 'express';
import { domainErrorHandler } from '../middleware/domain-error.handler';
import { errorHandler } from '../middleware/error.handler';
import {
  DuplicateEmailError,
  ForbiddenError,
  InvalidCredentialsError,
  NotFoundError,
  OutOfStockError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';

const createResponse = () => {
  const res = {
    statusCode: 0,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
};

describe('domainErrorHandler', () => {
  it('should map ValidationError to 400 with field errors', () => {
    const res = createResponse();
    const next = jest.fn();
    const error = new ValidationError([
      { field: 'email', message: 'Email is required' },
    ]);

    domainErrorHandler(error, {} as Request, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: 'Validation failed',
      errors: [{ field: 'email', message: 'Email is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it.each([
    [new DuplicateEmailError('a@b.com'), 409],
    [new OutOfStockError(), 409],
    [new InvalidCredentialsError(), 401],
    [new UnauthorizedError(), 401],
    [new ForbiddenError(), 403],
    [new NotFoundError('Vehicle'), 404],
  ])('should map %p to status %i', (error, status) => {
    const res = createResponse();
    const next = jest.fn();

    domainErrorHandler(error, {} as Request, res, next);

    expect(res.statusCode).toBe(status);
    expect((res.body as { message: string }).message).toBe(error.message);
    expect(next).not.toHaveBeenCalled();
  });

  it('should forward unknown errors', () => {
    const res = createResponse();
    const next = jest.fn() as NextFunction;
    const error = new Error('boom');

    domainErrorHandler(error, {} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('errorHandler', () => {
  it('should return a generic 500 response', () => {
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(new Error('unexpected'), {} as Request, res, jest.fn());

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
    consoleSpy.mockRestore();
  });
});
