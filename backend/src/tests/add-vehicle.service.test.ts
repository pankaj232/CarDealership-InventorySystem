import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Vehicle from '../models/vehicle.model';
import { AddVehicleService } from '../services/add-vehicle.service';
import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { VehicleValidator } from '../validators/vehicle.validator';
import { ValidationError } from '../utils/errors';
import { VehicleCategory } from '../interfaces/vehicle.interface';

describe('AddVehicleService', () => {
  let mongoServer: MongoMemoryServer;
  let addVehicleService: AddVehicleService;

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
    addVehicleService = new AddVehicleService(
      new MongooseVehicleRepository(),
      new VehicleValidator()
    );
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  const validInput = {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan' as VehicleCategory,
    price: 25000,
    quantity: 5,
  };

  describe('successful creation', () => {
    it('should create and return the vehicle', async () => {
      const result = await addVehicleService.addVehicle(validInput);

      expect(result.id).toBeDefined();
      expect(result.make).toBe(validInput.make);
      expect(result.model).toBe(validInput.model);
      expect(result.category).toBe(validInput.category);
      expect(result.price).toBe(validInput.price);
      expect(result.quantity).toBe(validInput.quantity);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist the vehicle in the database', async () => {
      const result = await addVehicleService.addVehicle(validInput);

      const stored = await Vehicle.findById(result.id);
      expect(stored).not.toBeNull();
      expect(stored!.make).toBe(validInput.make);
      expect(stored!.get('model')).toBe(validInput.model);
    });

    it('should allow quantity of zero', async () => {
      const result = await addVehicleService.addVehicle({
        ...validInput,
        quantity: 0,
      });

      expect(result.quantity).toBe(0);
    });
  });

  describe('validation', () => {
    it('should reject missing make', async () => {
      await expect(
        addVehicleService.addVehicle({ ...validInput, make: '' })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject missing model', async () => {
      await expect(
        addVehicleService.addVehicle({ ...validInput, model: '' })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject missing category', async () => {
      await expect(
        addVehicleService.addVehicle({
          ...validInput,
          category: '' as VehicleCategory,
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject an invalid category', async () => {
      await expect(
        addVehicleService.addVehicle({
          ...validInput,
          category: 'spaceship' as VehicleCategory,
        })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject a zero price', async () => {
      await expect(
        addVehicleService.addVehicle({ ...validInput, price: 0 })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject a negative price', async () => {
      await expect(
        addVehicleService.addVehicle({ ...validInput, price: -100 })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should reject a negative quantity', async () => {
      await expect(
        addVehicleService.addVehicle({ ...validInput, quantity: -1 })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('should include field errors on validation failure', async () => {
      try {
        await addVehicleService.addVehicle({
          make: '',
          model: '',
          category: '' as VehicleCategory,
          price: -1,
          quantity: -1,
        });
        fail('expected ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const ve = error as ValidationError;
        expect(ve.errors.length).toBeGreaterThan(0);
        expect(ve.errors.every((e) => e.field && e.message)).toBe(true);
      }
    });
  });
});
