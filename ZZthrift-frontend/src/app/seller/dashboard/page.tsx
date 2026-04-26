"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Package, Receipt, BarChart3, Eye, Edit, Trash2,
  ChevronRight, TrendingUp, DollarSign, Clock, CheckCircle
} from "lucide-react";
import { PRODUCTS, ORDERS, PAYMENTS } from "@/lib/data";
import { formatDate, formatPrice, statusColor, conditionColor } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type Tab = "listings" | "orders" | "payments" | "analytics";

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("listings");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const myListings = PRODUCTS.filter((p) => p.seller.id === user.id);
  const myOrders = ORDERS.filter((o) => o.seller.id === user.id);
  const myPayments = PAYMENTS;

  const activeListings = myListings.filter((p) => p.status === "Active");
  const draftListings = myListings.filter((p) => p.status === "Draft");
  const totalRevenue = myPayments.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "listings", label: "My Listings", icon: <Package size={15} /> },
    { id: "orders", label: "Incoming Orders", icon: <Clock size={15} /> },
    { id: "payments", label: "Payments", icon: <Receipt size={15} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={15} /> },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your listings, orders, and earnings.</p>
        </div>
        <Link href="/seller/create-listing">
          <button className="btn btn-primary">
            <Plus size={16} /> New Listing
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Listings", value: activeListings.length, icon: <Package size={18} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Pending Orders", value: myOrders.filter((o) => o.status === "Pending").length, icon: <Clock size={18} />, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Total Fees Paid", value: formatPrice(totalRevenue), icon: <DollarSign size={18} />, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Completed Sales", value: myOrders.filter((o) => o.status === "Completed").length, icon: <CheckCircle size={18} />, color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl border border-white/5 p-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-xl font-bold text-slate-200">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
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
          </button>
        ))}
      </div>

      {/* ── Listings Tab ── */}
      {activeTab === "listings" && (
        <div>
          {draftListings.length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
              <Clock size={16} className="text-amber-400 shrink-0" />
              <p className="text-sm text-amber-400">
                You have <strong>{draftListings.length}</strong> draft listing(s) pending payment.
              </p>
              <Link href="/seller/create-listing" className="ml-auto shrink-0">
                <button className="btn text-xs px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  Complete Now
                </button>
              </Link>
            </div>
          )}

          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Views</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myListings.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                        <span className="font-medium text-slate-300 line-clamp-1 text-sm max-w-[140px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-500">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Eye size={12} /> {product.views}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/listing/${product.id}`}>
                          <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                            <Eye size={14} />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <Edit size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Orders Tab ── */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📬</div>
              <p className="text-slate-400">No orders yet. Keep your listings active!</p>
            </div>
          ) : (
            myOrders.map((order) => (
              <Link key={order.id} href={`/order/${order.id}`} className="block">
                <div className="glass rounded-xl border border-white/5 p-4 hover:border-emerald-500/20 transition-colors flex items-center gap-4">
                  <img src={order.product.images[0]} alt={order.product.title} className="w-14 h-14 rounded-xl object-cover border border-white/5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 text-sm line-clamp-1">{order.product.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Buyer: {order.buyer.name} · {formatDate(order.createdAt)}</p>
                    {order.buyerNote && (
                      <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{order.buyerNote}&rdquo;</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 shrink-0" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* ── Payments Tab ── */}
      {activeTab === "payments" && (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-slate-300 text-sm">Listing Fee Receipts</h3>
            <span className="text-xs text-slate-500">{myPayments.length} transactions</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Listing</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Ref</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {myPayments.map((payment) => (
                <tr key={payment.id} className="table-row">
                  <td className="px-5 py-3 font-medium text-slate-300 text-sm">{payment.productTitle}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600 font-mono">{payment.transactionRef}</td>
                  <td className="px-4 py-3 font-semibold text-slate-200">{formatPrice(payment.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${
                      payment.status === "success" ? "badge-active" :
                      payment.status === "failed" ? "badge-fair" :
                      payment.status === "refunded" ? "badge-like-new" : "badge-pending"
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">{formatDate(payment.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Analytics Tab ── */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-emerald-400" /> Listing Performance
            </h3>
            <div className="space-y-3">
              {myListings.filter((p) => p.status === "Active").map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 truncate">{product.title}</p>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: `${Math.min((product.views / 500) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Eye size={11} />
                    {product.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-4">Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total Views", value: myListings.reduce((s, p) => s + p.views, 0) },
                { label: "Total Wishlists", value: myListings.reduce((s, p) => s + p.wishlistCount, 0) },
                { label: "Active Listings", value: activeListings.length },
                { label: "Draft Listings", value: draftListings.length },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="font-bold text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
