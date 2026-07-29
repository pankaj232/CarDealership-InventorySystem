import {
  IRegistrationValidator,
  RegisterInput,
} from '../interfaces/registration-validator.interface';
import { FieldError, ValidationError } from '../utils/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export class RegistrationValidator implements IRegistrationValidator {
  validate(input: RegisterInput): void {
    const errors: FieldError[] = [];

    if (!input.name || !input.name.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!input.email || !input.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
      errors.push({ field: 'email', message: 'Email format is invalid' });
    }

    if (!input.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (input.password.length < MIN_PASSWORD_LENGTH) {
      errors.push({
        field: 'password',
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
}
