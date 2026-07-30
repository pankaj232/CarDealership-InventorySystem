import { describe, expect, it } from 'vitest';
import { validateLoginForm, validateRegisterForm } from '@/utils/validation';

describe('validateLoginForm', () => {
  it('should require email and password', () => {
    expect(validateLoginForm({ email: '', password: '' })).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
  });

  it('should reject an invalid email', () => {
    expect(
      validateLoginForm({ email: 'not-an-email', password: 'secret' })
    ).toEqual({
      email: 'Enter a valid email',
    });
  });

  it('should accept valid credentials', () => {
    expect(
      validateLoginForm({ email: 'user@example.com', password: 'secret' })
    ).toEqual({});
  });
});

describe('validateRegisterForm', () => {
  it('should require matching passwords of sufficient length', () => {
    expect(
      validateRegisterForm({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'short',
        confirmPassword: 'other',
      })
    ).toEqual({
      password: 'Password must be at least 8 characters',
      confirmPassword: 'Passwords do not match',
    });
  });

  it('should accept a valid registration payload', () => {
    expect(
      validateRegisterForm({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
    ).toEqual({});
  });
});
