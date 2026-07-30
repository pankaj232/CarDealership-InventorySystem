import { useState } from 'react';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleCardSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { VehicleFilters } from '@/components/vehicles/VehicleFilters';
import { useVehicles } from '@/hooks/useVehicles';
import type { Vehicle, VehicleSearchParams } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export const DashboardPage = () => {
  const {
    vehicles,
    loading,
    error,
    filters,
    search,
    clearFilters,
    refresh,
  } = useVehicles();
  const [actionError, setActionError] = useState('');
  const [purchasingId, setPurchasingId] = useState('');

  const handleSearch = (nextFilters: VehicleSearchParams) => {
    setActionError('');
    search(nextFilters);
  };

  const handleClear = () => {
    setActionError('');
    clearFilters();
  };

  const handlePurchase = async (vehicle: Vehicle) => {
    setPurchasingId(vehicle.id);
    setActionError('');
    try {
      await vehiclesApi.purchase(vehicle.id);
      await refresh();
    } catch (err) {
      setActionError(
        getErrorMessage(
          err,
          `Unable to purchase ${vehicle.make} ${vehicle.model}`
        )
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

      {actionError ? <Alert className="mb-6 px-5 py-4">{actionError}</Alert> : null}

      {loading ? <VehicleCardSkeleton /> : null}

      {!loading && error ? (
        <div className="rounded-3xl border border-signal/30 bg-signal/10 px-6 py-8 text-center">
          <p className="font-display text-xl font-bold text-mist">
            Couldn’t load inventory
          </p>
          <p className="mt-2 text-sm text-signal" role="alert">
            {error}
          </p>
        </div>
      ) : null}

      {!loading && !error && vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles yet"
          description={
            filters
              ? 'No vehicles match the selected filters.'
              : 'Inventory will appear here once vehicles are added.'
          }
        />
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
