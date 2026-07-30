import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import Vehicle from '../models/vehicle.model';
import { VehicleCategory } from '../interfaces/vehicle.interface';

describe('Vehicle Model', () => {
  let mongoServer: MongoMemoryServer;

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

  const validVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan' as VehicleCategory,
    price: 25000,
    quantity: 5,
  };

  it('should create a vehicle with all required fields', async () => {
    const vehicle = await Vehicle.create(validVehicle);

    expect(vehicle._id).toBeDefined();
    expect(vehicle.make).toBe(validVehicle.make);
    expect(vehicle.get('model')).toBe(validVehicle.model);
    expect(vehicle.category).toBe(validVehicle.category);
    expect(vehicle.price).toBe(validVehicle.price);
    expect(vehicle.quantity).toBe(validVehicle.quantity);
  });

  it('should include createdAt and updatedAt timestamps', async () => {
    const vehicle = await Vehicle.create(validVehicle);

    expect(vehicle.createdAt).toBeInstanceOf(Date);
    expect(vehicle.updatedAt).toBeInstanceOf(Date);
  });

  it('should require make', async () => {
    await expect(
      Vehicle.create({
        model: validVehicle.model,
        category: validVehicle.category,
        price: validVehicle.price,
        quantity: validVehicle.quantity,
      })
    ).rejects.toThrow();
  });

  it('should require model', async () => {
    await expect(
      Vehicle.create({
        make: validVehicle.make,
        category: validVehicle.category,
        price: validVehicle.price,
        quantity: validVehicle.quantity,
      })
    ).rejects.toThrow();
  });

  it('should require category', async () => {
    await expect(
      Vehicle.create({
        make: validVehicle.make,
        model: validVehicle.model,
        price: validVehicle.price,
        quantity: validVehicle.quantity,
      })
    ).rejects.toThrow();
  });

  it('should reject an invalid category', async () => {
    await expect(
      Vehicle.create({
        ...validVehicle,
        category: 'spaceship' as VehicleCategory,
      })
    ).rejects.toThrow();
  });

  it('should require price', async () => {
    await expect(
      Vehicle.create({
        make: validVehicle.make,
        model: validVehicle.model,
        category: validVehicle.category,
        quantity: validVehicle.quantity,
      })
    ).rejects.toThrow();
  });

  it('should reject a negative price', async () => {
    await expect(
      Vehicle.create({ ...validVehicle, price: -1 })
    ).rejects.toThrow();
  });

  it('should reject a zero price', async () => {
    await expect(
      Vehicle.create({ ...validVehicle, price: 0 })
    ).rejects.toThrow();
  });

  it('should require quantity', async () => {
    await expect(
      Vehicle.create({
        make: validVehicle.make,
        model: validVehicle.model,
        category: validVehicle.category,
        price: validVehicle.price,
      })
    ).rejects.toThrow();
  });

  it('should reject a negative quantity', async () => {
    await expect(
      Vehicle.create({ ...validVehicle, quantity: -1 })
    ).rejects.toThrow();
  });

  it('should allow quantity of zero', async () => {
    const vehicle = await Vehicle.create({ ...validVehicle, quantity: 0 });

    expect(vehicle.quantity).toBe(0);
  });

  it('should accept all valid categories', async () => {
    const categories: VehicleCategory[] = [
      'sedan',
      'suv',
      'truck',
      'coupe',
      'convertible',
      'hatchback',
      'van',
    ];

    for (const category of categories) {
      const vehicle = await Vehicle.create({ ...validVehicle, category });
      expect(vehicle.category).toBe(category);
    }
  });
});
