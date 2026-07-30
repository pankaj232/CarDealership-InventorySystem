import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startMemoryMongo, stopMemoryMongo } from './helpers/mongo';
import Vehicle from '../models/vehicle.model';
import { PurchaseService } from '../services/purchase.service';
import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { NotFoundError, OutOfStockError } from '../utils/errors';
import { IVehicle } from '../interfaces/vehicle.interface';

describe('PurchaseService', () => {
  let mongoServer: MongoMemoryServer;
  let purchaseService: PurchaseService;

  beforeAll(async () => {
    mongoServer = await startMemoryMongo();
  }, 120000);

  afterAll(async () => {
    await stopMemoryMongo(mongoServer);
  }, 30000);

  beforeEach(() => {
    purchaseService = new PurchaseService(new MongooseVehicleRepository());
  });

  afterEach(async () => {
    await Vehicle.deleteMany({});
  });

  const vehicleData: IVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    price: 25000,
    quantity: 3,
  };

  it('should decrease quantity by one and return the updated vehicle', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const result = await purchaseService.purchase(vehicle._id.toString());

    expect(result.id).toBe(vehicle._id.toString());
    expect(result.quantity).toBe(2);
    expect(result.make).toBe(vehicleData.make);
    expect(result.model).toBe(vehicleData.model);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(2);
  });

  it('should allow purchasing the last available unit', async () => {
    const vehicle = await Vehicle.create({ ...vehicleData, quantity: 1 });

    const result = await purchaseService.purchase(vehicle._id.toString());

    expect(result.quantity).toBe(0);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(0);
  });

  it('should reject purchase when quantity is zero', async () => {
    const vehicle = await Vehicle.create({ ...vehicleData, quantity: 0 });

    await expect(
      purchaseService.purchase(vehicle._id.toString())
    ).rejects.toBeInstanceOf(OutOfStockError);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(0);
  });

  it('should reject purchase when vehicle does not exist', async () => {
    await expect(
      purchaseService.purchase(new mongoose.Types.ObjectId().toString())
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
