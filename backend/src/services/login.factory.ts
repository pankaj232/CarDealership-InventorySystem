import config from '../config';
import { LoginService } from './login.service';
import { MongooseUserRepository } from '../repositories/user.repository';
import { BcryptPasswordHasher } from '../utils/bcrypt.password-hasher';
import { JwtTokenService } from '../utils/jwt.token-service';
import { LoginValidator } from '../validators/login.validator';

export const createLoginService = (): LoginService =>
  new LoginService(
    new MongooseUserRepository(),
    new BcryptPasswordHasher(),
    new JwtTokenService(config.jwtSecret, config.jwtExpiresIn),
    new LoginValidator()
  );
