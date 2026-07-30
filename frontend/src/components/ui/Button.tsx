import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex w-full items-center justify-center rounded-2xl bg-amber px-4 py-3 font-semibold text-ink transition hover:bg-amber-deep disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
};
