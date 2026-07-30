import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  children,
  className = '',
}: EmptyStateProps) => (
  <div
    className={`rounded-3xl border border-white/10 bg-slate/40 px-6 py-16 text-center ${className}`}
  >
    <p className="font-display text-2xl font-bold text-mist">{title}</p>
    {description ? <p className="mt-2 text-steel">{description}</p> : null}
    {children}
  </div>
);
