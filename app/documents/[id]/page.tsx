import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import ExtractionResult from '@/components/ExtractionResult'
import type { DocumentWithChangeOrders } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*, change_orders(*)')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <ExtractionResult document={data as DocumentWithChangeOrders} />
    </div>
  )
}
