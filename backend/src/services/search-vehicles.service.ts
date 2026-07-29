import {
  IVehicleRepository,
  PersistedVehicle,
  VehicleSearchCriteria,
} from '../interfaces/vehicle-repository.interface';
import { FieldError, ValidationError } from '../utils/errors';

export class SearchVehiclesService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async search(criteria: VehicleSearchCriteria): Promise<PersistedVehicle[]> {
    const errors: FieldError[] = [];

    if (
      criteria.minPrice !== undefined &&
      (!Number.isFinite(criteria.minPrice) || criteria.minPrice < 0)
    ) {
      errors.push({
        field: 'minPrice',
        message: 'Minimum price must be a non-negative number',
      });
    }

    if (
      criteria.maxPrice !== undefined &&
      (!Number.isFinite(criteria.maxPrice) || criteria.maxPrice < 0)
    ) {
      errors.push({
        field: 'maxPrice',
        message: 'Maximum price must be a non-negative number',
      });
    }

    if (
      criteria.minPrice !== undefined &&
      criteria.maxPrice !== undefined &&
      criteria.minPrice > criteria.maxPrice
    ) {
      errors.push({
        field: 'price',
        message: 'Minimum price cannot exceed maximum price',
      });
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return this.vehicleRepository.search(criteria);
  }
}
