import { useCallback, useEffect, useState } from 'react';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleFilters } from '@/components/vehicles/VehicleFilters';
import type { Vehicle, VehicleSearchParams } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export const DashboardPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [purchasingId, setPurchasingId] = useState('');
  const [activeFilters, setActiveFilters] = useState<VehicleSearchParams | null>(
    null
  );

  const loadVehicles = useCallback(async (filters: VehicleSearchParams | null) => {
    setLoading(true);
    setError('');
    try {
      const { data } = filters
        ? await vehiclesApi.search(filters)
        : await vehiclesApi.list();
      setVehicles(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load vehicles'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles(null);
  }, [loadVehicles]);

  const handleSearch = (filters: VehicleSearchParams) => {
    setActiveFilters(filters);
    setActionError('');
    void loadVehicles(filters);
  };

  const handleClear = () => {
    setActiveFilters(null);
    setActionError('');
    void loadVehicles(null);
  };

  const handlePurchase = async (vehicle: Vehicle) => {
    setPurchasingId(vehicle.id);
    setActionError('');
    try {
      await vehiclesApi.purchase(vehicle.id);
      await loadVehicles(activeFilters);
    } catch (err) {
      setActionError(
        getErrorMessage(err, `Unable to purchase ${vehicle.make} ${vehicle.model}`)
      );
    } finally {
      setPurchasingId('');
    }
  };

  return (
    <AppShell title="Inventory">
      <VehicleFilters
        loading={loading}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {actionError ? (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-signal/30 bg-signal/10 px-5 py-4 text-sm text-signal"
        >
          {actionError}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-3xl border border-white/10 bg-slate/40"
            />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-3xl border border-signal/30 bg-signal/10 px-6 py-8 text-center">
          <p className="font-display text-xl font-bold text-mist">
            Couldn’t load inventory
          </p>
          <p className="mt-2 text-sm text-signal">{error}</p>
        </div>
      ) : null}

      {!loading && !error && vehicles.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate/40 px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold text-mist">
            No vehicles yet
          </p>
          <p className="mt-2 text-steel">
            {activeFilters
              ? 'No vehicles match the selected filters.'
              : 'Inventory will appear here once vehicles are added.'}
          </p>
        </div>
      ) : null}

      {!loading && !error && vehicles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              purchasing={purchasingId === vehicle.id}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
};
