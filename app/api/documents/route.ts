import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { DocumentsListResponse } from '@/types'

export async function GET(): Promise<NextResponse<DocumentsListResponse>> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, documents: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'
    return NextResponse.json({ success: false, error: message })
  }
}
