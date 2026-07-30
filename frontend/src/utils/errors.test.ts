import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';

describe('getErrorMessage', () => {
  it('should read an axios error message', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as never,
        data: { message: 'Validation failed' },
      }
    );

    expect(getErrorMessage(error)).toBe('Validation failed');
  });

  it('should fall back for unknown errors', () => {
    expect(getErrorMessage({}, 'fallback')).toBe('fallback');
  });
});

describe('getFieldErrors', () => {
  it('should map field errors from an axios response', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as never,
        data: {
          message: 'Validation failed',
          errors: [{ field: 'email', message: 'Email is required' }],
        },
      }
    );

    expect(getFieldErrors(error)).toEqual({
      email: 'Email is required',
    });
  });
});
