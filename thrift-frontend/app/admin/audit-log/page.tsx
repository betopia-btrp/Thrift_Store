'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import AuthGuard from '@/components/AuthGuard'

const ACTION_COLORS: Record<string, string> = {
  block_user:      'bg-red-100 text-red-700',
  unblock_user:    'bg-green-100 text-green-700',
  remove_product:  'bg-orange-100 text-orange-700',
  remove_review:   'bg-yellow-100 text-yellow-700',
  resolve_report:  'bg-blue-100 text-blue-700',
  create_category: 'bg-purple-100 text-purple-700',
  update_category: 'bg-purple-100 text-purple-700',
}

export default function AuditLogPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [logs, setLogs]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/audit-log')
        .then((res) => setLogs(res.data.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }, [])

  return (
    <AuthGuard adminOnly>
        <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit log</h1>
        <a href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">← Dashboard</a>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-14 animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No audit log entries yet</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Target</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Admin</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.log_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'
                    }`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-500 capitalize">{log.target_type}</p>
                    <p className="font-mono text-xs text-gray-400 truncate max-w-[160px]">
                      {log.target_id}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{log.admin?.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(log.performed_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AuthGuard>
  )
}