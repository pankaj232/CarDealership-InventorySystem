import { useNavigate } from 'react-router-dom';
import { vehiclesApi } from '@/api/vehicles';
import { AppShell } from '@/components/layout/AppShell';
import { Alert } from '@/components/ui/Alert';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import { useMutation } from '@/hooks/useMutation';
import type { VehiclePayload } from '@/types';

export const VehicleCreatePage = () => {
  const navigate = useNavigate();
  const { loading, error, fieldErrors, submit } = useMutation(
    async (payload: VehiclePayload) => {
      await vehiclesApi.create(payload);
    },
    { fallbackMessage: 'Unable to create vehicle' }
  );

  const handleSubmit = async (payload: VehiclePayload) => {
    const ok = await submit(payload);
    if (ok) {
      navigate('/admin/vehicles');
    }
  };

  return (
    <AppShell title="Create vehicle">
      {error ? <Alert className="mb-5 px-5 py-4">{error}</Alert> : null}
      <VehicleForm
        submitLabel="Create vehicle"
        loading={loading}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};
