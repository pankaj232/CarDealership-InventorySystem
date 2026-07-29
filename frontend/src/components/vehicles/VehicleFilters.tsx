import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import type { VehicleCategory, VehicleSearchParams } from '@/types';

const categories: VehicleCategory[] = [
  'sedan',
  'suv',
  'truck',
  'coupe',
  'convertible',
  'hatchback',
  'van',
];

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
  const [category, setCategory] = useState('');
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
      category: (category || undefined) as VehicleCategory | undefined,
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
          value={make}
          onChange={(event) => setMake(event.target.value)}
          placeholder="Toyota"
        />
        <FormField
          label="Model"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          placeholder="Camry"
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist/90">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-ink/60 px-4 py-3 text-mist outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/30"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <FormField
          label="Minimum price"
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="0"
        />
        <FormField
          label="Maximum price"
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="100000"
        />
      </div>
      {rangeError ? <p className="mt-3 text-sm text-signal">{rangeError}</p> : null}
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
