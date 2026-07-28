import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/user.model';

describe('User Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }, 120000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  const validUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securePassword123',
  };

  it('should create a user with required fields', async () => {
    const user = await User.create(validUser);

    expect(user.name).toBe(validUser.name);
    expect(user.email).toBe(validUser.email);
    expect(user.password).toBe(validUser.password);
    expect(user._id).toBeDefined();
  });

  it('should default role to user', async () => {
    const user = await User.create(validUser);

    expect(user.role).toBe('user');
  });

  it('should allow role to be set to admin', async () => {
    const user = await User.create({ ...validUser, role: 'admin' });

    expect(user.role).toBe('admin');
  });

  it('should include createdAt and updatedAt timestamps', async () => {
    const user = await User.create(validUser);

    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should require name', async () => {
    await expect(
      User.create({
        email: validUser.email,
        password: validUser.password,
      })
    ).rejects.toThrow();
  });

  it('should require email', async () => {
    await expect(
      User.create({
        name: validUser.name,
        password: validUser.password,
      })
    ).rejects.toThrow();
  });

  it('should require password', async () => {
    await expect(
      User.create({
        name: validUser.name,
        email: validUser.email,
      })
    ).rejects.toThrow();
  });

  it('should enforce unique email', async () => {
    await User.create(validUser);

    await expect(
      User.create({ ...validUser, name: 'Other User' })
    ).rejects.toThrow();
  });

  it('should reject invalid role values', async () => {
    await expect(
      User.create({ ...validUser, role: 'superadmin' as 'user' })
    ).rejects.toThrow();
  });
});
