"use client";
import { useState } from "react";
import {
  Users, Package, DollarSign, ShoppingBag, TrendingUp,
  Flag, Shield, Settings, BarChart3, Search, Ban, CheckCircle,
  Trash2, AlertTriangle, Eye, RefreshCw, Bell
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  ADMIN_STATS, USERS, PRODUCTS, FLAGGED_ITEMS, REVENUE_DATA
} from "@/lib/data";
import { formatPrice, formatDate, statusColor } from "@/lib/utils";
import Link from "next/link";

type AdminTab = "overview" | "users" | "listings" | "flagged" | "settings";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [listingSearch, setListingSearch] = useState("");

  const filteredUsers = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
    p.seller.name.toLowerCase().includes(listingSearch.toLowerCase())
  );

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={15} /> },
    { id: "users", label: "Users", icon: <Users size={15} /> },
    { id: "listings", label: "Listings", icon: <Package size={15} /> },
    { id: "flagged", label: "Flagged", icon: <Flag size={15} /> },
    { id: "settings", label: "Settings", icon: <Settings size={15} /> },
  ];

  const kpis = [
    { label: "Total Users", value: ADMIN_STATS.totalUsers.toLocaleString(), icon: <Users size={20} />, change: `+${ADMIN_STATS.newUsersThisMonth} this month`, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
    { label: "Active Listings", value: ADMIN_STATS.totalActiveListings.toLocaleString(), icon: <Package size={20} />, change: "+42 this week", color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400" },
    { label: "Total Revenue", value: formatPrice(ADMIN_STATS.totalRevenue), icon: <DollarSign size={20} />, change: `+${formatPrice(ADMIN_STATS.revenueThisMonth)} this month`, color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
    { label: "Total Orders", value: ADMIN_STATS.totalOrders.toLocaleString(), icon: <ShoppingBag size={20} />, change: "+89 this month", color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden lg:flex flex-col glass border-r border-white/5 min-h-screen sticky top-0 py-6 px-3">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-slate-200">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item w-full ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "flagged" && ADMIN_STATS.flaggedItems > 0 && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                  {ADMIN_STATS.flaggedItems}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-4 mt-4">
          <Link href="/">
            <button className="nav-item w-full text-slate-500">
              ← Back to Site
            </button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 p-6">
        {/* Mobile tab bar */}
        <div className="flex gap-1 mb-6 lg:hidden overflow-x-auto glass border border-white/5 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "bg-emerald-500/15 text-emerald-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
              <div className="flex items-center gap-2">
                {ADMIN_STATS.pendingReports > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <Bell size={13} />
                    {ADMIN_STATS.pendingReports} pending reports
                  </div>
                )}
                <button className="p-2 rounded-lg glass border border-white/5 text-slate-500 hover:text-slate-300">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className={`glass rounded-2xl border border-white/5 p-5 bg-gradient-to-br ${kpi.color}`}>
                  <div className={`${kpi.iconColor} mb-3`}>{kpi.icon}</div>
                  <div className="text-2xl font-bold text-slate-100">{kpi.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp size={11} /> {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-400" /> Monthly Revenue (Listing Fees)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#12121a", border: "1px solid #2a2a3a", borderRadius: 8 }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#10b981" }}
                    formatter={(v: number) => [`$${v}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Second-hand Clothes", count: 342, pct: 54 },
                { name: "Second-hand Books", count: 189, pct: 30 },
                { name: "Arts & Crafts", count: 103, pct: 16 },
              ].map((cat) => (
                <div key={cat.name} className="glass rounded-xl border border-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">{cat.name}</span>
                    <span className="text-sm font-bold text-slate-200">{cat.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cat.pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-600 mt-1 block">{cat.pct}% of total</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-100">User Management</h2>
              <span className="text-xs text-slate-500">{USERS.length} users</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 input-base">
                <Search size={15} className="text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600"
                />
              </div>
            </div>
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Joined</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/5" />
                          <div>
                            <p className="font-medium text-slate-300 text-sm">{user.name}</p>
                            <p className="text-xs text-slate-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">{user.location}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${user.isBlocked ? "badge-fair" : "badge-active"}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">{formatDate(user.joinedAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/seller/${user.id}`}>
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                              <Eye size={14} />
                            </button>
                          </Link>
                          <button className={`p-1.5 rounded-lg transition-colors ${user.isBlocked ? "text-emerald-500 hover:bg-emerald-500/10" : "text-red-400 hover:bg-red-500/10"}`}>
                            {user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
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

        {/* ── Listings ── */}
        {activeTab === "listings" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-100">All Listings</h2>
              <span className="text-xs text-slate-500">{PRODUCTS.length} total</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 input-base">
                <Search size={15} className="text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search listings or sellers..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600"
                />
              </div>
            </div>
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Listing</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Seller</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredListings.map((product) => (
                    <tr key={product.id} className="table-row">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                          <span className="font-medium text-slate-300 text-sm truncate max-w-[140px]">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <img src={product.seller.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs text-slate-400">{product.seller.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-400 text-sm">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/listing/${product.id}`}>
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                              <Eye size={14} />
                            </button>
                          </Link>
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

        {/* ── Flagged Content ── */}
        {activeTab === "flagged" && (
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-5">Flagged Content Queue</h2>
            <div className="space-y-4">
              {FLAGGED_ITEMS.map((item) => (
                <div key={item.id} className="glass rounded-xl border border-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === "listing" ? "bg-violet-500/15 text-violet-400" :
                        item.type === "review" ? "bg-amber-500/15 text-amber-400" :
                        "bg-red-500/15 text-red-400"
                      }`}>
                        {item.type === "listing" ? <Package size={16} /> :
                         item.type === "review" ? <AlertTriangle size={16} /> :
                         <Users size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.type}</span>
                          <span className="text-xs text-slate-600">· {formatDate(item.createdAt)}</span>
                        </div>
                        <p className="font-semibold text-slate-200 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Reported by: {item.reporter.name}</p>
                        <div className="mt-2 px-3 py-2 rounded-lg bg-white/5 text-xs text-slate-400 italic">
                          &ldquo;{item.reason}&rdquo;
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="btn btn-danger text-xs px-3 py-1.5">
                        <Trash2 size={12} /> Remove
                      </button>
                      <button className="btn btn-secondary text-xs px-3 py-1.5">
                        Dismiss
                      </button>
                      <button className="btn text-xs px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        Warn User
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-6">Platform Settings</h2>
            <div className="space-y-4 max-w-lg">
              <div className="glass rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
                  <DollarSign size={15} className="text-emerald-400" /> Listing Fee Configuration
                </h3>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Current Listing Fee (USD)</label>
                  <div className="flex gap-2">
                    <input type="number" defaultValue="4.99" step="0.01" min="0" className="input-base text-sm" />
                    <button className="btn btn-primary text-sm px-5">Update</button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Applied to all new listing creation flows within 5 minutes.</p>
                </div>
              </div>

              <div className="glass rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
                  <Package size={15} className="text-violet-400" /> Categories
                </h3>
                <div className="space-y-2 mb-3">
                  {["Second-hand Clothes", "Second-hand Books", "Arts & Crafts"].map((cat) => (
                    <div key={cat} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-sm text-slate-300">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full badge-active">Active</span>
                        <button className="text-xs text-slate-500 hover:text-red-400 transition-colors">Deactivate</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-secondary text-xs w-full">+ Add Category</button>
              </div>

              <div className="glass rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
                  <Bell size={15} className="text-amber-400" /> Notification Templates
                </h3>
                <p className="text-xs text-slate-500 mb-3">Manage in-app and email notification templates without code deployment.</p>
                <button className="btn btn-secondary text-sm w-full">Manage Templates</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
