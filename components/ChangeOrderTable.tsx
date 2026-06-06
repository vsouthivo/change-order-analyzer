import type { ChangeOrder } from '@/types'
import { ExtensionBadge } from './StatusBadge'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value ?? <span className="text-gray-400 italic">ไม่พบข้อมูล</span>}</dd>
    </div>
  )
}

function SignatureStatus({ label, signed }: { label: string; signed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${signed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
        {signed ? '✓' : '–'}
      </span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}

function ConfidenceBar({ score }: { score: number | null }) {
  if (score === null) return null
  const pct = Math.round(score * 100)
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>ความเชื่อมั่น</span>
        <span className={pct < 70 ? 'text-orange-600 font-medium' : ''}>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {pct < 70 && (
        <p className="text-xs text-orange-600 mt-1">⚠️ ความเชื่อมั่นต่ำ — แนะนำตรวจสอบด้วยตนเอง</p>
      )}
    </div>
  )
}

export default function ChangeOrderTable({ changeOrder }: { changeOrder: ChangeOrder }) {
  const daysLabel =
    changeOrder.days_changed !== null
      ? `${changeOrder.days_changed > 0 ? '+' : ''}${changeOrder.days_changed} วัน`
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            คำสั่งเปลี่ยนแปลง {changeOrder.order_number ?? '—'}
          </h3>
          {changeOrder.issue_date && (
            <p className="text-sm text-gray-500 mt-0.5">วันที่ออกคำสั่ง: {changeOrder.issue_date}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExtensionBadge type={changeOrder.extension_type} />
          {daysLabel && (
            <span className={`text-sm font-semibold ${(changeOrder.days_changed ?? 0) > 0 ? 'text-orange-600' : 'text-teal-600'}`}>
              {daysLabel}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      {(changeOrder.original_completion_date || changeOrder.new_completion_date) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">ระยะเวลา</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-center">
              <p className="text-xs text-gray-500">วันแล้วเสร็จเดิม</p>
              <p className="text-sm font-medium text-gray-900">{changeOrder.original_completion_date ?? '—'}</p>
            </div>
            <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="text-center">
              <p className="text-xs text-gray-500">วันแล้วเสร็จใหม่</p>
              <p className="text-sm font-medium text-gray-900">{changeOrder.new_completion_date ?? '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="เหตุผล" value={changeOrder.reason} />
        <Field label="รายละเอียดงาน" value={changeOrder.work_details} />
        <Field label="เงื่อนไข" value={changeOrder.conditions} />
        <Field label="วันที่มีผล" value={changeOrder.effective_date} />
      </dl>

      {/* Parties */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">คู่สัญญาและลายเซ็น</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">ผู้รับเหมา</p>
            <p className="text-sm font-medium text-gray-900 mb-2">{changeOrder.contractor_name ?? '—'}</p>
            <SignatureStatus label="ลงนามแล้ว" signed={changeOrder.contractor_signed} />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">เจ้าของโครงการ</p>
            <p className="text-sm font-medium text-gray-900 mb-2">{changeOrder.project_owner ?? '—'}</p>
            <SignatureStatus label="ลงนามแล้ว" signed={changeOrder.owner_signed} />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">ผู้อนุมัติ</p>
            <p className="text-sm font-medium text-gray-900 mb-2">{changeOrder.approver_name ?? '—'}</p>
            <SignatureStatus label="อนุมัติแล้ว" signed={changeOrder.approver_signed} />
          </div>
        </div>
      </div>

      {/* Confidence */}
      <ConfidenceBar score={changeOrder.confidence_score} />
    </div>
  )
}
