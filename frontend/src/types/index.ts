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
  name: string;
  email: string;
  role: UserRole;
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

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  message?: string;
  errors?: FieldError[];
}
