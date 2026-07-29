import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import type { VehicleCategory, VehiclePayload } from '@/types';

const categories: VehicleCategory[] = [
  'sedan',
  'suv',
  'truck',
  'coupe',
  'convertible',
  'hatchback',
  'van',
];

interface VehicleFormProps {
  initialValue?: VehiclePayload;
  submitLabel: string;
  loading: boolean;
  fieldErrors?: Record<string, string>;
  onSubmit: (payload: VehiclePayload) => void;
}

export const VehicleForm = ({
  initialValue,
  submitLabel,
  loading,
  fieldErrors = {},
  onSubmit,
}: VehicleFormProps) => {
  const [make, setMake] = useState(initialValue?.make ?? '');
  const [model, setModel] = useState(initialValue?.model ?? '');
  const [category, setCategory] = useState<VehicleCategory>(
    initialValue?.category ?? 'sedan'
  );
  const [price, setPrice] = useState(String(initialValue?.price ?? ''));
  const [quantity, setQuantity] = useState(
    String(initialValue?.quantity ?? '')
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      make: make.trim(),
      model: model.trim(),
      category,
      price: Number(price),
      quantity: Number(quantity),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate/45 p-5 sm:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Make"
          required
          value={make}
          onChange={(event) => setMake(event.target.value)}
          error={fieldErrors.make}
        />
        <FormField
          label="Model"
          required
          value={model}
          onChange={(event) => setModel(event.target.value)}
          error={fieldErrors.model}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist/90">Category</span>
          <select
            required
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as VehicleCategory)
            }
            className={`w-full rounded-2xl border bg-ink/60 px-4 py-3 text-mist outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/30 ${
              fieldErrors.category ? 'border-signal' : 'border-white/10'
            }`}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          {fieldErrors.category ? (
            <span className="block text-sm text-signal">
              {fieldErrors.category}
            </span>
          ) : null}
        </label>
        <FormField
          label="Price"
          type="number"
          required
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          error={fieldErrors.price}
        />
        <FormField
          label="Quantity"
          type="number"
          required
          min="0"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          error={fieldErrors.quantity}
        />
      </div>
      <Button type="submit" loading={loading} className="mt-7 sm:w-auto sm:min-w-44">
        {submitLabel}
      </Button>
    </form>
  );
};
