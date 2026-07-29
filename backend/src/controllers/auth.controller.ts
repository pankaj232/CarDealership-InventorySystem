import { NextFunction, Request, Response } from 'express';
import { RegistrationService } from '../services/registration.service';
import { LoginService } from '../services/login.service';

export class AuthController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.registrationService.register({
        name: req.body?.name ?? '',
        email: req.body?.email ?? '',
        password: req.body?.password ?? '',
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.loginService.login({
        email: req.body?.email ?? '',
        password: req.body?.password ?? '',
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
