import type { AuthUser, TokenPayload } from '@/types';

export const decodeToken = (token: string | null): AuthUser | null => {
  if (!token) return null;

  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;

    const padded = encodedPayload
      .padEnd(encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4), '=')
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const json = decodeURIComponent(
      Array.from(atob(padded), (char) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`
      ).join('')
    );

    const payload = JSON.parse(json) as TokenPayload;

    if (
      !payload.id ||
      !payload.email ||
      !['user', 'admin'].includes(payload.role) ||
      (payload.exp && payload.exp * 1000 <= Date.now())
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};
