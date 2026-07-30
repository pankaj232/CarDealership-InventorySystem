import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import { UserRole } from '../../interfaces/user.interface';

export const tokenFor = (role: UserRole): string =>
  jwt.sign(
    {
      id: new mongoose.Types.ObjectId().toString(),
      email: `${role}@example.com`,
      role,
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
