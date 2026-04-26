"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Calendar, Package, MessageCircle, ShieldCheck } from "lucide-react";
import { USERS, PRODUCTS, REVIEWS } from "@/lib/data";
import { formatDate, renderStars, formatPrice, conditionColor } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { use } from "react";

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const seller = USERS.find((u) => u.id === id);
  if (!seller) { notFound(); return null; }

  const activeListings = PRODUCTS.filter((p) => p.seller.id === id && p.status === "Active");
  const sellerReviews = REVIEWS.filter((r) => r.seller.id === id);
  const stars = renderStars(seller.rating);

  return (
    <div className="container py-8">
      {/* Profile header */}
      <div className="glass rounded-2xl border border-white/10 p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10"
            />
            {!seller.isBlocked && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={12} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{seller.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {seller.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Joined {formatDate(seller.joinedAt)}</span>
                </div>
              </div>
              <button className="btn btn-secondary text-sm">
                <MessageCircle size={14} /> Contact Seller
              </button>
            </div>

            {/* Rating + stats */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {stars.map((s, i) => (
                    <Star key={i} size={16} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <span className="font-bold text-slate-200">{seller.rating}</span>
                <span className="text-slate-500 text-sm">({seller.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Package size={14} className="text-emerald-400" />
                <span>{seller.totalListings} listings</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <ShieldCheck size={14} className="text-violet-400" />
                <span>{seller.totalSales} completed sales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active listings */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-200 mb-4">
            Active Listings ({activeListings.length})
          </h2>
          {activeListings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {activeListings.map((product) => (
                <ProductCard key={product.id} product={product} view="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-xl border border-white/5">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-slate-500 text-sm">No active listings at the moment.</p>
            </div>
          )}
        </div>

        {/* Reviews sidebar */}
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">
            Reviews ({sellerReviews.length})
          </h2>
          {/* Rating breakdown */}
          <div className="glass rounded-xl border border-white/5 p-4 mb-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold text-slate-100">{seller.rating}</div>
              <div className="flex items-center justify-center gap-1 my-1">
                {stars.map((s, i) => (
                  <Star key={i} size={16} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                ))}
              </div>
              <p className="text-xs text-slate-500">{seller.reviewCount} total reviews</p>
            </div>
            {[5, 4, 3, 2, 1].map((n) => {
              const count = sellerReviews.filter((r) => Math.round(r.rating) === n).length;
              const pct = sellerReviews.length ? (count / sellerReviews.length) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500 w-3">{n}</span>
                  <Star size={11} fill="currentColor" className="star-filled shrink-0" />
                  <div className="progress-bar flex-1">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {sellerReviews.map((review) => (
              <div key={review.id} className="glass rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={review.buyer.avatar} alt={review.buyer.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{review.buyer.name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating).map((s, i) => (
                        <Star key={i} size={10} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-slate-600">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
