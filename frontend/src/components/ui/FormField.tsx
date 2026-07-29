import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      <span className="text-sm font-medium text-mist/90">{label}</span>
      <input
        id={fieldId}
        className={`w-full rounded-2xl border bg-ink/60 px-4 py-3 text-mist outline-none transition placeholder:text-steel/70 focus:border-amber focus:ring-2 focus:ring-amber/30 ${
          error ? 'border-signal' : 'border-white/10'
        }`}
        {...props}
      />
      {error ? <span className="block text-sm text-signal">{error}</span> : null}
    </label>
  );
}
