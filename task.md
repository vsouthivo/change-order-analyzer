# Task Tracker: change-order-analyzer

> อัปเดตล่าสุด: 2026-06-06

---

## Phase 1: Infrastructure Setup ✓

- [x] สร้าง Next.js 15 project (TypeScript, Tailwind, App Router)
- [x] ติดตั้ง dependencies: @anthropic-ai/sdk, @supabase/supabase-js, @supabase/ssr, pdf-parse
- [x] Apply Supabase migration (tables: documents, change_orders, extraction_logs)
- [x] สร้าง Supabase Storage bucket `pdfs`
- [x] ตั้ง RLS policies สำหรับทุก table และ storage

---

## Phase 2: .claude/ Configuration ✓

- [x] สร้าง `.claude/agents/extraction-agent.md`
- [x] สร้าง `.claude/agents/review-agent.md`
- [x] สร้าง `.claude/agents/pipeline-agent.md`
- [x] สร้าง `.claude/agents/reporting-agent.md`
- [x] สร้าง `.claude/commands/` (8 commands)
- [x] สร้าง `.claude/settings.json`
- [x] สร้าง `CLAUDE.md`

---

## Phase 3: Core Implementation ✓

- [x] `types/index.ts` — TypeScript interfaces
- [x] `lib/supabase.ts` — Supabase client
- [x] `lib/anthropic.ts` — Anthropic client
- [x] `lib/pdf.ts` — PDF text extraction
- [x] `lib/extraction.ts` — Claude extraction logic
- [x] `supabase/migrations/001_initial_schema.sql`

---

## Phase 4: API Routes ✓

- [x] `app/api/upload/route.ts`
- [x] `app/api/extract/route.ts`
- [x] `app/api/documents/route.ts`
- [x] `app/api/documents/[id]/route.ts`

---

## Phase 5: UI ✓

- [x] `app/layout.tsx` — Root layout + navigation
- [x] `app/page.tsx` — Home (PDF upload)
- [x] `app/documents/page.tsx` — Document list
- [x] `app/documents/[id]/page.tsx` — Extraction result
- [x] `app/dashboard/page.tsx` — Statistics
- [x] `components/PDFUploader.tsx`
- [x] `components/ExtractionResult.tsx`
- [x] `components/ChangeOrderTable.tsx`
- [x] `components/StatusBadge.tsx`

---

## Phase 6: Deployment Prep ✓

- [x] `.env.example`
- [x] `vercel.json`
- [x] `.gitignore` (ตรวจสอบ .env.local excluded)

---

## Phase 7: GitHub ✓

- [x] `git init` (auto โดย create-next-app)
- [x] Initial commit
- [x] Push to GitHub

---

## Pending: Vercel Connection

- [ ] เข้า vercel.com → Import `change-order-analyzer` repository
- [ ] ตั้งค่า Environment Variables ทั้ง 4 ตัว
- [ ] Deploy และทดสอบ

---

## Known Issues / Future Improvements

- [ ] เพิ่ม authentication (Supabase Auth)
- [ ] รองรับ scanned PDFs ด้วย OCR integration
- [ ] Batch upload หลายไฟล์พร้อมกัน
- [ ] Email notification เมื่อ extraction เสร็จ
- [ ] Export ผล extraction เป็น Excel
