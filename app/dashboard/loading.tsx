export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-stone/10
                          rounded-xl" />
          <div className="h-4 w-72 bg-stone/10
                          rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-stone/10
                        rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4
                      gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}
               className="bg-card
                           rounded-xl p-5 space-y-3">
            <div className="h-4 w-20 bg-stone/10
                            rounded" />
            <div className="h-8 w-16 bg-stone/10
                            rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2
                      xl:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}
               className="bg-card
                           rounded-xl p-5 space-y-3">
            <div className="h-5 w-3/4 bg-stone/10
                            rounded" />
            <div className="h-4 w-1/2 bg-stone/10
                            rounded" />
            <div className="h-4 w-2/3 bg-stone/10
                            rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}