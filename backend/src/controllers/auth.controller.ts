import { NextFunction, Request, Response } from 'express';
import { RegistrationService } from '../services/registration.service';

export class AuthController {
  constructor(private readonly registrationService: RegistrationService) {}

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
}
