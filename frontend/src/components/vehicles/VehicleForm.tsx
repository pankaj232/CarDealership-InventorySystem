import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import {
  VEHICLE_CATEGORIES,
  formatCategoryLabel,
} from '@/constants/vehicles';
import type { VehicleCategory, VehiclePayload } from '@/types';

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
          name="make"
          required
          value={make}
          onChange={(event) => setMake(event.target.value)}
          error={fieldErrors.make}
        />
        <FormField
          label="Model"
          name="model"
          required
          value={model}
          onChange={(event) => setModel(event.target.value)}
          error={fieldErrors.model}
        />
        <SelectField
          label="Category"
          name="category"
          required
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as VehicleCategory)
          }
          error={fieldErrors.category}
        >
          {VEHICLE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {formatCategoryLabel(item)}
            </option>
          ))}
        </SelectField>
        <FormField
          label="Price"
          name="price"
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
          name="quantity"
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
