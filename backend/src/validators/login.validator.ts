import {
  ILoginValidator,
  LoginInput,
} from '../interfaces/login-validator.interface';
import { FieldError, ValidationError } from '../utils/errors';

export class LoginValidator implements ILoginValidator {
  validate(input: LoginInput): void {
    const errors: FieldError[] = [];

    if (!input.email || !input.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    }

    if (!input.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
}
