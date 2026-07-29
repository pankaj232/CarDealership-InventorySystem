export type UserRole = 'user' | 'admin';

export type VehicleCategory =
  | 'sedan'
  | 'suv'
  | 'truck'
  | 'coupe'
  | 'convertible'
  | 'hatchback'
  | 'van';

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  exp?: number;
}

export interface LoginResponse {
  token: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: VehicleCategory;
  minPrice?: number;
  maxPrice?: number;
}

export interface VehiclePayload {
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  message?: string;
  errors?: FieldError[];
}
