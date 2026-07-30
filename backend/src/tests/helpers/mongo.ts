import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const startMemoryMongo = async (): Promise<MongoMemoryServer> => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  return mongoServer;
};

export const stopMemoryMongo = async (
  mongoServer?: MongoMemoryServer
): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
    } catch {
      // Connection may already be unavailable after a failed startup.
    }
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};
