import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import type { VehiclePayload } from '@/types';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';

export const VehicleCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (payload: VehiclePayload) => {
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      await vehiclesApi.create(payload);
      navigate('/admin/vehicles');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create vehicle'));
      setFieldErrors(getFieldErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Create vehicle">
      {error ? (
        <p className="mb-5 rounded-2xl border border-signal/30 bg-signal/10 px-5 py-4 text-sm text-signal">
          {error}
        </p>
      ) : null}
      <VehicleForm
        submitLabel="Create vehicle"
        loading={loading}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};
