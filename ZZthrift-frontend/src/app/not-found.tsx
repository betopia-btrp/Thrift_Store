"use client";
import Link from "next/link";
import { Store, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center relative max-w-lg mx-auto animate-fade-in-up">
        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="text-[9rem] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(139,92,246,0.15))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
              <Store size={36} className="text-slate-400" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-200 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The listing, profile, or page you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Link href="/">
            <button className="btn btn-primary">
              <Home size={15} /> Go Home
            </button>
          </Link>
          <Link href="/search">
            <button className="btn btn-secondary">
              <Search size={15} /> Browse Listings
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>

        {/* Popular categories */}
        <div className="glass rounded-2xl border border-white/5 p-5 text-left">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-3">Popular Categories</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: "👗", label: "Clothes", href: "/search?category=Second-hand Clothes" },
              { emoji: "📚", label: "Books", href: "/search?category=Second-hand Books" },
              { emoji: "🎨", label: "Arts & Crafts", href: "/search?category=Arts & Crafts" },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href}>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs text-slate-400">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
