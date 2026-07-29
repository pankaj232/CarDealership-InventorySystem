import { UserRole } from './user.interface';

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
}
