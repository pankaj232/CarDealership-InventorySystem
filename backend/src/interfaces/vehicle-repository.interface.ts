import { VehicleCategory } from './vehicle.interface';

export interface CreateVehicleData {
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
}

export interface PersistedVehicle {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicleRepository {
  create(data: CreateVehicleData): Promise<PersistedVehicle>;
}
