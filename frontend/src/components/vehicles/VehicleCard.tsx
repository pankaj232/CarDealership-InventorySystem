import type { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const inStock = vehicle.quantity > 0;

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:border-amber/40 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          {vehicle.category}
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-mist">
          {vehicle.make} {vehicle.model}
        </h2>
        <p className="mt-4 text-3xl font-semibold text-amber">
          {formatPrice(vehicle.price)}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
        <span className="text-steel">Available</span>
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            inStock
              ? 'bg-success/15 text-success'
              : 'bg-signal/15 text-signal'
          }`}
        >
          {inStock ? `${vehicle.quantity} in stock` : 'Out of stock'}
        </span>
      </div>
    </article>
  );
};
