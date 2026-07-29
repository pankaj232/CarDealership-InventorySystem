import { useEffect, useState } from 'react';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import type { Vehicle } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export const DashboardPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadVehicles = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await vehiclesApi.list();
        if (active) {
          setVehicles(data);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err, 'Unable to load vehicles'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadVehicles();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell title="Inventory">
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
            Inventory will appear here once vehicles are added.
          </p>
        </div>
      ) : null}

      {!loading && !error && vehicles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
};
