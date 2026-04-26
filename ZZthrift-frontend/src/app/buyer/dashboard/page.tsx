"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package, Heart, Clock, Settings, ShoppingBag,
  Star, MapPin, ChevronRight, Eye, Trash2
} from "lucide-react";
import { ORDERS, WISHLIST_PRODUCTS, REVIEWS } from "@/lib/data";
import { formatDate, formatPrice, statusColor, renderStars } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";

type Tab = "orders" | "wishlist" | "reviews" | "settings";

export default function BuyerDashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const myOrders = ORDERS.filter((o) => o.buyer.id === user.id);
  const myReviews = REVIEWS.filter((r) => r.buyer.id === user.id);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "orders", label: "My Orders", icon: <Package size={16} />, count: myOrders.length },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={16} />, count: WISHLIST_PRODUCTS.length },
    { id: "reviews", label: "Reviews Given", icon: <Star size={16} />, count: myReviews.length },
    { id: "settings", label: "Account Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="glass rounded-2xl border border-white/10 p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-100">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={13} /> {user.location}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(user.rating).map((s, i) => (
                  <Star key={i} size={12} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                ))}
                <span className="text-xs text-slate-400 ml-1">{user.rating} rating</span>
              </div>
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-3">
            <Link href="/seller/dashboard">
              <button className="btn btn-secondary text-sm">Seller Dashboard</button>
            </Link>
            <Link href="/seller/create-listing">
              <button className="btn btn-primary text-sm">+ New Listing</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Orders", value: myOrders.length, icon: <ShoppingBag size={16} />, color: "text-emerald-400" },
          { label: "Wishlisted", value: WISHLIST_PRODUCTS.length, icon: <Heart size={16} />, color: "text-red-400" },
          { label: "Reviews Given", value: myReviews.length, icon: <Star size={16} />, color: "text-amber-400" },
          { label: "Active Orders", value: myOrders.filter(o => o.status !== "Completed").length, icon: <Clock size={16} />, color: "text-violet-400" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl border border-white/5 p-4">
            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-200">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass border border-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-emerald-500/20" : "bg-white/5"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Orders Tab ── */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-slate-400">No orders yet.</p>
              <Link href="/search"><button className="btn btn-primary mt-4">Browse Listings</button></Link>
            </div>
          ) : (
            myOrders.map((order) => (
              <Link key={order.id} href={`/order/${order.id}`} className="block">
                <div className="glass rounded-xl border border-white/5 p-4 hover:border-emerald-500/20 transition-colors flex items-center gap-4">
                  <img src={order.product.images[0]} alt={order.product.title} className="w-16 h-16 rounded-xl object-cover border border-white/5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 text-sm line-clamp-1">{order.product.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">From: {order.seller.name} · {formatDate(order.createdAt)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-emerald-400 text-xs font-semibold">{formatPrice(order.product.price)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 shrink-0" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* ── Wishlist Tab ── */}
      {activeTab === "wishlist" && (
        <div>
          {WISHLIST_PRODUCTS.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">❤️</div>
              <p className="text-slate-400">Your wishlist is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {WISHLIST_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} view="grid" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Reviews Tab ── */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {myReviews.map((review) => (
            <div key={review.id} className="glass rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={review.seller.avatar} alt={review.seller.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Review for {review.seller.name}</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating).map((s, i) => (
                      <Star key={i} size={12} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Settings Tab ── */}
      {activeTab === "settings" && (
        <div className="max-w-lg">
          <div className="glass rounded-xl border border-white/10 p-6">
            <h3 className="font-bold text-slate-200 mb-4">Account Information</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Location", value: user.location },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">{field.label}</label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="input-base text-sm"
                  />
                </div>
              ))}
              <button className="btn btn-primary w-full">Save Changes</button>
            </div>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6 mt-4">
            <h3 className="font-bold text-slate-200 mb-4">Change Password</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" className="input-base text-sm" />
              <input type="password" placeholder="New password" className="input-base text-sm" />
              <input type="password" placeholder="Confirm new password" className="input-base text-sm" />
              <button className="btn btn-secondary w-full">Update Password</button>
            </div>
          </div>

          <div className="glass rounded-xl border border-red-500/20 p-6 mt-4">
            <h3 className="font-bold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-500 mb-3">Deleting your account is irreversible. All your data will be anonymized within 30 days.</p>
            <button className="btn btn-danger w-full text-sm">
              <Trash2 size={14} /> Delete My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
