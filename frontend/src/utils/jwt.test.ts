import { describe, expect, it } from 'vitest';
import { decodeToken } from '@/utils/jwt';

const encode = (payload: object): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
    'base64url'
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.sig`;
};

describe('decodeToken', () => {
  it('should return null for an empty token', () => {
    expect(decodeToken(null)).toBeNull();
    expect(decodeToken('')).toBeNull();
  });

  it('should decode a valid payload', () => {
    const token = encode({
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(decodeToken(token)).toEqual({
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
    });
  });

  it('should reject an expired token', () => {
    const token = encode({
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) - 10,
    });

    expect(decodeToken(token)).toBeNull();
  });

  it('should reject an invalid role', () => {
    const token = encode({
      id: '1',
      email: 'admin@example.com',
      role: 'superuser',
    });

    expect(decodeToken(token)).toBeNull();
  });
});
