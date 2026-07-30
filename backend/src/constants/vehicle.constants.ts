import { VehicleCategory } from '../interfaces/vehicle.interface';

export const VEHICLE_CATEGORIES: readonly VehicleCategory[] = [
  'sedan',
  'suv',
  'truck',
  'coupe',
  'convertible',
  'hatchback',
  'van',
] as const;
