import mongoose from 'mongoose';
import config from './index';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.mongodbUri);

  const dbName = mongoose.connection.name || 'unknown';
  console.log(`MongoDB connected: ${dbName}`);
};
