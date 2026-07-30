import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import jwt from 'jsonwebtoken';
import app from '../app';

describe('POST /api/auth/login', () => {
  let mongoServer: MongoMemoryServer;

  const jwtSecret = process.env.JWT_SECRET || 'test-jwt-secret';

  const credentials = {
    email: 'jane@example.com',
    password: 'securePassword123',
  };

  beforeAll(async () => {
    mongoServer = await startMemoryMongo();
  }, 120000);

  afterAll(async () => {
    await stopMemoryMongo(mongoServer);
  }, 30000);

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  const registerUser = async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        ...credentials,
      });
    expect(response.status).toBe(201);
    return response.body;
  };

  it('should return a JWT token for valid credentials', async () => {
    const user = await registerUser();

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');

    const payload = jwt.verify(
      response.body.token,
      jwtSecret
    ) as jwt.JwtPayload;
    expect(payload.id).toBe(user.id);
    expect(payload.email).toBe(user.email);
    expect(payload.role).toBe(user.role);
  });

  it('should return 401 for unknown email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 401 for incorrect password', async () => {
    await registerUser();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        ...credentials,
        password: 'wrongPassword123',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 400 with field errors when validation fails', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: '',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'password' }),
      ])
    );
  });
});
