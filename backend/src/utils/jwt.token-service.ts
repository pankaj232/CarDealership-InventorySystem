import jwt from 'jsonwebtoken';
import {
  ITokenService,
  TokenPayload,
} from '../interfaces/token-service.interface';
import { UnauthorizedError } from './errors';
import { UserRole } from '../interfaces/user.interface';

const VALID_ROLES: UserRole[] = ['user', 'admin'];

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string | number = '1d'
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ['HS256'],
      });

      if (
        typeof decoded === 'string' ||
        !decoded.id ||
        !decoded.email ||
        !VALID_ROLES.includes(decoded.role as UserRole)
      ) {
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
