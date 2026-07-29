import { RegistrationService } from '../services/registration.service';
import { MongooseUserRepository } from '../repositories/user.repository';
import { BcryptPasswordHasher } from '../utils/bcrypt.password-hasher';
import { RegistrationValidator } from '../validators/registration.validator';

export const createRegistrationService = (): RegistrationService =>
  new RegistrationService(
    new MongooseUserRepository(),
    new BcryptPasswordHasher(),
    new RegistrationValidator()
  );
