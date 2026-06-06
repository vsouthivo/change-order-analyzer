export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type ExtensionType = 'extension' | 'reduction' | 'unknown'

export interface Document {
  id: string
  filename: string
  original_name: string
  file_size: number | null
  storage_path: string | null
  status: DocumentStatus
  page_count: number | null
  created_at: string
  updated_at: string
}

export interface ChangeOrder {
  id: string
  document_id: string
  order_number: string | null
  issue_date: string | null
  effective_date: string | null
  original_completion_date: string | null
  new_completion_date: string | null
  days_changed: number | null
  extension_type: ExtensionType | null
  reason: string | null
  work_details: string | null
  conditions: string | null
  contractor_name: string | null
  project_owner: string | null
  approver_name: string | null
  contractor_signed: boolean
  owner_signed: boolean
  approver_signed: boolean
  raw_extraction: Record<string, unknown> | null
  confidence_score: number | null
  created_at: string
}

export interface ExtractionLog {
  id: string
  document_id: string
  model: string | null
  input_tokens: number | null
  output_tokens: number | null
  extraction_time_ms: number | null
  success: boolean
  error_message: string | null
  created_at: string
}

export interface DocumentWithChangeOrders extends Document {
  change_orders: ChangeOrder[]
}

export interface UploadResponse {
  success: boolean
  documentId?: string
  filename?: string
  pageCount?: number
  error?: string
}

export interface ExtractionResponse {
  success: boolean
  changeOrder?: ChangeOrder
  error?: string
}

export interface DocumentsListResponse {
  success: boolean
  documents?: Document[]
  error?: string
}

export interface DocumentDetailResponse {
  success: boolean
  document?: DocumentWithChangeOrders
  error?: string
}
