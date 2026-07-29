import {
  CreateVehicleData,
  IVehicleRepository,
  PersistedVehicle,
} from '../interfaces/vehicle-repository.interface';
import { IVehicleValidator } from '../interfaces/vehicle-validator.interface';

export class AddVehicleService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly validator: IVehicleValidator
  ) {}

  async addVehicle(input: CreateVehicleData): Promise<PersistedVehicle> {
    this.validator.validate(input);

    return this.vehicleRepository.create({
      make: input.make.trim(),
      model: input.model.trim(),
      category: input.category,
      price: input.price,
      quantity: input.quantity,
    });
  }
}
