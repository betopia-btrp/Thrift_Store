"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Package, CheckCircle, Truck, Clock, MessageCircle,
  Shield, ChevronLeft, User, MapPin
} from "lucide-react";
import { ORDERS } from "@/lib/data";
import { formatDate, formatPrice, statusColor } from "@/lib/utils";
import { use } from "react";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  const statusIcons = {
    Pending: <Clock size={18} />,
    Confirmed: <CheckCircle size={18} />,
    Dispatched: <Truck size={18} />,
    Completed: <CheckCircle size={18} />,
    Cancelled: <Clock size={18} />,
  };

  const allStatuses = ["Pending", "Confirmed", "Dispatched", "Completed"] as const;
  const currentIdx = allStatuses.indexOf(order.status as typeof allStatuses[number]);

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Link href="/buyer/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Order #{order.id.toUpperCase()}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge text-sm px-3 py-1.5 rounded-full font-semibold ${statusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Status timeline */}
      <div className="glass rounded-2xl border border-white/10 p-6 mb-6">
        <h3 className="font-semibold text-slate-300 text-sm mb-5">Order Progress</h3>
        <div className="flex items-center justify-between">
          {allStatuses.map((s, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    active
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 animate-pulse-glow"
                      : done
                      ? "border-emerald-600 bg-emerald-600/20 text-emerald-500"
                      : "border-slate-700 text-slate-600"
                  }`}>
                    {statusIcons[s]}
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    done ? "text-emerald-400" : "text-slate-600"
                  }`}>{s}</span>
                </div>
                {i < allStatuses.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${i < currentIdx ? "bg-emerald-600" : "bg-slate-800"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Status history */}
        <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">Status History</p>
          {order.statusHistory.map((h, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="font-medium text-slate-300">{h.status}</span>
              <span className="text-slate-600">—</span>
              <span className="text-slate-500">{h.note}</span>
              <span className="ml-auto text-slate-600">{formatDate(h.changedAt)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product summary */}
        <div className="glass rounded-2xl border border-white/10 p-5">
          <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
            <Package size={15} className="text-emerald-400" /> Item
          </h3>
          <div className="flex gap-4">
            <img
              src={order.product.images[0]}
              alt={order.product.title}
              className="w-20 h-20 rounded-xl object-cover border border-white/5"
            />
            <div>
              <Link href={`/listing/${order.product.id}`} className="font-semibold text-slate-200 text-sm hover:text-emerald-400 transition-colors">
                {order.product.title}
              </Link>
              <p className="text-xs text-slate-500 mt-1">{order.product.category}</p>
              <p className="text-xl font-bold text-emerald-400 mt-2">{formatPrice(order.product.price)}</p>
            </div>
          </div>
          {order.buyerNote && (
            <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400 italic">
              Note: &ldquo;{order.buyerNote}&rdquo;
            </div>
          )}
        </div>

        {/* Parties + notice */}
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-white/10 p-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
              <User size={15} className="text-violet-400" /> Contact Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">Buyer</p>
                <div className="flex items-center gap-2">
                  <img src={order.buyer.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">{order.buyer.name}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-0.5"><MapPin size={10} />{order.buyer.location}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs text-slate-600 mb-1">Seller</p>
                <div className="flex items-center gap-2">
                  <img src={order.seller.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">{order.seller.name}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-0.5"><MapPin size={10} />{order.seller.location}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary w-full mt-3 text-xs py-2">
              <MessageCircle size={13} /> Contact {order.seller.id === "u1" ? "Buyer" : "Seller"}
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
            <Shield size={14} className="shrink-0 mt-0.5" />
            Delivery is arranged directly between buyer and seller. ThriftHub does not handle shipping or logistics.
          </div>
        </div>
      </div>

      {/* Actions */}
      {order.status === "Dispatched" && (
        <div className="mt-6 glass rounded-xl border border-emerald-500/20 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-200 text-sm">Have you received your item?</p>
            <p className="text-xs text-slate-500 mt-0.5">Confirming receipt will mark this order as Completed.</p>
          </div>
          <button className="btn btn-primary shrink-0 text-sm">
            <CheckCircle size={15} /> Mark as Received
          </button>
        </div>
      )}

      {order.status === "Completed" && (
        <div className="mt-6 glass rounded-xl border border-violet-500/20 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-200 text-sm">How was your experience?</p>
            <p className="text-xs text-slate-500 mt-0.5">Leave a review for {order.seller.name}.</p>
          </div>
          <button className="btn btn-accent shrink-0 text-sm">✍️ Write a Review</button>
        </div>
      )}
    </div>
  );
}
