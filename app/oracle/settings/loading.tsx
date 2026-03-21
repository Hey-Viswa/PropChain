export default function OracleSettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-shimmer">
      <div className="mb-10">
        <div className="h-8 w-48 bg-surface_container dark:bg-[#1c2333]
                        rounded-lg mb-2" />
        <div className="h-4 w-72 bg-surface_container dark:bg-[#1c2333]
                        rounded" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i}
             className="bg-surface_container_lowest dark:bg-[#131820]
                        rounded-2xl overflow-hidden">
          <div className="h-1 bg-surface_container_high" />
          <div className="p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl
                              bg-surface_container dark:bg-[#1c2333]" />
              <div className="space-y-2">
                <div className="h-5 w-36 bg-surface_container dark:bg-[#1c2333]
                                rounded" />
                <div className="h-3 w-52 bg-surface_container dark:bg-[#1c2333]
                                rounded" />
              </div>
            </div>
            <div className="h-24 bg-surface_container dark:bg-[#1c2333]
                            rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
