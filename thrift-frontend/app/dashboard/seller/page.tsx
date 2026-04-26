'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import AuthGuard from '@/components/AuthGuard'

export default function SellerDashboard() {
  return (
    <AuthGuard>
      <SellerDashboardContent />
    </AuthGuard>
  )
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  completed:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'dispatched',
  dispatched: 'completed',
}

function SellerDashboardContent() {
  const { user } = useAuthStore()

  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [due, setDue] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'payments'>('listings')
  const [updating, setUpdating] = useState<string | null>(null)

  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])
  const [paying, setPaying] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  const imageBase = 'http://localhost:8000'

  useEffect(() => {
    Promise.all([
      api.get('/seller/listings'),
      api.get('/seller/orders'),
      api.get('/payments'),
      api.get('/payments/due'),
      api.get('/seller/stats'), 
    ])
      .then(([l, o, p, d, s]) => {
        setListings(l.data.data || [])
        setOrders(o.data.data.data || [])
        setPayments(p.data.data || [])
        setDue(d.data.data)
        setStats(s.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      )
    } finally {
      setUpdating(null)
    }
  }

  const markSold = async (id: string) => {
    if (!confirm('Mark as sold?')) return
    await api.patch(`/products/${id}/sold`)
    setListings((prev) =>
      prev.map((l) => (l.product_id === id ? { ...l, status: 'sold' } : l))
    )
  }

  const archiveListing = async (id: string) => {
    if (!confirm('Archive?')) return
    await api.delete(`/products/${id}`)
    setListings((prev) =>
      prev.map((l) => (l.product_id === id ? { ...l, status: 'archived' } : l))
    )
  }

  const refreshListings = async () => {
  try {
    const res = await api.get('/seller/listings')
    setListings(res.data.data || [])
  } catch (_) {}
}

const toggleDraft = (id: string) => {
  setSelectedDrafts(prev => 
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
  if (selectAll) setSelectAll(false)
}

const toggleSelectAll = () => {
  if (selectAll) {
    setSelectedDrafts([])
    setSelectAll(false)
  } else {
    setSelectedDrafts(draftListings.map(l => l.product_id))
    setSelectAll(true)
  }
}

const handlePayAndPublish = async () => {
  if (selectedDrafts.length === 0) return
  setPaying(true)
  try {
    const res = await api.post('/payments/checkout', { product_ids: selectedDrafts })
    if (res.data.data?.checkout_url) {
      window.location.href = res.data.data.checkout_url
    }
  } catch (err: any) {
    alert(err.response?.data?.meta?.message || 'Failed to create checkout')
  } finally {
    setPaying(false)
  }
}

// Check if returning from payment
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('payment') === 'success') {
    // Wait for webhook to process then refresh
    setTimeout(refreshListings, 3000)
  }
}, [])

  if (loading) return <div className="p-10">Loading...</div>

  const draftListings = listings.filter((l) => l.status === 'draft')
  const activeListings = listings.filter((l) => l.status === 'active')

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3">
  <button
    onClick={refreshListings}
    className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
  >
    🔄 Refresh
  </button>
  <Link
    href="/listings/create"
    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
  >
    + New listing
  </Link>
</div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Stat label="Active" value={activeListings.length} />
        <Stat label="Drafts" value={draftListings.length} />
        <Stat label="Orders" value={orders.length} />
        <Stat
          label="Paid"
          value={`$${payments.reduce((s, p) => s + parseFloat(p.total_amount || 0), 0).toFixed(2)}`}
        />
      </div>

      {/* Payment Due Section */}
      {due && due.draft_count > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-yellow-800">Payment Required</p>
              <p className="text-sm text-yellow-700">
                {due.draft_count} draft listing(s) • ${due.fee_per_listing} each • Total: ${due.total_due}
              </p>
            </div>
            <button
              onClick={handlePayAndPublish}
              disabled={selectedDrafts.length === 0 || paying}
              className="bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition disabled:opacity-50"
            >
              {paying ? 'Processing...' : `Pay $${(selectedDrafts.length * (due.fee_per_listing || 5)).toFixed(2)} & Publish`}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <label htmlFor="selectAll" className="text-sm text-yellow-800">
              Select all ({due.draft_count} listings)
            </label>
          </div>

          <div className="space-y-2">
            {due.draft_products?.map((draft: any) => (
              <div key={draft.product_id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-yellow-100">
                <input
                  type="checkbox"
                  checked={selectedDrafts.includes(draft.product_id)}
                  onChange={() => toggleDraft(draft.product_id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 flex-1">{draft.title}</span>
                <span className="text-xs text-gray-400">${due.fee_per_listing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue */}
      {stats && stats.completed_orders > 0 && (
  <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
    <p className="text-sm font-semibold text-gray-700 mb-3">Revenue & profit</p>
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Gross revenue',    value: `$${stats.gross_revenue.toFixed(2)}`,     color: 'text-green-600' },
        { label: 'Listing fees paid',value: `$${stats.listing_fees_paid.toFixed(2)}`, color: 'text-red-500'   },
        { label: 'Net profit',       value: `$${stats.net_profit.toFixed(2)}`,        color: stats.net_profit >= 0 ? 'text-blue-600' : 'text-red-600' },
      ].map((s) => (
        <div key={s.label} className="text-center">
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['listings', 'orders', 'payments'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t as any)}>
            {t}
          </button>
        ))}
      </div>

      {/* Listings */}
      {activeTab === 'listings' &&
        listings.map((l) => (
          <div key={l.product_id} className="border p-3 mb-2 flex gap-3">

            <img
              src={l.images?.[0] ? `${imageBase}${l.images[0]}` : '/placeholder.png'}
              className="w-12 h-12 object-cover"
            />

            <div className="flex-1">
              <p>{l.title}</p>
              <p>${l.price}</p>
            </div>

            <div className="flex gap-2">
              <Link href={`/listings/${l.product_id}/edit`}>Edit</Link>

              {l.status === 'active' && (
                <>
                  <button onClick={() => markSold(l.product_id)}>Sold</button>
                  <button onClick={() => archiveListing(l.product_id)}>Archive</button>
                </>
              )}
            </div>
          </div>
        ))}

      {/* Orders */}
      {activeTab === 'orders' &&
        orders.map((o) => (
          <div key={o.order_id} className="border p-3 mb-2">
            <p>{o.product?.title}</p>
            <p>{o.status}</p>

            {NEXT_STATUS[o.status] && (
              <button
                onClick={() =>
                  updateOrderStatus(o.order_id, NEXT_STATUS[o.status])
                }
              >
                Next
              </button>
            )}
          </div>
        ))}

      {/* Payments */}
      {activeTab === 'payments' &&
        payments.map((p, i) => (
          <div key={i} className="border p-3 mb-2">
            <p>${p.total_amount}</p>
            <p>{p.status}</p>
          </div>
        ))}
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="border p-3 text-center rounded-xl">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}