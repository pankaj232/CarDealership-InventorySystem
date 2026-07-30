import { Button } from '@/components/ui/Button';
import type { Vehicle } from '@/types';
import { formatCurrency } from '@/utils/format';

interface VehicleCardProps {
  vehicle: Vehicle;
  purchasing?: boolean;
  onPurchase: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({
  vehicle,
  purchasing = false,
  onPurchase,
}: VehicleCardProps) => {
  const inStock = vehicle.quantity > 0;

  return (
    <article
      className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:border-amber/40 sm:p-6"
      aria-labelledby={`vehicle-${vehicle.id}-title`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          {vehicle.category}
        </p>
        <h2
          id={`vehicle-${vehicle.id}-title`}
          className="mt-3 font-display text-2xl font-bold text-mist"
        >
          {vehicle.make} {vehicle.model}
        </h2>
        <p className="mt-4 text-3xl font-semibold text-amber">
          {formatCurrency(vehicle.price)}
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
      <Button
        type="button"
        className="mt-4"
        disabled={!inStock}
        loading={purchasing}
        onClick={() => onPurchase(vehicle)}
        aria-label={
          inStock
            ? `Purchase ${vehicle.make} ${vehicle.model}`
            : `${vehicle.make} ${vehicle.model} is out of stock`
        }
      >
        {inStock ? 'Purchase' : 'Out of stock'}
      </Button>
    </article>
  );
};
