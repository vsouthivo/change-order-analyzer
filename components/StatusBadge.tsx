import type { DocumentStatus, ExtensionType } from '@/types'

const STATUS_CONFIG: Record<DocumentStatus, { label: string; className: string }> = {
  pending: { label: 'รอดำเนินการ', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'กำลังประมวลผล', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'สำเร็จ', className: 'bg-green-100 text-green-800' },
  failed: { label: 'ล้มเหลว', className: 'bg-red-100 text-red-800' },
}

const EXTENSION_CONFIG: Record<ExtensionType, { label: string; className: string }> = {
  extension: { label: 'ขยายเวลา', className: 'bg-orange-100 text-orange-800' },
  reduction: { label: 'ลดเวลา', className: 'bg-teal-100 text-teal-800' },
  unknown: { label: 'ไม่ระบุ', className: 'bg-gray-100 text-gray-600' },
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export function ExtensionBadge({ type }: { type: ExtensionType | null }) {
  if (!type) return null
  const config = EXTENSION_CONFIG[type]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
