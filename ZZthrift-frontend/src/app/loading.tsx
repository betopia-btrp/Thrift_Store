export default function Loading() {
  return (
    <div className="container py-8">
      {/* Hero skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="skeleton h-6 w-48 mx-auto rounded-full mb-6" />
        <div className="skeleton h-12 w-full rounded-xl mb-3" />
        <div className="skeleton h-12 w-3/4 mx-auto rounded-xl mb-6" />
        <div className="skeleton h-5 w-2/3 mx-auto rounded-lg mb-8" />
        <div className="skeleton h-12 w-full max-w-xl mx-auto rounded-xl" />
      </div>

      {/* Category cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton rounded-2xl h-36" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="skeleton h-6 w-48 rounded-lg mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="skeleton aspect-square" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-5 w-1/3 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
