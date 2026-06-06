import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { parsePDF } from '@/lib/pdf'
import { extractChangeOrder } from '@/lib/extraction'
import type { ExtractionResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<ExtractionResponse>> {
  const supabase = createAdminClient()
  let documentId: string | undefined

  try {
    const body = await request.json()
    documentId = body.documentId as string

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'ต้องระบุ documentId' })
    }

    // Update status to processing
    await supabase.from('documents').update({ status: 'processing' }).eq('id', documentId)

    // Get document info
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', documentId)
      .single()

    if (docError || !doc?.storage_path) {
      return NextResponse.json({ success: false, error: 'ไม่พบเอกสาร' })
    }

    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdfs')
      .download(doc.storage_path)

    if (downloadError || !fileData) {
      throw new Error(`ดาวน์โหลดไฟล์ไม่สำเร็จ: ${downloadError?.message}`)
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const { text: pdfText } = await parsePDF(buffer)

    if (!pdfText || pdfText.trim().length < 50) {
      throw new Error('ไม่สามารถอ่านข้อความจาก PDF ได้ อาจเป็น PDF ที่ scan มา')
    }

    // Run Claude extraction
    const { changeOrder, inputTokens, outputTokens, elapsedMs } = await extractChangeOrder(pdfText)

    // Save change order
    const { data: savedOrder, error: orderError } = await supabase
      .from('change_orders')
      .insert({ document_id: documentId, ...changeOrder })
      .select()
      .single()

    if (orderError) {
      throw new Error(`บันทึกผล extraction ไม่สำเร็จ: ${orderError.message}`)
    }

    // Log extraction metrics
    await supabase.from('extraction_logs').insert({
      document_id: documentId,
      model: 'claude-sonnet-4-6',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      extraction_time_ms: elapsedMs,
      success: true,
    })

    // Update document status
    await supabase.from('documents').update({ status: 'completed' }).eq('id', documentId)

    return NextResponse.json({ success: true, changeOrder: savedOrder })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด'

    if (documentId) {
      await supabase.from('documents').update({ status: 'failed' }).eq('id', documentId)
      await supabase.from('extraction_logs').insert({
        document_id: documentId,
        model: 'claude-sonnet-4-6',
        success: false,
        error_message: message,
      })
    }

    return NextResponse.json({ success: false, error: message })
  }
}
