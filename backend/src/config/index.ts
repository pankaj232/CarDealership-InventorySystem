import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export default config;
