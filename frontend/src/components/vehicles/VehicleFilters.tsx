import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import {
  VEHICLE_CATEGORIES,
  formatCategoryLabel,
} from '@/constants/vehicles';
import type { VehicleCategory, VehicleSearchParams } from '@/types';

interface VehicleFiltersProps {
  loading: boolean;
  onSearch: (filters: VehicleSearchParams) => void;
  onClear: () => void;
}

export const VehicleFilters = ({
  loading,
  onSearch,
  onClear,
}: VehicleFiltersProps) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<VehicleCategory | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeError, setRangeError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const minimum = minPrice === '' ? undefined : Number(minPrice);
    const maximum = maxPrice === '' ? undefined : Number(maxPrice);

    if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
      setRangeError('Minimum price cannot exceed maximum price.');
      return;
    }

    setRangeError('');
    onSearch({
      make: make.trim() || undefined,
      model: model.trim() || undefined,
      category: category || undefined,
      minPrice: minimum,
      maxPrice: maximum,
    });
  };

  const handleClear = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setRangeError('');
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-3xl border border-white/10 bg-slate/45 p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FormField
          label="Make"
          name="make"
          value={make}
          onChange={(event) => setMake(event.target.value)}
          placeholder="Toyota"
        />
        <FormField
          label="Model"
          name="model"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          placeholder="Camry"
        />
        <SelectField
          label="Category"
          name="category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as VehicleCategory | '')
          }
        >
          <option value="">All categories</option>
          {VEHICLE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {formatCategoryLabel(item)}
            </option>
          ))}
        </SelectField>
        <FormField
          label="Minimum price"
          name="minPrice"
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="0"
        />
        <FormField
          label="Maximum price"
          name="maxPrice"
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="100000"
        />
      </div>
      {rangeError ? (
        <p role="alert" className="mt-3 text-sm text-signal">
          {rangeError}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-mist transition hover:border-amber hover:text-amber disabled:opacity-60"
        >
          Clear filters
        </button>
        <Button type="submit" loading={loading} className="sm:w-auto sm:min-w-36">
          Search
        </Button>
      </div>
    </form>
  );
};
