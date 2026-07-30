import { api } from '@/api/client';
import type { AuthUser, LoginResponse } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>('/auth/register', payload);
    return data;
  },
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },
};
