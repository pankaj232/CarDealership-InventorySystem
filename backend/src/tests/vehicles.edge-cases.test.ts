import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import { tokenFor } from './helpers/auth';
import request from 'supertest';
import app from '../app';
import Vehicle from '../models/vehicle.model';

describe('Vehicle and auth edge cases', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await startMemoryMongo();
  }, 120000);

  afterAll(async () => {
    await stopMemoryMongo(mongoServer);
  }, 30000);

  afterEach(async () => {
    await Vehicle.deleteMany({});
  });

  it('should return 404 for an invalid vehicle id on purchase', async () => {
    const response = await request(app)
      .post('/api/vehicles/not-an-object-id/purchase')
      .set('Authorization', `Bearer ${tokenFor('user')}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('should reject non-string login credentials with validation errors', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: 'secret' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });
});
