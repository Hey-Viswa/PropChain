export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-surface_container rounded-lg" />
          <div className="h-4 w-72 bg-surface_container rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-surface_container rounded-lg" />
      </div>
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 space-y-3">
            <div className="h-4 w-24 bg-surface_container rounded" />
            <div className="h-8 w-16 bg-surface_container rounded" />
          </div>
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface_container_lowest rounded-xl p-5 space-y-3">
            <div className="h-5 w-3/4 bg-surface_container rounded" />
            <div className="h-4 w-1/2 bg-surface_container rounded" />
            <div className="h-4 w-2/3 bg-surface_container rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}