'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type UploadState = 'idle' | 'uploading' | 'extracting' | 'done' | 'error'

export default function PDFUploader() {
  const router = useRouter()
  const [state, setState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setErrorMsg('รองรับเฉพาะไฟล์ PDF เท่านั้น')
        setState('error')
        return
      }

      setState('uploading')
      setErrorMsg('')

      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        setErrorMsg(uploadData.error ?? 'อัปโหลดไม่สำเร็จ')
        setState('error')
        return
      }

      setState('extracting')

      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: uploadData.documentId }),
      })
      const extractData = await extractRes.json()

      if (!extractData.success) {
        setErrorMsg(extractData.error ?? 'ประมวลผลไม่สำเร็จ')
        setState('error')
        return
      }

      setState('done')
      router.push(`/documents/${uploadData.documentId}`)
    },
    [router]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const isLoading = state === 'uploading' || state === 'extracting'

  return (
    <div className="w-full max-w-xl mx-auto">
      <label
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {state === 'idle' || state === 'error' ? (
          <div className="text-center px-6">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-lg font-medium text-gray-700">วางไฟล์ PDF ที่นี่</p>
            <p className="text-sm text-gray-500 mt-1">หรือคลิกเพื่อเลือกไฟล์ (ไม่เกิน 50MB)</p>
          </div>
        ) : (
          <div className="text-center px-6">
            <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700">
              {state === 'uploading' ? 'กำลังอัปโหลด...' : 'Claude กำลังอ่านเอกสาร...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {state === 'extracting' ? 'อาจใช้เวลา 15-30 วินาที' : 'กรุณารอสักครู่'}
            </p>
          </div>
        )}
      </label>

      {state === 'error' && errorMsg && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errorMsg}</p>
          <button
            onClick={() => setState('idle')}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}
    </div>
  )
}
