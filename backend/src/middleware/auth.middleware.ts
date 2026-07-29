import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { ITokenService } from '../interfaces/token-service.interface';
import { UnauthorizedError } from '../utils/errors';
import { JwtTokenService } from '../utils/jwt.token-service';

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const createAuthenticateMiddleware = (tokenService: ITokenService) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const token = extractBearerToken(req.headers.authorization);

      if (!token) {
        throw new UnauthorizedError('Authentication required');
      }

      const payload = tokenService.verify(token);

      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tokenService = new JwtTokenService(
    config.jwtSecret,
    config.jwtExpiresIn
  );
  createAuthenticateMiddleware(tokenService)(req, res, next);
};
