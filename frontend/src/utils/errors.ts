import axios from 'axios';
import type { ApiErrorBody } from '@/types';

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong'
): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const getFieldErrors = (
  error: unknown
): Record<string, string> => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return {};
  }

  const errors = error.response?.data?.errors ?? [];
  return errors.reduce<Record<string, string>>((acc, item) => {
    acc[item.field] = item.message;
    return acc;
  }, {});
};
