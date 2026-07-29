import { IVehicleRepository } from '../interfaces/vehicle-repository.interface';
import { NotFoundError } from '../utils/errors';

export class DeleteVehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async delete(id: string): Promise<void> {
    const deleted = await this.vehicleRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Vehicle');
    }
  }
}
