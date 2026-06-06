import { getAnthropicClient } from './anthropic'
import type { ChangeOrder } from '@/types'

const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 2048

const EXTRACTION_TOOL = {
  name: 'extract_change_order',
  description:
    'Extract time change order data from a construction contract PDF. Return null for fields not found in the document — do not guess or hallucinate values.',
  input_schema: {
    type: 'object' as const,
    properties: {
      order_number: {
        type: 'string',
        description: 'Change order number/reference (เลขที่คำสั่งเปลี่ยนแปลง)',
      },
      issue_date: {
        type: 'string',
        description: 'Date the change order was issued, format YYYY-MM-DD. Convert พ.ศ. to ค.ศ. by subtracting 543.',
      },
      effective_date: {
        type: 'string',
        description: 'Date the change order takes effect, format YYYY-MM-DD',
      },
      original_completion_date: {
        type: 'string',
        description: 'Original project completion date (วันแล้วเสร็จเดิม), format YYYY-MM-DD',
      },
      new_completion_date: {
        type: 'string',
        description: 'New project completion date after change order (วันแล้วเสร็จใหม่), format YYYY-MM-DD',
      },
      days_changed: {
        type: 'number',
        description: 'Number of days changed: positive = extension, negative = reduction',
      },
      extension_type: {
        type: 'string',
        enum: ['extension', 'reduction', 'unknown'],
        description: 'Whether this extends or reduces the project timeline',
      },
      reason: {
        type: 'string',
        description: 'Reason for the time change (เหตุผลที่ขอเปลี่ยนแปลง)',
      },
      work_details: {
        type: 'string',
        description: 'Details of work involved (รายละเอียดงาน)',
      },
      conditions: {
        type: 'string',
        description: 'Conditions or notes attached to this change order (เงื่อนไข)',
      },
      contractor_name: {
        type: 'string',
        description: 'Contractor name (ชื่อผู้รับเหมา)',
      },
      project_owner: {
        type: 'string',
        description: 'Project owner name (เจ้าของโครงการ)',
      },
      approver_name: {
        type: 'string',
        description: 'Approver name (ผู้อนุมัติ)',
      },
      contractor_signed: {
        type: 'boolean',
        description: 'Whether contractor has signed this document',
      },
      owner_signed: {
        type: 'boolean',
        description: 'Whether project owner has signed this document',
      },
      approver_signed: {
        type: 'boolean',
        description: 'Whether approver has signed this document',
      },
      confidence_score: {
        type: 'number',
        description:
          'Your confidence in the extraction accuracy, 0.0 (not confident) to 1.0 (very confident). Use 0.5 or lower if key information is ambiguous.',
      },
    },
    required: ['confidence_score'] as string[],
  },
}

const SYSTEM_PROMPT = `คุณเป็น AI ผู้เชี่ยวชาญในการอ่านและวิเคราะห์เอกสารสัญญาก่อสร้างภาษาไทยและภาษาอังกฤษ

หน้าที่ของคุณคือดึงข้อมูล "คำสั่งเปลี่ยนแปลงเวลา" (Time Change Order) จากข้อความ PDF ที่ให้มา

กฎสำคัญ:
1. ถ้าไม่พบข้อมูลในเอกสาร ให้ return null สำหรับ field นั้น ห้าม hallucinate
2. แปลงวันที่จาก พ.ศ. เป็น ค.ศ. โดยลบ 543 เสมอ
3. days_changed ให้คำนวณจาก original_completion_date ถึง new_completion_date ถ้าทำได้
4. ถ้าเห็น signature line หรือคำว่า "ลงนาม" / "Signed" พร้อมชื่อ ให้ถือว่า signed = true
5. confidence_score ต้องสะท้อนความมั่นใจจริงๆ — ถ้าข้อมูลไม่ชัดให้ใส่ค่าต่ำ`

export interface ExtractionResult {
  changeOrder: Omit<ChangeOrder, 'id' | 'document_id' | 'created_at'>
  inputTokens: number
  outputTokens: number
  elapsedMs: number
}

export async function extractChangeOrder(pdfText: string): Promise<ExtractionResult> {
  const client = getAnthropicClient()
  const startTime = Date.now()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    tools: [EXTRACTION_TOOL],
    tool_choice: { type: 'any' },
    messages: [
      {
        role: 'user',
        content: `กรุณาดึงข้อมูล Time Change Order จากเอกสารนี้:\n\n${pdfText}`,
      },
    ],
  })

  const elapsedMs = Date.now() - startTime
  const inputTokens = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens

  const toolUse = response.content.find((block) => block.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not return tool use response')
  }

  const extracted = toolUse.input as Record<string, unknown>

  return {
    changeOrder: {
      order_number: (extracted.order_number as string) ?? null,
      issue_date: (extracted.issue_date as string) ?? null,
      effective_date: (extracted.effective_date as string) ?? null,
      original_completion_date: (extracted.original_completion_date as string) ?? null,
      new_completion_date: (extracted.new_completion_date as string) ?? null,
      days_changed: (extracted.days_changed as number) ?? null,
      extension_type: (extracted.extension_type as 'extension' | 'reduction' | 'unknown') ?? null,
      reason: (extracted.reason as string) ?? null,
      work_details: (extracted.work_details as string) ?? null,
      conditions: (extracted.conditions as string) ?? null,
      contractor_name: (extracted.contractor_name as string) ?? null,
      project_owner: (extracted.project_owner as string) ?? null,
      approver_name: (extracted.approver_name as string) ?? null,
      contractor_signed: Boolean(extracted.contractor_signed),
      owner_signed: Boolean(extracted.owner_signed),
      approver_signed: Boolean(extracted.approver_signed),
      raw_extraction: extracted,
      confidence_score: (extracted.confidence_score as number) ?? null,
    },
    inputTokens,
    outputTokens,
    elapsedMs,
  }
}
