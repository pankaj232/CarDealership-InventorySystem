import { IPasswordHasher } from '../interfaces/password-hasher.interface';
import {
  IRegistrationValidator,
  RegisterInput,
} from '../interfaces/registration-validator.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserRole } from '../interfaces/user.interface';
import { DuplicateEmailError } from '../utils/errors';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class RegistrationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly validator: IRegistrationValidator
  ) {}

  async register(input: RegisterInput): Promise<RegisteredUser> {
    this.validator.validate(input);

    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new DuplicateEmailError(email);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
