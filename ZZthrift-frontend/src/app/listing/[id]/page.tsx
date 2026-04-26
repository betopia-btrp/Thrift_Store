"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Heart, Share2, MessageCircle, ShoppingBag, Star, MapPin,
  Eye, Shield, ChevronLeft, ChevronRight, Calendar, Package,
  ShoppingCart, CheckCircle
} from "lucide-react";
import { PRODUCTS, REVIEWS } from "@/lib/data";
import { formatPrice, formatDate, conditionColor, renderStars } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { use } from "react";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category && p.status === "Active"
  ).slice(0, 4);

  const sellerReviews = REVIEWS.filter((r) => r.seller.id === product.seller.id);
  const stars = renderStars(product.seller.rating);

  const handleOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-emerald-400 transition-colors">Browse</Link>
        <span>/</span>
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-emerald-400 transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* ── Image Gallery ── */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/5 mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.status === "Sold" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-violet-600 text-white px-6 py-2 rounded-full text-lg font-bold">SOLD</span>
              </div>
            )}
            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {/* Image counter */}
            <div className="absolute bottom-3 right-3 glass px-2 py-1 rounded-full text-xs text-slate-300">
              {activeImage + 1} / {product.images.length}
            </div>
            {/* In cart badge */}
            {inCart && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <ShoppingCart size={11} /> In Cart
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-emerald-500" : "border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge text-xs px-2.5 py-1 rounded-full font-medium ${conditionColor(product.condition)}`}>
                  {product.condition}
                </span>
                <span className="text-xs text-slate-500">{product.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">{product.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  wishlisted ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/30"
                }`}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <button className="p-2.5 rounded-xl border border-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="text-4xl font-extrabold text-emerald-400 mb-4">
            {formatPrice(product.price)}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-5 pb-5 border-b border-white/5">
            <span className="flex items-center gap-1"><Eye size={13} /> {product.views} views</span>
            <span className="flex items-center gap-1"><Heart size={13} /> {product.wishlistCount} wishlists</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {product.location}</span>
            <span className="flex items-center gap-1"><Calendar size={13} /> Listed {formatDate(product.createdAt)}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-300 text-sm mb-2">Description</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Seller card */}
          <div className="glass rounded-xl border border-white/10 p-4 mb-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              <Link href={`/seller/${product.seller.id}`}>
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10 hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/seller/${product.seller.id}`} className="font-semibold text-slate-200 hover:text-emerald-400 transition-colors">
                  {product.seller.name}
                </Link>
                <div className="flex items-center gap-1 mt-0.5">
                  {stars.map((s, i) => (
                    <Star key={i} size={12} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">{product.seller.rating} ({product.seller.reviewCount} reviews)</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {product.seller.location}
                </p>
              </div>
              <Link href={`/seller/${product.seller.id}`}>
                <button className="btn btn-secondary text-xs px-3 py-2">
                  <MessageCircle size={14} /> View Profile
                </button>
              </Link>
            </div>
          </div>

          {/* Safety notice */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5 text-xs text-amber-400">
            <Shield size={14} className="shrink-0 mt-0.5" />
            <span>Delivery is arranged directly between buyer and seller. ThriftHub does not handle shipping.</span>
          </div>

          {/* Action buttons */}
          {product.status === "Active" ? (
            <div className="space-y-3">
              {/* Add to Cart / Remove from Cart */}
              {inCart ? (
                <div className="flex gap-3">
                  <Link href="/cart" className="flex-1">
                    <button className="btn btn-primary w-full animate-pulse-glow">
                      <ShoppingCart size={16} /> View in Cart
                    </button>
                  </Link>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="btn btn-danger px-4"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary w-full"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              )}

              {/* Direct order + contact */}
              <div className="flex gap-3">
                {orderPlaced ? (
                  <div className="btn flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default">
                    <CheckCircle size={16} /> Order Placed! ✓
                  </div>
                ) : (
                  <button onClick={handleOrder} className="btn btn-secondary flex-1">
                    <ShoppingBag size={16} /> Place Order Now
                  </button>
                )}
                <button className="btn btn-secondary flex-1">
                  <MessageCircle size={16} /> Contact Seller
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold">
              This item has been sold
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      {sellerReviews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-200 mb-4">Seller Reviews ({sellerReviews.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellerReviews.map((review) => (
              <div key={review.id} className="glass rounded-xl border border-white/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={review.buyer.avatar} alt={review.buyer.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{review.buyer.name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating).map((s, i) => (
                        <Star key={i} size={11} fill={s.filled ? "currentColor" : "none"} className={s.filled ? "star-filled" : "star-empty"} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Listings ── */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-4">Related Listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} view="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
