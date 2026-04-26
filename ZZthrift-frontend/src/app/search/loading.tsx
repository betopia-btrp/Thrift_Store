export default function SearchLoading() {
  return (
    <div className="container py-8">
      {/* Search bar skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="skeleton flex-1 h-11 rounded-xl" />
        <div className="skeleton w-44 h-11 rounded-xl" />
        <div className="skeleton w-20 h-11 rounded-xl" />
      </div>

      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="glass rounded-xl border border-white/5 p-5 space-y-4">
            <div className="skeleton h-4 w-20 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-9 w-full rounded-lg" />
            ))}
            <div className="skeleton h-4 w-24 rounded mt-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="skeleton w-4 h-4 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </aside>

        {/* Results skeleton */}
        <div className="flex-1">
          <div className="skeleton h-4 w-32 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2.5">
                  <div className="skeleton h-3.5 w-full rounded" />
                  <div className="skeleton h-3.5 w-3/4 rounded" />
                  <div className="flex justify-between items-center mt-1">
                    <div className="skeleton h-5 w-16 rounded" />
                    <div className="skeleton h-3 w-10 rounded" />
                  </div>
                  <div className="skeleton h-8 w-full rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
