import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { Alert } from '@/components/ui/Alert';
import { useVehicles } from '@/hooks/useVehicles';
import type { Vehicle } from '@/types';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

export const VehicleManagementPage = () => {
  const { vehicles, loading, error, refresh, setError } = useVehicles();
  const [busyId, setBusyId] = useState('');
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>(
    {}
  );

  const handleDelete = async (vehicle: Vehicle) => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    setBusyId(vehicle.id);
    setError('');
    try {
      await vehiclesApi.delete(vehicle.id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete vehicle'));
    } finally {
      setBusyId('');
    }
  };

  const handleRestock = async (vehicle: Vehicle) => {
    const amount = Number(restockAmounts[vehicle.id]);
    if (!Number.isInteger(amount) || amount <= 0) {
      setError('Restock amount must be a positive whole number.');
      return;
    }

    setBusyId(vehicle.id);
    setError('');
    try {
      await vehiclesApi.restock(vehicle.id, amount);
      setRestockAmounts((current) => ({ ...current, [vehicle.id]: '' }));
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to restock vehicle'));
    } finally {
      setBusyId('');
    }
  };

  return (
    <AppShell title="Manage inventory">
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/vehicles/new"
          className="rounded-2xl bg-amber px-5 py-3 font-semibold text-ink transition hover:bg-amber-deep"
        >
          Create vehicle
        </Link>
      </div>

      {error ? <Alert className="mb-5 px-5 py-4">{error}</Alert> : null}

      {loading ? <p className="text-steel">Loading inventory…</p> : null}
      {!loading && vehicles.length === 0 ? (
        <p className="rounded-3xl border border-white/10 bg-slate/40 px-6 py-12 text-center text-steel">
          No vehicles in inventory.
        </p>
      ) : null}

      {!loading && vehicles.length > 0 ? (
        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const busy = busyId === vehicle.id;
            return (
              <article
                key={vehicle.id}
                className="rounded-3xl border border-white/10 bg-slate/55 p-5 sm:p-6"
                aria-labelledby={`admin-vehicle-${vehicle.id}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                      {vehicle.category}
                    </p>
                    <h2
                      id={`admin-vehicle-${vehicle.id}`}
                      className="mt-2 font-display text-xl font-bold text-mist"
                    >
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="mt-1 text-sm text-steel">
                      {formatCurrency(vehicle.price)} · {vehicle.quantity} in
                      stock
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex gap-2">
                      <input
                        aria-label={`Restock amount for ${vehicle.make} ${vehicle.model}`}
                        type="number"
                        min="1"
                        step="1"
                        value={restockAmounts[vehicle.id] ?? ''}
                        onChange={(event) =>
                          setRestockAmounts((current) => ({
                            ...current,
                            [vehicle.id]: event.target.value,
                          }))
                        }
                        placeholder="Amount"
                        className="w-28 rounded-xl border border-white/10 bg-ink/60 px-3 py-2 text-mist outline-none focus:border-amber"
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleRestock(vehicle)}
                        aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
                        className="rounded-xl border border-amber/50 px-4 py-2 font-semibold text-amber transition hover:bg-amber/10 disabled:opacity-60"
                      >
                        Restock
                      </button>
                    </div>
                    <Link
                      to={`/admin/vehicles/${vehicle.id}/edit`}
                      aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                      className="rounded-xl border border-white/15 px-4 py-2 text-center font-semibold text-mist transition hover:border-amber hover:text-amber"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDelete(vehicle)}
                      aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                      className="rounded-xl border border-signal/40 px-4 py-2 font-semibold text-signal transition hover:bg-signal/10 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </AppShell>
  );
};
