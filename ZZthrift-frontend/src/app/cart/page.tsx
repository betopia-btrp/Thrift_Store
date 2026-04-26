"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart, Trash2, Package, ArrowRight, ShoppingBag,
  Star, CheckCircle, Shield, MapPin
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, conditionColor, renderStars } from "@/lib/utils";

export default function CartPage() {
  const { items, count, totalValue, removeFromCart, clearCart } = useCart();
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  const handlePlaceOrder = (productId: string) => {
    setOrderedItems((prev) => [...prev, productId]);
    setTimeout(() => removeFromCart(productId), 1500);
  };

  const handleOrderAll = () => {
    const ids = items.map((i) => i.product.id);
    setOrderedItems(ids);
    setTimeout(() => clearCart(), 1500);
  };

  if (count === 0 && orderedItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-200 mb-2">Your cart is empty</h1>
          <p className="text-slate-500 text-sm mb-6">
            Browse our marketplace and add items you love to your cart.
          </p>
          <Link href="/search">
            <button className="btn btn-primary">
              Browse Listings <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderedItems.length > 0 && count === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-200 mb-2">Orders Placed! 🎉</h1>
          <p className="text-slate-500 text-sm mb-6">
            Your orders have been sent to the sellers. Check your dashboard for updates.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/buyer/dashboard">
              <button className="btn btn-primary">View Orders</button>
            </Link>
            <Link href="/search">
              <button className="btn btn-secondary">Keep Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <ShoppingCart size={24} className="text-emerald-400" />
            Your Cart
            <span className="text-sm px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
              {count} item{count !== 1 ? "s" : ""}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review your items and place orders with sellers.</p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-danger text-xs py-2 px-3 hidden sm:flex"
        >
          <Trash2 size={13} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const ordered = orderedItems.includes(item.product.id);
            return (
              <div
                key={item.product.id}
                className={`glass rounded-2xl border transition-all ${
                  ordered ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5"
                } overflow-hidden`}
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <Link href={`/listing/${item.product.id}`} className="shrink-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                      {ordered && (
                        <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                          <CheckCircle size={28} className="text-white" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listing/${item.product.id}`}>
                          <h3 className="font-semibold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-2">
                            {item.product.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor(item.product.condition)}`}>
                            {item.product.condition}
                          </span>
                          <span className="text-xs text-slate-500">{item.product.category}</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-emerald-400 shrink-0">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Seller info */}
                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={item.product.seller.avatar}
                        alt={item.product.seller.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <Link href={`/seller/${item.product.seller.id}`}>
                        <span className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                          {item.product.seller.name}
                        </span>
                      </Link>
                      <div className="flex items-center gap-0.5 ml-1">
                        {renderStars(item.product.seller.rating).map((s, i) => (
                          <Star
                            key={i}
                            size={10}
                            fill={s.filled ? "currentColor" : "none"}
                            className={s.filled ? "star-filled" : "star-empty"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-600 flex items-center gap-0.5 ml-auto">
                        <MapPin size={10} /> {item.product.location}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {ordered ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                          <CheckCircle size={16} /> Order Placed!
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePlaceOrder(item.product.id)}
                            className="btn btn-primary text-xs py-2 px-4"
                          >
                            <ShoppingBag size={13} /> Place Order
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="btn btn-danger text-xs py-2 px-3"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-white/10 p-5 sticky top-20">
            <h3 className="font-bold text-slate-200 mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 truncate max-w-[160px]">{item.product.title}</span>
                  <span className="text-slate-300 font-medium shrink-0 ml-2">{formatPrice(item.product.price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal ({count} items)</span>
                <span className="text-slate-300">{formatPrice(totalValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Buyer fees</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-bold text-slate-200">Total</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatPrice(totalValue)}</span>
              </div>
            </div>

            <button
              onClick={handleOrderAll}
              className="btn btn-primary w-full mt-5 animate-pulse-glow"
            >
              <ShoppingBag size={16} /> Order All Items
            </button>

            <Link href="/search">
              <button className="btn btn-secondary w-full mt-2 text-sm">
                Continue Shopping
              </button>
            </Link>

            {/* Trust badge */}
            <div className="mt-4 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
              <Shield size={14} className="shrink-0 mt-0.5" />
              <span>
                Delivery is arranged directly between buyer and seller.
                ThriftHub does not process buyer payments in V1.
              </span>
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
              <Package size={14} className="shrink-0 mt-0.5" />
              <span>Each seller is notified separately when you place an order.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
