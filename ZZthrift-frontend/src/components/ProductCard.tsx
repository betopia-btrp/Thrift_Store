"use client";
import Link from "next/link";
import { Heart, Star, Eye, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { formatPrice, conditionColor } from "@/lib/utils";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  if (view === "list") {
    return (
      <Link href={`/listing/${product.id}`} className="block">
        <div className="glass rounded-xl border border-white/5 card-hover overflow-hidden flex gap-4 p-4">
          <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-slate-800">
            {!imgError ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
            )}
            {product.status === "Sold" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-xs">SOLD</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-200 text-sm line-clamp-1">{product.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
              </div>
              <span className="text-lg font-bold text-emerald-400 shrink-0">{formatPrice(product.price)}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor(product.condition)}`}>
                {product.condition}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star size={11} className="star-filled" fill="currentColor" />
                <span>{product.seller.rating}</span>
                <span className="text-slate-600">· {product.seller.name}</span>
              </div>
              <span className="text-xs text-slate-600">{product.location}</span>
              {product.status === "Active" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    inCart ? removeFromCart(product.id) : addToCart(product);
                  }}
                  className={`ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    inCart
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 text-slate-500 hover:border-emerald-500/40 hover:text-emerald-400"
                  }`}
                >
                  <ShoppingCart size={12} />
                  {inCart ? "In Cart" : "Add"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="glass rounded-xl border border-white/5 card-hover overflow-hidden group">
      <Link href={`/listing/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-800/50">
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
          )}
          {/* Overlays */}
          {product.status === "Sold" && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-violet-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">SOLD</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`badge text-xs px-2.5 py-1 rounded-full font-medium ${conditionColor(product.condition)}`}>
              {product.condition}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Eye size={11} className="text-slate-400" />
            <span className="text-xs text-slate-400">{product.views}</span>
          </div>
          {/* In-cart indicator */}
          {inCart && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <ShoppingCart size={9} /> In Cart
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/listing/${product.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-200 text-sm line-clamp-2 hover:text-emerald-400 transition-colors">
              {product.title}
            </h3>
          </Link>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              wishlisted ? "text-red-400 bg-red-500/10" : "text-slate-600 hover:text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-400">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star size={12} className="star-filled" fill="currentColor" />
            <span>{product.seller.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <img
            src={product.seller.avatar}
            alt={product.seller.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs text-slate-500 truncate">{product.seller.name}</span>
          <span className="text-xs text-slate-600 ml-auto">{product.location}</span>
        </div>

        {/* Add to cart button — visible on hover */}
        {product.status === "Active" && (
          <button
            onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
              inCart
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 text-slate-500 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400"
            }`}
          >
            <ShoppingCart size={13} />
            {inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
