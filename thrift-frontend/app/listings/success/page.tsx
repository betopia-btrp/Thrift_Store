'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId    = searchParams.get('session_id')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!sessionId) return

    // Wait 3 seconds for webhook to process, then check
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/seller/listings')
        const active = (res.data.data || []).filter((l: any) => l.status === 'active')
        setCount(active.length)
      } catch (_) {}
    }, 3000)

    return () => clearTimeout(timer)
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment successful!</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your listings are now live on the marketplace.
        </p>
        {count !== null && (
          <p className="text-green-600 text-sm font-medium mb-6">
            {count} active listing{count !== 1 ? 's' : ''} published
          </p>
        )}
        <div className="flex flex-col gap-3 mt-6">
          <Link
  href="/dashboard/seller?payment=success"
  className="bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
>
  Go to seller dashboard
</Link>
          <Link
            href="/search"
            className="border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}