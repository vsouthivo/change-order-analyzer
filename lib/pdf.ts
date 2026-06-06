// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string; numpages: number; info: unknown }>

export interface PDFParseResult {
  text: string
  pageCount: number
  info: Record<string, unknown>
}

export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  const data = await pdfParse(buffer)
  return {
    text: data.text,
    pageCount: data.numpages,
    info: data.info as Record<string, unknown>,
  }
}

export function validatePDFBuffer(buffer: Buffer): void {
  // PDF magic bytes: %PDF
  if (buffer.length < 4 || buffer.toString('ascii', 0, 4) !== '%PDF') {
    throw new Error('ไฟล์ที่อัปโหลดไม่ใช่ PDF ที่ถูกต้อง')
  }
}
