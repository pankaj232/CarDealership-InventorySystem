import {
  IVehicleRepository,
  PersistedVehicle,
} from '../interfaces/vehicle-repository.interface';
import { NotFoundError, OutOfStockError } from '../utils/errors';

export class PurchaseService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async purchase(id: string): Promise<PersistedVehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    if (vehicle.quantity === 0) {
      throw new OutOfStockError();
    }

    const updated = await this.vehicleRepository.decreaseQuantity(id);

    if (!updated) {
      throw new OutOfStockError();
    }

    return updated;
  }
}
