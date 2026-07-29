import mongoose from 'mongoose';
import config from './index';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.mongodbUri);

  console.log(`MongoDB connected: ${config.mongodbUri}`);
};
