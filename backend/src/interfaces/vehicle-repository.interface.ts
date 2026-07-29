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

export interface VehiclePagination {
  page?: number;
  limit?: number;
}

export interface VehicleSearchCriteria {
  make?: string;
  model?: string;
  category?: VehicleCategory;
  minPrice?: number;
  maxPrice?: number;
}

export interface IVehicleRepository {
  create(data: CreateVehicleData): Promise<PersistedVehicle>;
  findAll(pagination?: VehiclePagination): Promise<PersistedVehicle[]>;
  search(criteria: VehicleSearchCriteria): Promise<PersistedVehicle[]>;
  update(id: string, data: CreateVehicleData): Promise<PersistedVehicle | null>;
  delete(id: string): Promise<boolean>;
}
