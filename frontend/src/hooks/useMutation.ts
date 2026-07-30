import { useState } from 'react';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';

interface UseMutationOptions {
  fallbackMessage?: string;
}

export const useMutation = <TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<unknown>,
  options: UseMutationOptions = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (...args: TArgs): Promise<boolean> => {
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      await action(...args);
      return true;
    } catch (err) {
      setError(
        getErrorMessage(err, options.fallbackMessage ?? 'Something went wrong')
      );
      setFieldErrors(getFieldErrors(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fieldErrors,
    submit,
    setError,
  };
};
