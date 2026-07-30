import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage, getFieldErrors } from '@/utils/errors';
import { validateRegisterForm } from '@/utils/validation';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
      setFormError(getErrorMessage(error, 'Unable to create your account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to browse inventory and manage your dealership activity."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-amber hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full name"
          name="name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
        />
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
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              confirmPassword: event.target.value,
            }))
          }
        />
        {formError ? <Alert>{formError}</Alert> : null}
        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};
