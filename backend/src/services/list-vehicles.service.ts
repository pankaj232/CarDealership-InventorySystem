import {
  IVehicleRepository,
  PersistedVehicle,
  VehiclePagination,
} from '../interfaces/vehicle-repository.interface';

export class ListVehiclesService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async list(pagination?: VehiclePagination): Promise<PersistedVehicle[]> {
    return this.vehicleRepository.findAll(pagination);
  }
}
