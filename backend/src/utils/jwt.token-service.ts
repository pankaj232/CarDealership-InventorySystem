import jwt from 'jsonwebtoken';
import {
  ITokenService,
  TokenPayload,
} from '../interfaces/token-service.interface';

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string | number = '1d'
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }
}
