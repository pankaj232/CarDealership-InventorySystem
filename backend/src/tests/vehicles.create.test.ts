import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import { tokenFor } from './helpers/auth';
import request from 'supertest';
import app from '../app';
import Vehicle from '../models/vehicle.model';
import { UserRole } from '../interfaces/user.interface';

describe('POST /api/vehicles', () => {
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

  const validVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    price: 25000,
    quantity: 5,
  };

  it.each<UserRole>(['user', 'admin'])(
    'should allow a %s to add a vehicle',
    async (role) => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${tokenFor(role)}`)
        .send(validVehicle);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(validVehicle);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(await Vehicle.countDocuments()).toBe(1);
    }
  );

  it('should reject a request without a JWT', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send(validVehicle);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
    expect(await Vehicle.countDocuments()).toBe(0);
  });

  it('should reject an invalid JWT', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', 'Bearer invalid-token')
      .send(validVehicle);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or expired token');
    expect(await Vehicle.countDocuments()).toBe(0);
  });

  it('should return validation errors without saving the vehicle', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${tokenFor('user')}`)
      .send({
        make: '',
        model: '',
        category: 'spaceship',
        price: 0,
        quantity: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'make' }),
        expect.objectContaining({ field: 'model' }),
        expect.objectContaining({ field: 'category' }),
        expect.objectContaining({ field: 'price' }),
        expect.objectContaining({ field: 'quantity' }),
      ])
    );
    expect(await Vehicle.countDocuments()).toBe(0);
  });
});
