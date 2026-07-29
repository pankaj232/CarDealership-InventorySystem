import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app';
import config from '../config';
import { UserRole } from '../interfaces/user.interface';
import { IVehicle } from '../interfaces/vehicle.interface';
import Vehicle from '../models/vehicle.model';

describe('POST /api/vehicles/:id/purchase', () => {
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
    quantity: 3,
  };

  it.each<UserRole>(['user', 'admin'])(
    'should allow a %s to purchase a vehicle and decrease quantity',
    async (role) => {
      const vehicle = await Vehicle.create(vehicleData);

      const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${tokenFor(role)}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: vehicle._id.toString(),
        make: vehicleData.make,
        model: vehicleData.model,
        quantity: 2,
      });

      const stored = await Vehicle.findById(vehicle._id);
      expect(stored!.quantity).toBe(2);
    }
  );

  it('should reject purchase when quantity is zero', async () => {
    const vehicle = await Vehicle.create({ ...vehicleData, quantity: 0 });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${tokenFor('user')}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Vehicle is out of stock');

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(0);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${new mongoose.Types.ObjectId()}/purchase`)
      .set('Authorization', `Bearer ${tokenFor('user')}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('should reject an unauthenticated purchase', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const response = await request(app).post(
      `/api/vehicles/${vehicle._id}/purchase`
    );

    expect(response.status).toBe(401);
    expect(await Vehicle.findById(vehicle._id)).not.toBeNull();
    expect((await Vehicle.findById(vehicle._id))!.quantity).toBe(3);
  });
});
