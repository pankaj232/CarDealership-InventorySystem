import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import app from '../app';
import User from '../models/user.model';

describe('POST /api/auth/register', () => {
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

  const validBody = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securePassword123',
  };

  it('should register a user and return 201 Created', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validBody);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: validBody.name,
      email: validBody.email,
      role: 'user',
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body).not.toHaveProperty('password');
  });

  it('should persist a bcrypt-hashed password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validBody);

    const stored = await User.findById(response.body.id);
    expect(stored).not.toBeNull();
    expect(stored!.password).not.toBe(validBody.password);

    const matches = await bcrypt.compare(validBody.password, stored!.password);
    expect(matches).toBe(true);
  });

  it('should return 400 with field errors when validation fails', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'not-an-email',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(
      response.body.errors.every(
        (error: { field: string; message: string }) =>
          error.field && error.message
      )
    ).toBe(true);
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app).post('/api/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'password' }),
      ])
    );
  });

  it('should return 409 when email is already registered', async () => {
    await request(app).post('/api/auth/register').send(validBody);

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        ...validBody,
        name: 'Other User',
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/email/i);
  });

  it('should not create a second user when email conflicts', async () => {
    await request(app).post('/api/auth/register').send(validBody);
    await request(app)
      .post('/api/auth/register')
      .send({
        ...validBody,
        name: 'Other User',
      });

    const count = await User.countDocuments();
    expect(count).toBe(1);
  });
});
