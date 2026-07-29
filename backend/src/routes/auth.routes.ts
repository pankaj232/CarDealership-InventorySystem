import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createRegistrationService } from '../services/registration.factory';
import { createLoginService } from '../services/login.factory';

const router = Router();
const authController = new AuthController(
  createRegistrationService(),
  createLoginService()
);

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
