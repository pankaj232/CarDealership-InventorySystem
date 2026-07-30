export const VehicleCardSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Loading vehicles"
    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-52 animate-pulse rounded-3xl border border-white/10 bg-slate/40"
      />
    ))}
  </div>
);
