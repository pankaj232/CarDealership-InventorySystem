import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { Alert } from '@/components/ui/Alert';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import { useMutation } from '@/hooks/useMutation';
import type { Vehicle, VehiclePayload } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export const VehicleEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const {
    loading: saving,
    error,
    fieldErrors,
    submit,
  } = useMutation(
    async (payload: VehiclePayload) => {
      await vehiclesApi.update(id, payload);
    },
    { fallbackMessage: 'Unable to update vehicle' }
  );

  useEffect(() => {
    let active = true;

    const loadVehicle = async () => {
      try {
        const data = await vehiclesApi.list();
        const match = data.find((item) => item.id === id);
        if (!active) return;
        if (!match) {
          setLoadError('Vehicle not found');
          return;
        }
        setVehicle(match);
      } catch (err) {
        if (active) {
          setLoadError(getErrorMessage(err, 'Unable to load vehicle'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (payload: VehiclePayload) => {
    const ok = await submit(payload);
    if (ok) {
      navigate('/admin/vehicles');
    }
  };

  const displayError = error || loadError;

  return (
    <AppShell title="Update vehicle">
      {displayError ? (
        <Alert className="mb-5 px-5 py-4">{displayError}</Alert>
      ) : null}
      {loading ? <p className="text-steel">Loading vehicle…</p> : null}
      {!loading && vehicle ? (
        <VehicleForm
          key={vehicle.id}
          initialValue={{
            make: vehicle.make,
            model: vehicle.model,
            category: vehicle.category,
            price: vehicle.price,
            quantity: vehicle.quantity,
          }}
          submitLabel="Save changes"
          loading={saving}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
        />
      ) : null}
    </AppShell>
  );
};
