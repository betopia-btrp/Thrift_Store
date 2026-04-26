export default function ListingLoading() {
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="skeleton h-3 w-16 rounded" />
            {i < 4 && <div className="text-slate-700">/</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image gallery skeleton */}
        <div>
          <div className="skeleton aspect-square rounded-2xl mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-28 rounded-full" />
          </div>
          <div className="skeleton h-8 w-full rounded-xl" />
          <div className="skeleton h-8 w-2/3 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
          <div className="flex gap-4 pb-4 border-b border-white/5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-20 rounded" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
          {/* Seller card skeleton */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <div className="skeleton h-3 w-16 rounded mb-3" />
            <div className="flex items-center gap-3">
              <div className="skeleton w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
              <div className="skeleton h-8 w-28 rounded-lg" />
            </div>
          </div>
          <div className="skeleton h-11 w-full rounded-xl" />
          <div className="flex gap-3">
            <div className="skeleton h-11 flex-1 rounded-xl" />
            <div className="skeleton h-11 flex-1 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Related listings skeleton */}
      <div className="skeleton h-6 w-40 rounded-lg mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="skeleton aspect-square" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-3.5 w-full rounded" />
              <div className="skeleton h-5 w-20 rounded mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
