import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export default config;
