import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  className?: string;
}

export const Alert = ({ children, className = '' }: AlertProps) => (
  <p
    role="alert"
    className={`rounded-2xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal ${className}`}
  >
    {children}
  </p>
);
