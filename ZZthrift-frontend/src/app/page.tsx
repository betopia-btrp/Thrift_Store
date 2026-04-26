"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, Shield, Leaf, TrendingUp, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const featuredProducts = PRODUCTS.filter((p) => p.status === "Active").slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { label: "Active Listings", value: "634+", icon: <TrendingUp size={18} /> },
    { label: "Happy Users", value: "1,842", icon: <Star size={18} /> },
    { label: "Categories", value: "3", icon: <Sparkles size={18} /> },
    { label: "Verified Sellers", value: "420+", icon: <Shield size={18} /> },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container py-20 lg:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-emerald-400 mb-6 animate-fade-in-up">
              <Leaf size={14} />
              <span>Sustainable Shopping for Everyone</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Find Hidden Gems,{" "}
              <span className="gradient-text">Sell Your Treasures</span>
            </h1>

            <p className="text-slate-400 text-lg mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              The sustainable marketplace connecting buyers and sellers of second-hand clothes,
              used books, and handmade artisan goods.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex gap-2 max-w-xl mx-auto">
                <div className="flex-1 flex items-center gap-3 glass border border-white/10 rounded-xl px-4 focus-within:border-emerald-500/50 transition-colors">
                  <Search size={18} className="text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent py-3 text-slate-200 placeholder-slate-500 outline-none text-sm"
                  />
                </div>
                <button type="submit" className="btn btn-primary px-6">
                  Search
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <span className="text-xs text-slate-600">Popular:</span>
              {["Vintage Jeans", "Levi's", "Self-help Books", "Macramé", "Nike"].map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors border border-white/5"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-200">Browse by Category</h2>
              <p className="text-slate-500 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.name} href={`/search?category=${encodeURIComponent(cat.name)}`}>
                <div
                  className={`glass rounded-2xl border border-white/5 p-6 card-hover cursor-pointer bg-gradient-to-br ${cat.color} animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-5xl mb-4">{cat.icon}</div>
                  <h3 className="font-bold text-slate-200 text-lg mb-1">{cat.name}</h3>
                  <p className="text-slate-500 text-sm">{cat.count} listings available</p>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm mt-3 font-medium">
                    <span>Browse all</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="section bg-white/[0.01] border-y border-white/5">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-200">Featured Listings</h2>
              <p className="text-slate-500 text-sm mt-1">Fresh picks from our community</p>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} view="grid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION ── */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20 mb-4">
                <Sparkles size={12} />
                Why ThriftHub?
              </div>
              <h2 className="text-3xl font-bold text-slate-200 mb-6">
                Sustainable Shopping,{" "}
                <span className="gradient-text">Made Simple</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "🌱", title: "Eco-Friendly", desc: "Every purchase extends an item's lifecycle, reducing waste and carbon footprint." },
                  { icon: "💰", title: "Save Money", desc: "Get great items at a fraction of the retail price. Great for buyers and sellers alike." },
                  { icon: "🔐", title: "Safe & Secure", desc: "Verified sellers, transparent ratings, and a moderated platform you can trust." },
                  { icon: "⚡", title: "Quick & Easy", desc: "List an item in minutes. Our streamlined flow gets your product live fast." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="glass rounded-2xl border border-white/10 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 pointer-events-none" />
              <div className="relative">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold text-slate-200 mb-2">Start Selling Today</h3>
                <p className="text-slate-500 text-sm mb-6">
                  List your first item for just $4.99. Reach thousands of buyers looking for exactly what you have.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/seller/create-listing">
                    <button className="btn btn-primary w-full sm:w-auto animate-pulse-glow">
                      Create a Listing
                    </button>
                  </Link>
                  <Link href="/search">
                    <button className="btn btn-secondary w-full sm:w-auto">
                      Start Browsing
                    </button>
                  </Link>
                </div>
                <p className="text-xs text-slate-600 mt-4">
                  ✓ No subscription · ✓ Pay per listing · ✓ Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT LISTINGS by Category ── */}
      {CATEGORIES.map((cat) => {
        const items = PRODUCTS.filter((p) => p.category === cat.name && p.status === "Active").slice(0, 4);
        if (items.length === 0) return null;
        return (
          <section key={cat.name} className="section border-t border-white/5">
            <div className="container">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">{cat.name}</h2>
                    <p className="text-slate-500 text-xs">{cat.count} listings</p>
                  </div>
                </div>
                <Link
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                >
                  See all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} view="grid" />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
