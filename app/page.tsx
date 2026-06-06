import PDFUploader from '@/components/PDFUploader'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          วิเคราะห์คำสั่งเปลี่ยนแปลงเวลา
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          อัปโหลด PDF สัญญาก่อสร้าง แล้วให้ Claude AI ดึงข้อมูล{' '}
          <strong>Time Change Order</strong> โดยอัตโนมัติ
        </p>
      </div>

      <PDFUploader />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm text-gray-500">
        <div className="p-4">
          <div className="text-2xl mb-2">📄</div>
          <p className="font-medium text-gray-700">อัปโหลด PDF</p>
          <p>รองรับสัญญาภาษาไทย/อังกฤษ ไม่เกิน 50MB</p>
        </div>
        <div className="p-4">
          <div className="text-2xl mb-2">🤖</div>
          <p className="font-medium text-gray-700">Claude วิเคราะห์</p>
          <p>ดึงวันที่, เหตุผล, คู่สัญญา และลายเซ็น</p>
        </div>
        <div className="p-4">
          <div className="text-2xl mb-2">📊</div>
          <p className="font-medium text-gray-700">ดูผลลัพธ์</p>
          <p>Structured data พร้อม Export JSON</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/documents" className="text-sm text-blue-600 hover:text-blue-800">
          ดูเอกสารที่ประมวลผลแล้ว →
        </Link>
      </div>
    </div>
  )
}
