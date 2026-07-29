import {
  IVehicleRepository,
  PersistedVehicle,
} from '../interfaces/vehicle-repository.interface';
import { NotFoundError, ValidationError } from '../utils/errors';

export class RestockService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async restock(id: string, amount: number): Promise<PersistedVehicle> {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new ValidationError([
        {
          field: 'amount',
          message: 'Amount must be a positive integer',
        },
      ]);
    }

    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    const updated = await this.vehicleRepository.increaseQuantity(id, amount);

    if (!updated) {
      throw new NotFoundError('Vehicle');
    }

    return updated;
  }
}
