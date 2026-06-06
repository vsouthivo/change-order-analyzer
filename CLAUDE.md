# change-order-analyzer — Claude Code Workspace

> "อ่าน PDF สัญญาก่อสร้าง ดึงคำสั่งเปลี่ยนแปลงเวลาด้วย AI" — BoomBigNose

## โปรเจ็ค

**change-order-analyzer** คือเว็บแอปพลิเคชันที่ใช้ Claude AI ในการอ่านเอกสาร PDF ของสัญญาก่อสร้าง และดึงข้อมูลเกี่ยวกับ **คำสั่งเปลี่ยนแปลงเวลา (Time Change Order)** โดยอัตโนมัติ

---

## Tech Stack

| เลเยอร์ | เครื่องมือ |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| AI / LLM | Claude claude-sonnet-4-6 (tool use) |
| Database | Supabase PostgreSQL (project: `jcclqupjibeoxeruhvig`) |
| Storage | Supabase Storage (bucket: `pdfs`) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Extraction Schema

ข้อมูลที่ extract จาก Time Change Order ใน PDF:

| Field | ประเภท | คำอธิบาย |
|---|---|---|
| `order_number` | string | เลขที่คำสั่งเปลี่ยนแปลง |
| `issue_date` | date | วันที่ออกคำสั่ง |
| `effective_date` | date | วันที่มีผล |
| `original_completion_date` | date | วันแล้วเสร็จเดิม |
| `new_completion_date` | date | วันแล้วเสร็จใหม่ |
| `days_changed` | integer | จำนวนวัน (+ขยาย, -ลด) |
| `extension_type` | enum | extension/reduction/unknown |
| `reason` | text | เหตุผลที่ขอเปลี่ยนแปลง |
| `work_details` | text | รายละเอียดงาน |
| `conditions` | text | เงื่อนไข |
| `contractor_name` | string | ชื่อผู้รับเหมา |
| `project_owner` | string | เจ้าของโครงการ |
| `approver_name` | string | ผู้อนุมัติ |
| `*_signed` | boolean | สถานะลายเซ็น |
| `confidence_score` | float | ความเชื่อมั่น 0.0-1.0 |

---

## หลักการทำงาน

1. **Production-first** — error handling, logging ใน `extraction_logs`
2. **Thai-first** — รองรับเอกสารภาษาไทย ทั้ง ค.ศ. และ พ.ศ.
3. **Transparency** — แสดง confidence_score และ raw_extraction เสมอ
4. **No hallucination** — ถ้าไม่มีข้อมูล return null ไม่สร้างข้อมูลเอง

---

## Agents

| Agent | บทบาท |
|---|---|
| `extraction-agent` | ออกแบบ extraction prompt และ schema |
| `review-agent` | ตรวจสอบ QA และ flag errors |
| `pipeline-agent` | Backend pipeline, Supabase, error handling |
| `reporting-agent` | Export, dashboard metrics, summaries |

---

## Slash Commands

| คำสั่ง | วัตถุประสงค์ |
|---|---|
| `/extract-review` | ตรวจ extraction quality |
| `/schema-update` | เพิ่ม/ปรับ extraction fields |
| `/batch-process` | ออกแบบ batch processing |
| `/test-extraction` | ทดสอบ extraction กับ sample |
| `/deploy-check` | Checklist ก่อน deploy |
| `/debug-extraction` | Debug extraction failures |
| `/daily-brief` | สถานะงานประจำวัน |
| `/thai-review` | ตรวจสอบภาษาไทยใน UI |

---

## Coding Standards

- **TypeScript strict** — ไม่ใช้ `any`
- **Server vs Client** — service_role key ใช้ใน server routes เท่านั้น
- **Error handling** — ทุก API route มี try/catch + log ใน `extraction_logs`
- **File validation** — ตรวจ MIME type (application/pdf) และ size (max 50MB)
- **Environment vars** — ไม่ hardcode keys ใดๆ

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://jcclqupjibeoxeruhvig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ANTHROPIC_API_KEY=<anthropic key>
```

---

## Key Files

| ไฟล์ | หน้าที่ |
|---|---|
| `lib/extraction.ts` | Claude tool use + extraction prompt |
| `lib/supabase.ts` | Supabase client (browser + server) |
| `app/api/upload/route.ts` | PDF upload handler |
| `app/api/extract/route.ts` | Trigger Claude extraction |
| `app/page.tsx` | Home — PDF upload UI |
| `app/documents/[id]/page.tsx` | Extraction result detail |
