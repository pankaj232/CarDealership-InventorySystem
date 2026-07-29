import api from '@/api/client';
import type { Vehicle } from '@/types';

export const vehiclesApi = {
  list() {
    return api.get<Vehicle[]>('/vehicles');
  },
};
