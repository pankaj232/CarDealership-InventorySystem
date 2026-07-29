import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app';
import config from '../config';
import { UserRole } from '../interfaces/user.interface';
import { IVehicle } from '../interfaces/vehicle.interface';
import Vehicle from '../models/vehicle.model';

describe('Vehicle routes', () => {
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

  const vehicles: IVehicle[] = [
    {
      make: 'Toyota',
      model: 'Camry',
      category: 'sedan',
      price: 25000,
      quantity: 5,
    },
    {
      make: 'Toyota',
      model: 'RAV4',
      category: 'suv',
      price: 32000,
      quantity: 3,
    },
    {
      make: 'Ford',
      model: 'F-150',
      category: 'truck',
      price: 45000,
      quantity: 2,
    },
    {
      make: 'Honda',
      model: 'Civic',
      category: 'sedan',
      price: 22000,
      quantity: 6,
    },
  ];

  const seedVehicles = async (): Promise<void> => {
    await Vehicle.insertMany(vehicles);
  };

  describe('GET /api/vehicles', () => {
    it('should return all vehicles', async () => {
      await seedVehicles();

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(4);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          make: expect.any(String),
          model: expect.any(String),
          category: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        })
      );
    });

    it('should return an empty array when no vehicles exist', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should support page and limit pagination', async () => {
      await seedVehicles();

      const response = await request(app).get('/api/vehicles?page=2&limit=2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(
        response.body.map((vehicle: { make: string }) => vehicle.make)
      ).toEqual(['Ford', 'Honda']);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(seedVehicles);

    it('should filter by make case-insensitively', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?make=toyota'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(
        response.body.every(
          (vehicle: { make: string }) => vehicle.make === 'Toyota'
        )
      ).toBe(true);
    });

    it('should filter by model case-insensitively', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?model=camry'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].model).toBe('Camry');
    });

    it('should filter by category', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?category=sedan'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter by inclusive minimum and maximum price', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?minPrice=25000&maxPrice=32000'
      );

      expect(response.status).toBe(200);
      expect(
        response.body.map((vehicle: { price: number }) => vehicle.price)
      ).toEqual([25000, 32000]);
    });

    it('should combine filters', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?make=toyota&category=suv&maxPrice=35000'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        make: 'Toyota',
        model: 'RAV4',
        category: 'suv',
      });
    });

    it('should return 400 for an invalid price range', async () => {
      const response = await request(app).get(
        '/api/vehicles/search?minPrice=40000&maxPrice=20000'
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it.each<UserRole>(['user', 'admin'])(
      'should allow a %s to update all editable fields',
      async (role) => {
        const vehicle = await Vehicle.create(vehicles[0]);
        const update = {
          make: 'Lexus',
          model: 'RX',
          category: 'suv',
          price: 55000,
          quantity: 4,
        };

        const response = await request(app)
          .put(`/api/vehicles/${vehicle._id}`)
          .set('Authorization', `Bearer ${tokenFor(role)}`)
          .send(update);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(update);
        expect(response.body.id).toBe(vehicle._id.toString());

        const stored = await Vehicle.findById(vehicle._id);
        expect(stored?.make).toBe(update.make);
        expect(stored?.get('model')).toBe(update.model);
      }
    );

    it('should reject an unauthenticated update', async () => {
      const vehicle = await Vehicle.create(vehicles[0]);

      const response = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .send(vehicles[1]);

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid update data', async () => {
      const vehicle = await Vehicle.create(vehicles[0]);

      const response = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${tokenFor('user')}`)
        .send({ ...vehicles[0], price: 0 });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'price' })])
      );
    });

    it('should return 404 when the vehicle does not exist', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${tokenFor('user')}`)
        .send(vehicles[0]);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Vehicle not found');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should allow an admin to delete a vehicle and return 204', async () => {
      const vehicle = await Vehicle.create(vehicles[0]);

      const response = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${tokenFor('admin')}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(await Vehicle.findById(vehicle._id)).toBeNull();
    });

    it('should return 403 when a normal user tries to delete', async () => {
      const vehicle = await Vehicle.create(vehicles[0]);

      const response = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${tokenFor('user')}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden');
      expect(await Vehicle.findById(vehicle._id)).not.toBeNull();
    });

    it('should return 401 when no JWT is provided', async () => {
      const vehicle = await Vehicle.create(vehicles[0]);

      const response = await request(app).delete(
        `/api/vehicles/${vehicle._id}`
      );

      expect(response.status).toBe(401);
      expect(await Vehicle.findById(vehicle._id)).not.toBeNull();
    });

    it('should return 404 when the vehicle does not exist', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${tokenFor('admin')}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Vehicle not found');
    });
  });
});
