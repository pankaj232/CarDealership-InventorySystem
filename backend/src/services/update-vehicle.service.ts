import {
  CreateVehicleData,
  IVehicleRepository,
  PersistedVehicle,
} from '../interfaces/vehicle-repository.interface';
import { IVehicleValidator } from '../interfaces/vehicle-validator.interface';
import { NotFoundError } from '../utils/errors';

export class UpdateVehicleService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly validator: IVehicleValidator
  ) {}

  async update(
    id: string,
    input: CreateVehicleData
  ): Promise<PersistedVehicle> {
    this.validator.validate(input);

    const vehicle = await this.vehicleRepository.update(id, {
      make: input.make.trim(),
      model: input.model.trim(),
      category: input.category,
      price: input.price,
      quantity: input.quantity,
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    return vehicle;
  }
}
