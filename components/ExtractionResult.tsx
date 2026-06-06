import type { DocumentWithChangeOrders } from '@/types'
import { StatusBadge } from './StatusBadge'
import ChangeOrderTable from './ChangeOrderTable'
import Link from 'next/link'

export default function ExtractionResult({ document: doc }: { document: DocumentWithChangeOrders }) {
  const hasOrders = doc.change_orders.length > 0

  const handleExportJSON = () => {
    const data = JSON.stringify(
      { document: { id: doc.id, filename: doc.original_name }, change_orders: doc.change_orders },
      null,
      2
    )
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `change-orders-${doc.id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Document header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{doc.original_name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {doc.page_count ? `${doc.page_count} หน้า` : ''}{' '}
              {doc.file_size ? `• ${Math.round(doc.file_size / 1024)} KB` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={doc.status} />
            {hasOrders && (
              <button
                onClick={handleExportJSON}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Export JSON
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change orders */}
      {hasOrders ? (
        doc.change_orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <ChangeOrderTable changeOrder={order} />
          </div>
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          {doc.status === 'processing' ? (
            <p className="text-gray-500">Claude กำลังอ่านเอกสาร...</p>
          ) : doc.status === 'failed' ? (
            <div>
              <p className="text-red-600 font-medium">การประมวลผลล้มเหลว</p>
              <p className="text-sm text-gray-500 mt-1">ตรวจสอบว่า PDF มีข้อความที่อ่านได้ (ไม่ใช่ PDF ที่ scan)</p>
            </div>
          ) : (
            <p className="text-gray-500">ไม่พบข้อมูล Time Change Order ในเอกสารนี้</p>
          )}
        </div>
      )}

      <div className="text-center">
        <Link href="/documents" className="text-sm text-blue-600 hover:text-blue-800">
          ← ดูเอกสารทั้งหมด
        </Link>
      </div>
    </div>
  )
}
