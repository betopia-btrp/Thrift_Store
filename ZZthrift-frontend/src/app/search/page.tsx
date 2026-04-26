"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, type Condition, type Category } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | "">(initialCategory as Category | "");
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const conditions: Condition[] = ["New", "Like New", "Good", "Fair"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
  ];

  const toggleCondition = (c: Condition) =>
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const results = useMemo(() => {
    let items = PRODUCTS.filter((p) => p.status === "Active");

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.seller.name.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) items = items.filter((p) => p.category === selectedCategory);
    if (selectedConditions.length) items = items.filter((p) => selectedConditions.includes(p.condition));
    if (priceMin) items = items.filter((p) => p.price >= parseFloat(priceMin));
    if (priceMax) items = items.filter((p) => p.price <= parseFloat(priceMax));

    switch (sortBy) {
      case "price_asc": return [...items].sort((a, b) => a.price - b.price);
      case "price_desc": return [...items].sort((a, b) => b.price - a.price);
      default: return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [query, selectedCategory, selectedConditions, priceMin, priceMax, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedConditions([]);
    setPriceMin("");
    setPriceMax("");
  };

  const hasActiveFilters = selectedCategory || selectedConditions.length > 0 || priceMin || priceMax;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-slate-300 text-sm mb-3">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat.name
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <span>
                {cat.icon} {cat.name}
              </span>
              <span className="text-xs text-slate-600">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="font-semibold text-slate-300 text-sm mb-3">Condition</h4>
        <div className="space-y-2">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedConditions.includes(c)}
                onChange={() => toggleCondition(c)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-semibold text-slate-300 text-sm mb-3">Price Range (USD)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="input-base text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn btn-danger w-full text-sm py-2">
          <X size={14} /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container py-8">
      {/* Search + controls */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 input-base">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search listings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-600 hover:text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-base pr-8 text-sm appearance-none cursor-pointer min-w-[160px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 glass border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
          >
            <List size={16} />
          </button>
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`btn btn-secondary text-sm lg:hidden flex items-center gap-2 ${hasActiveFilters ? "border-emerald-500/40 text-emerald-400" : ""}`}
        >
          <SlidersHorizontal size={16} />
          Filters {hasActiveFilters && `(${[selectedCategory, ...selectedConditions, priceMin && "Price"].filter(Boolean).length})`}
        </button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategory && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("")}><X size={12} /></button>
            </span>
          )}
          {selectedConditions.map((c) => (
            <span key={c} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
              {c}
              <button onClick={() => toggleCondition(c)}><X size={12} /></button>
            </span>
          ))}
          {(priceMin || priceMax) && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">
              ${priceMin || "0"} – ${priceMax || "∞"}
              <button onClick={() => { setPriceMin(""); setPriceMax(""); }}><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters (desktop) */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="glass rounded-xl border border-white/5 p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={16} className="text-emerald-400" />
              <span className="font-semibold text-slate-300 text-sm">Filters</span>
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-72 glass border-l border-white/10 p-6 overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-slate-200">Filters</span>
                <button onClick={() => setFiltersOpen(false)} className="text-slate-500 hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              <span className="text-slate-300 font-semibold">{results.length}</span> results found
              {query && <span> for &ldquo;<span className="text-emerald-400">{query}</span>&rdquo;</span>}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No listings found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="btn btn-primary mt-4">Clear Filters</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} view="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-slate-500">Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
