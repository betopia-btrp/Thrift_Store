'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import ReviewsSection from '@/components/ReviewsSection'

const IMAGE_BASE = 'http://localhost:8000'

function getImageUrl(img: string) {
  if (!img) return '/placeholder.png'
  return img.startsWith('/storage') ? `${IMAGE_BASE}${img}` : img
}

export default function ProductDetailPage() {
  const { id }   = useParams()
  const router   = useRouter()
  const { user } = useAuthStore()

  const [product, setProduct]           = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [activeImage, setActiveImage]   = useState(0)
  const [wishlisted, setWishlisted]     = useState(false)
  const [inCart, setInCart]             = useState(false)
  const [ordering, setOrdering]         = useState(false)
  const [alreadyOrdered, setAlreadyOrdered] = useState(false)
  const [orderPlaced, setOrderPlaced]   = useState(false)
  const [orderMsg, setOrderMsg]         = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportMsg, setReportMsg]       = useState('')
  const [reporting, setReporting]       = useState(false)

  const { addItem, removeItem, hasItem, loadCart } = useCartStore()

  useEffect(() => { loadCart() }, [loadCart])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.data)
        setWishlisted(res.data.data.is_wishlisted || false)
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [id, router])

  useEffect(() => {
    if (product) setInCart(hasItem(product.product_id))
  }, [product, hasItem])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-700 animate-spin" />
      </div>
    )
  }

  if (!product) return null

  // Safely extract category — API returns an object not a string
  const categoryName: string =
    product.category && typeof product.category === 'object'
      ? product.category.category_name ?? ''
      : typeof product.category === 'string'
      ? product.category
      : ''

  const categoryId: number | string | null =
    product.category && typeof product.category === 'object'
      ? product.category.category_id ?? product.category_id ?? null
      : product.category_id ?? null

  const isSeller = user?.user_id === product.seller_id
  const isAdmin  = user?.role === 'admin'
  const canBuy   = user && !isSeller && !isAdmin && product.status === 'active'
  const images: string[] = product.images || []

  const handleCart = () => {
    if (!user) return router.push('/auth/login')
    if (!canBuy) return
    if (inCart) {
      removeItem(product.product_id)
      setInCart(false)
    } else {
      addItem({
        product_id: product.product_id,
        title:      product.title,
        price:      parseFloat(product.price),
        image:      product.images?.[0] || '',
        seller_id:  product.seller_id,
        condition:  product.condition,
      })
      setInCart(true)
    }
  }

  const handleOrder = async () => {
    if (!user) return router.push('/auth/login')
    if (alreadyOrdered) return
    setOrdering(true)
    setOrderMsg('')
    try {
      await api.post('/orders', { product_id: product.product_id })
      setOrderPlaced(true)
      setAlreadyOrdered(true)
    } catch (err: any) {
      const msg = err.response?.data?.meta?.message || 'Failed to place order'
      setOrderMsg(msg)
      if (msg.toLowerCase().includes('already')) setAlreadyOrdered(true)
    } finally {
      setOrdering(false)
    }
  }

  const handleWishlist = async () => {
    if (!user) return router.push('/auth/login')
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product.product_id}`)
      } else {
        await api.post('/wishlist', { product_id: product.product_id })
      }
      setWishlisted((w) => !w)
    } catch {}
  }

  const handleReport = async () => {
    if (reportReason.trim().length < 10) return
    setReporting(true)
    try {
      await api.post('/reports', {
        target_type: 'product',
        target_id:   product.product_id,
        reason:      reportReason,
      })
      setReportMsg('Report submitted. Our team will review within 72 hours.')
      setShowReportForm(false)
      setReportReason('')
    } catch (err: any) {
      setReportMsg(err.response?.data?.meta?.message || 'Failed to submit report')
    } finally {
      setReporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-stone-400 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-stone-700 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/search" className="hover:text-stone-700 transition-colors">
            Browse
          </Link>
          {categoryName && categoryId && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/search?category_id=${categoryId}`}
                className="hover:text-stone-700 transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-stone-600 truncate max-w-[180px]">
            {product.title}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square">
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[activeImage])}
                  alt={`${product.title} — image ${activeImage + 1} of ${images.length}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-stone-300 text-sm">No image</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                    disabled={activeImage === 0}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-700 shadow-sm disabled:opacity-30 hover:bg-white transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => Math.min(images.length - 1, i + 1))}
                    disabled={activeImage === images.length - 1}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-700 shadow-sm disabled:opacity-30 hover:bg-white transition-all"
                  >
                    ›
                  </button>
                  <div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
                    role="tablist"
                    aria-label="Image navigation"
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        role="tab"
                        aria-selected={i === activeImage}
                        aria-label={`Image ${i + 1}`}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === activeImage ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all ${
                      i === activeImage
                        ? 'ring-2 ring-stone-800 ring-offset-1'
                        : 'ring-1 ring-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">

            {/* Title + wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold text-stone-900 leading-snug">
                {product.title}
              </h1>
              {!isSeller && !isAdmin && user && (
                <button
                  onClick={handleWishlist}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                  className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white border-stone-200 text-stone-400 hover:border-rose-200 hover:text-rose-400'
                  }`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill={wishlisted ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  >
                    <path
                      d="M7.5 13S1 8.5 1 4.5A3.5 3.5 0 0 1 7.5 2.8 3.5 3.5 0 0 1 14 4.5C14 8.5 7.5 13 7.5 13Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Price + condition */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-stone-900">
                ৳{parseFloat(product.price).toLocaleString('en-BD', { minimumFractionDigits: 0 })}
              </span>
              {product.condition && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 font-medium">
                  {product.condition}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Meta */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-stone-100 pt-4">
              {categoryName && (
                <>
                  <dt className="text-stone-400">Category</dt>
                  <dd className="text-stone-700">{categoryName}</dd>
                </>
              )}
              {product.subcategory?.subcategory_name && (
                <>
                  <dt className="text-stone-400">Type</dt>
                  <dd className="text-stone-700">{product.subcategory.subcategory_name}</dd>
                </>
              )}
              {product.condition && (
                <>
                  <dt className="text-stone-400">Condition</dt>
                  <dd className="text-stone-700">{product.condition}</dd>
                </>
              )}
              {product.location && (
                <>
                  <dt className="text-stone-400">Location</dt>
                  <dd className="text-stone-700">{product.location}</dd>
                </>
              )}
              {product.seller?.name && (
                <>
                  <dt className="text-stone-400">Seller</dt>
                  <dd>
                    <Link
                      href={`/sellers/${product.seller_id}`}
                      className="text-stone-700 hover:text-stone-900 underline underline-offset-2"
                    >
                      {product.seller.name}
                    </Link>
                  </dd>
                </>
              )}
            </dl>

            {/* CTA buttons */}
            {canBuy && (
              <div className="flex flex-col gap-2.5 mt-1">
                <button
                  onClick={handleCart}
                  className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${
                    inCart
                      ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {inCart ? '− Remove from cart' : '+ Add to cart'}
                </button>

                {orderPlaced ? (
                  <div
                    role="status"
                    className="w-full py-3 rounded-xl text-sm font-medium text-center bg-emerald-50 border border-emerald-200 text-emerald-700"
                  >
                    ✓ Order placed!{' '}
                    <Link
                      href="/dashboard/buyer"
                      className="underline underline-offset-2"
                    >
                      View in dashboard
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleOrder}
                    disabled={ordering || alreadyOrdered}
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {ordering ? 'Placing order…' : 'Place order'}
                  </button>
                )}

                {orderMsg && !orderPlaced && (
                  <p role="alert" className="text-xs text-rose-500 text-center">
                    {orderMsg}
                  </p>
                )}
              </div>
            )}

            {/* Off-platform notice */}
            {canBuy && (
              <p className="text-xs text-stone-400 border border-stone-100 rounded-lg px-3 py-2 bg-stone-50">
                ⚠ Delivery is arranged directly between buyer and seller outside the platform.
              </p>
            )}

            {/* Seller viewing own listing */}
            {isSeller && (
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                This is your listing.{' '}
                <Link
                  href={`/listings/${product.product_id}/edit`}
                  className="underline underline-offset-2 text-stone-800 font-medium"
                >
                  Edit listing
                </Link>
              </div>
            )}

            {/* Product sold */}
            {product.status === 'sold' && (
              <div className="rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-500 text-center font-medium">
                This item has been sold
              </div>
            )}

            {/* Seller contact */}
            {!isSeller && !isAdmin && product.seller && (
              <div className="flex gap-2">
                <a
                  href={`mailto:?subject=About: ${encodeURIComponent(product.title)}`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all"
                >
                  ✉ Email seller
                </a>
                <Link
                  href={`/sellers/${product.seller_id}`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all"
                >
                  ○ View profile
                </Link>
              </div>
            )}

            {/* Report listing */}
            {user && !isSeller && !isAdmin && (
              <div className="pt-1">
                {reportMsg && (
                  <p role="status" className="text-xs text-emerald-600 mb-2">
                    {reportMsg}
                  </p>
                )}
                {!showReportForm ? (
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="text-xs text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    ⚑ Report this listing
                  </button>
                ) : (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-2.5">
                    <p className="text-xs font-semibold text-rose-700">
                      What&apos;s wrong with this listing?
                    </p>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe the issue (min 10 characters)…"
                      rows={3}
                      aria-label="Report reason"
                      className="w-full text-sm border border-rose-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-rose-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReport}
                        disabled={reporting || reportReason.trim().length < 10}
                        className="text-xs bg-rose-600 text-white px-4 py-1.5 rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {reporting ? 'Submitting…' : 'Submit report'}
                      </button>
                      <button
                        onClick={() => {
                          setShowReportForm(false)
                          setReportReason('')
                        }}
                        className="text-xs text-stone-500 px-4 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-100 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14 border-t border-stone-200 pt-10">
          <ReviewsSection sellerId={product.seller_id} />
        </div>

      </div>
    </div>
  )
}