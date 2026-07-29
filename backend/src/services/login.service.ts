import {
  ILoginValidator,
  LoginInput,
} from '../interfaces/login-validator.interface';
import { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { InvalidCredentialsError } from '../utils/errors';

export interface LoginResult {
  token: string;
}

export class LoginService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly validator: ILoginValidator
  ) {}

  async login(input: LoginInput): Promise<LoginResult> {
    this.validator.validate(input);

    const email = input.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.password
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}
