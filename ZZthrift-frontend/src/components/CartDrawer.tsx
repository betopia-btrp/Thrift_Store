"use client";
import { X, ShoppingCart, Trash2, ArrowRight, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, count, totalValue, removeFromCart, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 glass border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-emerald-400" />
            <span className="font-bold text-slate-200">Your Cart</span>
            {count > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-16">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-slate-600" />
              </div>
              <h3 className="text-slate-300 font-semibold mb-1">Your cart is empty</h3>
              <p className="text-slate-500 text-sm mb-5">Find something you love and add it here!</p>
              <Link href="/search" onClick={onClose}>
                <button className="btn btn-primary text-sm">Browse Listings</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <Link href={`/listing/${item.product.id}`} onClick={onClose} className="shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-white/5"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/listing/${item.product.id}`} onClick={onClose}>
                      <p className="text-sm font-semibold text-slate-200 line-clamp-2 hover:text-emerald-400 transition-colors">
                        {item.product.title}
                      </p>
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.product.condition} · {item.product.seller.name}</p>
                    <p className="text-emerald-400 font-bold text-sm mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 self-start"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="border-t border-white/5 px-5 py-4 space-y-3">
            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items ({count})</span>
                <span className="text-slate-300">{formatPrice(totalValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Platform fee</span>
                <span className="text-emerald-400 text-xs">Free for buyers</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-bold">
                <span className="text-slate-200">Total</span>
                <span className="text-emerald-400 text-lg">{formatPrice(totalValue)}</span>
              </div>
            </div>

            {/* Notice */}
            <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2 flex items-start gap-2">
              <Package size={13} className="shrink-0 mt-0.5" />
              Delivery is arranged directly between buyer and seller.
            </div>

            {/* Actions */}
            <Link href="/cart" onClick={onClose}>
              <button className="btn btn-primary w-full">
                View Cart & Order <ArrowRight size={16} />
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="btn btn-danger w-full text-xs py-2"
            >
              <Trash2 size={13} /> Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
