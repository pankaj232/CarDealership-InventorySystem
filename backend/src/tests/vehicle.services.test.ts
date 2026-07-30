import { ListVehiclesService } from '../services/list-vehicles.service';
import { SearchVehiclesService } from '../services/search-vehicles.service';
import { DeleteVehicleService } from '../services/delete-vehicle.service';
import { UpdateVehicleService } from '../services/update-vehicle.service';
import { IVehicleRepository } from '../interfaces/vehicle-repository.interface';
import { NotFoundError, ValidationError } from '../utils/errors';
import { IVehicleValidator } from '../interfaces/vehicle-validator.interface';

const vehicle = {
  id: '1',
  make: 'Toyota',
  model: 'Camry',
  category: 'sedan' as const,
  price: 25000,
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createRepository = (
  overrides: Partial<IVehicleRepository> = {}
): IVehicleRepository =>
  ({
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn().mockResolvedValue([vehicle]),
    search: jest.fn().mockResolvedValue([vehicle]),
    update: jest.fn().mockResolvedValue(vehicle),
    decreaseQuantity: jest.fn(),
    increaseQuantity: jest.fn(),
    delete: jest.fn().mockResolvedValue(true),
    ...overrides,
  }) as IVehicleRepository;

describe('ListVehiclesService', () => {
  it('should delegate to the repository', async () => {
    const repository = createRepository();
    const service = new ListVehiclesService(repository);

    await expect(service.list({ page: 1, limit: 10 })).resolves.toEqual([
      vehicle,
    ]);
    expect(repository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});

describe('SearchVehiclesService', () => {
  it('should search with valid criteria', async () => {
    const repository = createRepository();
    const service = new SearchVehiclesService(repository);

    await expect(
      service.search({ make: 'Toyota', minPrice: 1000, maxPrice: 30000 })
    ).resolves.toEqual([vehicle]);
  });

  it('should reject an inverted price range', async () => {
    const service = new SearchVehiclesService(createRepository());

    await expect(
      service.search({ minPrice: 50000, maxPrice: 1000 })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('DeleteVehicleService', () => {
  it('should delete an existing vehicle', async () => {
    const repository = createRepository();
    const service = new DeleteVehicleService(repository);

    await expect(service.delete('1')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw when vehicle is missing', async () => {
    const repository = createRepository({
      delete: jest.fn().mockResolvedValue(false),
    });
    const service = new DeleteVehicleService(repository);

    await expect(service.delete('missing')).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe('UpdateVehicleService', () => {
  const validator: IVehicleValidator = {
    validate: jest.fn(),
  };

  it('should update after validation', async () => {
    const repository = createRepository();
    const service = new UpdateVehicleService(repository, validator);

    const result = await service.update('1', {
      make: ' Honda ',
      model: ' Civic ',
      category: 'sedan',
      price: 22000,
      quantity: 4,
    });

    expect(validator.validate).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith('1', {
      make: 'Honda',
      model: 'Civic',
      category: 'sedan',
      price: 22000,
      quantity: 4,
    });
    expect(result).toEqual(vehicle);
  });

  it('should throw when vehicle is missing', async () => {
    const repository = createRepository({
      update: jest.fn().mockResolvedValue(null),
    });
    const service = new UpdateVehicleService(repository, validator);

    await expect(
      service.update('missing', {
        make: 'Honda',
        model: 'Civic',
        category: 'sedan',
        price: 22000,
        quantity: 4,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
