import api from '@/api/client';
import type {
  Vehicle,
  VehiclePayload,
  VehicleSearchParams,
} from '@/types';

export const vehiclesApi = {
  list() {
    return api.get<Vehicle[]>('/vehicles');
  },
  search(params: VehicleSearchParams) {
    return api.get<Vehicle[]>('/vehicles/search', { params });
  },
  create(payload: VehiclePayload) {
    return api.post<Vehicle>('/vehicles', payload);
  },
  update(id: string, payload: VehiclePayload) {
    return api.put<Vehicle>(`/vehicles/${id}`, payload);
  },
  delete(id: string) {
    return api.delete(`/vehicles/${id}`);
  },
  purchase(id: string) {
    return api.post<Vehicle>(`/vehicles/${id}/purchase`);
  },
  restock(id: string, amount: number) {
    return api.post<Vehicle>(`/vehicles/${id}/restock`, { amount });
  },
};
