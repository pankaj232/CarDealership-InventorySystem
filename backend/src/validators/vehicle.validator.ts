import { CreateVehicleData } from '../interfaces/vehicle-repository.interface';
import { IVehicleValidator } from '../interfaces/vehicle-validator.interface';
import { FieldError, ValidationError } from '../utils/errors';
import { VehicleCategory } from '../interfaces/vehicle.interface';

const VALID_CATEGORIES: VehicleCategory[] = [
  'sedan',
  'suv',
  'truck',
  'coupe',
  'convertible',
  'hatchback',
  'van',
];

export class VehicleValidator implements IVehicleValidator {
  validate(input: CreateVehicleData): void {
    const errors: FieldError[] = [];

    if (!input.make || !input.make.trim()) {
      errors.push({ field: 'make', message: 'Make is required' });
    }

    if (!input.model || !input.model.trim()) {
      errors.push({ field: 'model', message: 'Model is required' });
    }

    if (!input.category || !input.category.trim()) {
      errors.push({ field: 'category', message: 'Category is required' });
    } else if (!VALID_CATEGORIES.includes(input.category)) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    if (input.price === undefined || input.price === null) {
      errors.push({ field: 'price', message: 'Price is required' });
    } else if (input.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    }

    if (input.quantity === undefined || input.quantity === null) {
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
