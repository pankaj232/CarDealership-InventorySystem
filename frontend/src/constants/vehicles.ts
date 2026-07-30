import type { VehicleCategory } from '@/types';

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  'sedan',
  'suv',
  'truck',
  'coupe',
  'convertible',
  'hatchback',
  'van',
];

export const formatCategoryLabel = (category: string): string =>
  category.charAt(0).toUpperCase() + category.slice(1);
