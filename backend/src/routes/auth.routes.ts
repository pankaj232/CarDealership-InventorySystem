import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createRegistrationService } from '../services/registration.factory';

const router = Router();
const authController = new AuthController(createRegistrationService());

router.post('/register', authController.register);

export default router;
