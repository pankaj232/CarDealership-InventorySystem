import jwt from 'jsonwebtoken';
import {
  ITokenService,
  TokenPayload,
} from '../interfaces/token-service.interface';
import { UnauthorizedError } from './errors';

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

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);

      if (typeof decoded === 'string' || !decoded.id || !decoded.email) {
        throw new UnauthorizedError('Invalid or expired token');
      }

      return {
        id: String(decoded.id),
        email: String(decoded.email),
        role: decoded.role as TokenPayload['role'],
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
