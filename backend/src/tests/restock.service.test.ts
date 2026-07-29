import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Vehicle from '../models/vehicle.model';
import { RestockService } from '../services/restock.service';
import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { NotFoundError, ValidationError } from '../utils/errors';
import { IVehicle } from '../interfaces/vehicle.interface';

describe('RestockService', () => {
  let mongoServer: MongoMemoryServer;
  let restockService: RestockService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }, 120000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
  }, 30000);

  beforeEach(() => {
    restockService = new RestockService(new MongooseVehicleRepository());
  });

  afterEach(async () => {
    await Vehicle.deleteMany({});
  });

  const vehicleData: IVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    price: 25000,
    quantity: 2,
  };

  it('should increase quantity by the given amount and return updated vehicle', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    const result = await restockService.restock(vehicle._id.toString(), 5);

    expect(result.id).toBe(vehicle._id.toString());
    expect(result.quantity).toBe(7);
    expect(result.make).toBe(vehicleData.make);
    expect(result.model).toBe(vehicleData.model);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(7);
  });

  it('should restock a vehicle that was out of stock', async () => {
    const vehicle = await Vehicle.create({ ...vehicleData, quantity: 0 });

    const result = await restockService.restock(vehicle._id.toString(), 3);

    expect(result.quantity).toBe(3);
  });

  it('should reject restock when amount is zero', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    await expect(
      restockService.restock(vehicle._id.toString(), 0)
    ).rejects.toBeInstanceOf(ValidationError);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(2);
  });

  it('should reject restock when amount is negative', async () => {
    const vehicle = await Vehicle.create(vehicleData);

    await expect(
      restockService.restock(vehicle._id.toString(), -1)
    ).rejects.toBeInstanceOf(ValidationError);

    const stored = await Vehicle.findById(vehicle._id);
    expect(stored!.quantity).toBe(2);
  });

  it('should reject restock when vehicle does not exist', async () => {
    await expect(
      restockService.restock(new mongoose.Types.ObjectId().toString(), 5)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
