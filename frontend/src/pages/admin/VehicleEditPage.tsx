import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import type { Vehicle, VehiclePayload } from '@/types';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';

export const VehicleEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const { data } = await vehiclesApi.list();
        const match = data.find((item) => item.id === id);
        if (!match) {
          setError('Vehicle not found');
          return;
        }
        setVehicle(match);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load vehicle'));
      } finally {
        setLoading(false);
      }
    };
    void loadVehicle();
  }, [id]);

  const handleSubmit = async (payload: VehiclePayload) => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      await vehiclesApi.update(id, payload);
      navigate('/admin/vehicles');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update vehicle'));
      setFieldErrors(getFieldErrors(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Update vehicle">
      {error ? (
        <p className="mb-5 rounded-2xl border border-signal/30 bg-signal/10 px-5 py-4 text-sm text-signal">
          {error}
        </p>
      ) : null}
      {loading ? <p className="text-steel">Loading vehicle…</p> : null}
      {!loading && vehicle ? (
        <VehicleForm
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
