export interface FieldError {
  field: string;
  message: string;
}

export abstract class AppError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('Validation failed');
    this.errors = errors;
  }
}

export class DuplicateEmailError extends AppError {
  readonly statusCode = 409;

  constructor(email: string) {
    super(`Email already registered: ${email}`);
  }
}

export class InvalidCredentialsError extends AppError {
  readonly statusCode = 401;

  constructor() {
    super('Invalid email or password');
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;

  constructor(message = 'Authentication required') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;

  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class OutOfStockError extends AppError {
  readonly statusCode = 409;

  constructor() {
    super('Vehicle is out of stock');
  }
}
