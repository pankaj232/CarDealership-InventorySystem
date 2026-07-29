import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app';
import config from '../config';
import { UserRole } from '../interfaces/user.interface';
import { IVehicle } from '../interfaces/vehicle.interface';
import Vehicle from '../models/vehicle.model';

describe('POST /api/vehicles/:id/restock', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }, 120000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }, 30000);

  afterEach(async () => {
    await Vehicle.deleteMany({});
  });

  const tokenFor = (role: UserRole): string =>
    jwt.sign(
      {
        id: new mongoose.Types.ObjectId().toString(),
        email: `${role}@example.com`,
        role,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

  const vehicleData: IVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    price: 25000,
    quantity: 2,
  };

  it('should allow an admin to restock and return updated inventory', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ amount: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: vehicle._id.toString(),
      make: vehicleData.make,
      model: vehicleData.model,
      quantity: 7,
    });

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(7);
  });

  it('should return 403 when a normal user tries to restock', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${tokenFor('user')}`)
      .send({ amount: 5 });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(2);
  });

  it('should return 401 when no JWT is provided', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .send({ amount: 5 });

    expect(response.status).toBe(401);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(2);
  });

  it('should return 400 when amount is invalid', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ amount: 0 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'amount' })])
    );
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${new mongoose.Types.ObjectId()}/restock`)
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ amount: 5 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });
});
