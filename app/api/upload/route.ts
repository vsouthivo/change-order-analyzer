import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { parsePDF, validatePDFBuffer } from '@/lib/pdf'
import type { UploadResponse } from '@/types'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'ไม่พบไฟล์ที่อัปโหลด' })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'รองรับเฉพาะไฟล์ PDF เท่านั้น' })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'ขนาดไฟล์เกิน 50MB' })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    validatePDFBuffer(buffer)

    const { pageCount } = await parsePDF(buffer)

    const supabase = createAdminClient()
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `uploads/${filename}`

    const { error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(storagePath, buffer, { contentType: 'application/pdf' })

    if (storageError) {
      return NextResponse.json({ success: false, error: `อัปโหลดไฟล์ไม่สำเร็จ: ${storageError.message}` })
    }

    const { data: doc, error: dbError } = await supabase
      .from('documents')
      .insert({
        filename,
        original_name: file.name,
        file_size: file.size,
        storage_path: storagePath,
        status: 'pending',
        page_count: pageCount,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ success: false, error: `บันทึกข้อมูลไม่สำเร็จ: ${dbError.message}` })
    }

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      filename: file.name,
      pageCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    return NextResponse.json({ success: false, error: message })
  }
}
