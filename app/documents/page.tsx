import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import { StatusBadge } from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const supabase = createAdminClient()
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-red-600">เกิดข้อผิดพลาด: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">เอกสารทั้งหมด</h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + อัปโหลดเอกสารใหม่
        </Link>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-500 text-lg">ยังไม่มีเอกสาร</p>
          <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            อัปโหลดเอกสารแรก →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อไฟล์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หน้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่อัปโหลด
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.original_name}</p>
                    {doc.file_size && (
                      <p className="text-xs text-gray-400">{Math.round(doc.file_size / 1024)} KB</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.page_count ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ดูผล →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
