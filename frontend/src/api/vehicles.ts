import { api } from '@/api/client';
import type {
  Vehicle,
  VehiclePayload,
  VehicleSearchParams,
} from '@/types';

export const vehiclesApi = {
  async list(): Promise<Vehicle[]> {
    const { data } = await api.get<Vehicle[]>('/vehicles');
    return data;
  },
  async search(params: VehicleSearchParams): Promise<Vehicle[]> {
    const { data } = await api.get<Vehicle[]>('/vehicles/search', { params });
    return data;
  },
  async create(payload: VehiclePayload): Promise<Vehicle> {
    const { data } = await api.post<Vehicle>('/vehicles', payload);
    return data;
  },
  async update(id: string, payload: VehiclePayload): Promise<Vehicle> {
    const { data } = await api.put<Vehicle>(`/vehicles/${id}`, payload);
    return data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },
  async purchase(id: string): Promise<Vehicle> {
    const { data } = await api.post<Vehicle>(`/vehicles/${id}/purchase`);
    return data;
  },
  async restock(id: string, amount: number): Promise<Vehicle> {
    const { data } = await api.post<Vehicle>(`/vehicles/${id}/restock`, {
      amount,
    });
    return data;
  },
};
