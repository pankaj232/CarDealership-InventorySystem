import api from '@/api/client';
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
  register(payload: RegisterPayload) {
    return api.post<AuthUser>('/auth/register', payload);
  },
  login(payload: LoginPayload) {
    return api.post<LoginResponse>('/auth/login', payload);
  },
};
