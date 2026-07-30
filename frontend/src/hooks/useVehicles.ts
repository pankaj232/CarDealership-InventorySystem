import { useCallback, useEffect, useState } from 'react';
import { vehiclesApi } from '@/api/vehicles';
import type { Vehicle, VehicleSearchParams } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export const useVehicles = (initialFilters: VehicleSearchParams | null = null) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<VehicleSearchParams | null>(
    initialFilters
  );

  const loadVehicles = useCallback(async (nextFilters: VehicleSearchParams | null) => {
    setLoading(true);
    setError('');
    try {
      const data = nextFilters
        ? await vehiclesApi.search(nextFilters)
        : await vehiclesApi.list();
      setVehicles(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load vehicles'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles(filters);
  }, [filters, loadVehicles]);

  const search = (nextFilters: VehicleSearchParams) => {
    setFilters(nextFilters);
  };

  const clearFilters = () => {
    setFilters(null);
  };

  const refresh = () => loadVehicles(filters);

  return {
    vehicles,
    loading,
    error,
    filters,
    search,
    clearFilters,
    refresh,
    setError,
  };
};
