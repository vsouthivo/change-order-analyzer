import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createAdminClient()

  const [{ count: totalDocs }, { count: completedDocs }, { count: failedDocs }, { data: stats }] =
    await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('change_orders').select('days_changed, extension_type'),
    ])

  const totalOrders = stats?.length ?? 0
  const extensions = stats?.filter((o) => o.extension_type === 'extension') ?? []
  const reductions = stats?.filter((o) => o.extension_type === 'reduction') ?? []
  const avgDaysExtended =
    extensions.length > 0
      ? Math.round(extensions.reduce((s, o) => s + (o.days_changed ?? 0), 0) / extensions.length)
      : 0

  const statCards = [
    { label: 'เอกสารทั้งหมด', value: totalDocs ?? 0, color: 'text-gray-900' },
    { label: 'ประมวลผลสำเร็จ', value: completedDocs ?? 0, color: 'text-green-600' },
    { label: 'ล้มเหลว', value: failedDocs ?? 0, color: 'text-red-600' },
    { label: 'Change Orders', value: totalOrders, color: 'text-blue-600' },
    { label: 'ขยายเวลา', value: extensions.length, color: 'text-orange-600' },
    { label: 'ลดเวลา', value: reductions.length, color: 'text-teal-600' },
    { label: 'เฉลี่ยวันขยาย', value: avgDaysExtended ? `${avgDaysExtended} วัน` : '—', color: 'text-gray-700' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + อัปโหลดเอกสาร
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">สัดส่วน Change Orders</h2>
        {totalOrders === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'ขยายเวลา', count: extensions.length, color: 'bg-orange-400' },
              { label: 'ลดเวลา', count: reductions.length, color: 'bg-teal-400' },
              { label: 'ไม่ระบุ', count: totalOrders - extensions.length - reductions.length, color: 'bg-gray-300' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{label}</span>
                  <span>{count} ({totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${color}`}
                    style={{ width: `${totalOrders > 0 ? (count / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
