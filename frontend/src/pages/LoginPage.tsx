import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';
import { validateLoginForm } from '@/utils/validation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      navigate(from, { replace: true });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
      setFormError(getErrorMessage(error, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view live inventory and continue where you left off."
      footer={
        <>
          New here?{' '}
          <Link
            to="/register"
            className="font-semibold text-amber hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />
        {formError ? <Alert>{formError}</Alert> : null}
        <Button type="submit" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
};
