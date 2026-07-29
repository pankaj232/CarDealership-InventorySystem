export type VehicleCategory =
  'sedan' | 'suv' | 'truck' | 'coupe' | 'convertible' | 'hatchback' | 'van';

export interface IVehicle {
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
