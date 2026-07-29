import { UserRole } from './user.interface';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface PersistedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<PersistedUser | null>;
  create(data: CreateUserData): Promise<PersistedUser>;
}
