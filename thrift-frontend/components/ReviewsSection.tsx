'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import StarRating from '@/components/StarRating'

export default function ReviewsSection({ sellerId }: { sellerId: string }) {
  const [reviews, setReviews]   = useState<any[]>([])
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get(`/sellers/${sellerId}/reviews`)
      .then((res) => {
        setReviews(res.data.data.reviews?.data || [])
        setAvgRating(res.data.data.avg_rating || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sellerId])

  if (loading) return null
  if (reviews.length === 0) return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <p className="text-sm font-semibold text-gray-700 mb-2">Seller reviews</p>
      <p className="text-sm text-gray-400">No reviews yet for this seller.</p>
    </div>
  )

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm font-semibold text-gray-700">Seller reviews</p>
        {avgRating && <StarRating rating={avgRating} />}
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {reviews.slice(0, 5).map((review: any) => (
          <div key={review.review_id} className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                {review.buyer?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-700">{review.buyer?.name}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
            )}
            {review.seller_response && (
              <div className="mt-2 pl-2 border-l-2 border-blue-200">
                <p className="text-xs text-gray-500 italic">{review.seller_response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}