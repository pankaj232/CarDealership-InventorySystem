import { VEHICLE_CATEGORIES } from '../constants/vehicle.constants';
import { CreateVehicleData } from '../interfaces/vehicle-repository.interface';
import { IVehicleValidator } from '../interfaces/vehicle-validator.interface';
import { FieldError, ValidationError } from '../utils/errors';

export class VehicleValidator implements IVehicleValidator {
  validate(input: CreateVehicleData): void {
    const errors: FieldError[] = [];

    if (typeof input.make !== 'string' || !input.make.trim()) {
      errors.push({ field: 'make', message: 'Make is required' });
    }

    if (typeof input.model !== 'string' || !input.model.trim()) {
      errors.push({ field: 'model', message: 'Model is required' });
    }

    if (typeof input.category !== 'string' || !input.category.trim()) {
      errors.push({ field: 'category', message: 'Category is required' });
    } else if (
      !VEHICLE_CATEGORIES.includes(
        input.category as (typeof VEHICLE_CATEGORIES)[number]
      )
    ) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`,
      });
    }

    if (typeof input.price !== 'number' || Number.isNaN(input.price)) {
      errors.push({ field: 'price', message: 'Price is required' });
    } else if (input.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    }

    if (typeof input.quantity !== 'number' || Number.isNaN(input.quantity)) {
      errors.push({ field: 'quantity', message: 'Quantity is required' });
    } else if (input.quantity < 0) {
      errors.push({
        field: 'quantity',
        message: 'Quantity cannot be negative',
      });
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
}
