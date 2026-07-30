import type { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const SelectField = ({
  label,
  error,
  id,
  children,
  className = '',
  ...props
}: SelectFieldProps) => {
  const fieldId = id ?? props.name;
  const errorId = fieldId ? `${fieldId}-error` : undefined;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      <span className="text-sm font-medium text-mist/90">{label}</span>
      <select
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border bg-ink/60 px-4 py-3 text-mist outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/30 ${
          error ? 'border-signal' : 'border-white/10'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span id={errorId} className="block text-sm text-signal">
          {error}
        </span>
      ) : null}
    </label>
  );
};
