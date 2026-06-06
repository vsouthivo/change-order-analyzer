import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { DocumentDetailResponse } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DocumentDetailResponse>> {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('documents')
      .select('*, change_orders(*)')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: 'ไม่พบเอกสาร' })
    }

    return NextResponse.json({ success: true, document: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'
    return NextResponse.json({ success: false, error: message })
  }
}
