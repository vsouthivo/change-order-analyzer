# Project: change-order-analyzer

## วัตถุประสงค์

เว็บแอปพลิเคชันสำหรับอ่านเอกสาร PDF สัญญาก่อสร้างและดึงข้อมูล **คำสั่งเปลี่ยนแปลงเวลา (Time Change Order)** โดยอัตโนมัติด้วย Claude AI ลดเวลา manual review จากหลายชั่วโมงเหลือไม่กี่วินาที

---

## Tech Stack

| Component | Details |
|---|---|
| Framework | Next.js 15.x (App Router) |
| Language | TypeScript 5.x |
| AI Model | claude-sonnet-4-6 via Anthropic SDK |
| Database | PostgreSQL 17 via Supabase |
| Storage | Supabase Storage |
| Styling | Tailwind CSS |
| Hosting | Vercel |

---

## Supabase Configuration

| ข้อมูล | ค่า |
|---|---|
| Project ID | `jcclqupjibeoxeruhvig` |
| Organization | `vsouthivo` |
| Region | `ap-southeast-1` (Singapore) |
| URL | `https://jcclqupjibeoxeruhvig.supabase.co` |
| Storage Bucket | `pdfs` (private, max 50MB) |

### Tables

| Table | วัตถุประสงค์ |
|---|---|
| `documents` | PDF metadata และ processing status |
| `change_orders` | Extracted time change order data |
| `extraction_logs` | Model usage, tokens, timing, errors |

---

## Environment Variables

ต้องตั้งค่าใน `.env.local` (local) และ Vercel Dashboard (production):

```env
NEXT_PUBLIC_SUPABASE_URL=https://jcclqupjibeoxeruhvig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ดูจาก Supabase Dashboard → Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<ดูจาก Supabase Dashboard → Settings → API>
ANTHROPIC_API_KEY=<ดูจาก console.anthropic.com>
```

---

## Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/vsouthivo/change-order-analyzer.git
cd change-order-analyzer

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# แก้ไขค่าใน .env.local

# 4. Run development server
npm run dev
# เปิด http://localhost:3000
```

---

## Deployment (Vercel)

1. Push code ไป GitHub repository
2. เข้า vercel.com → Import Repository
3. ตั้งค่า Environment Variables ทั้ง 4 ตัว
4. Deploy (auto-detect Next.js framework)

**GitHub Repository:** `https://github.com/vsouthivo/change-order-analyzer`

---

## User Flow

```
1. User อัปโหลด PDF สัญญาก่อสร้าง
   ↓
2. System อัปโหลด PDF ไป Supabase Storage
   ↓
3. Claude อ่าน PDF text และ extract change order data
   ↓
4. ผล extraction แสดงใน structured format
   ↓
5. User ตรวจสอบและ export (JSON/CSV)
```

---

## Key Decisions

| การตัดสินใจ | เหตุผล |
|---|---|
| claude-sonnet-4-6 (ไม่ใช้ Opus) | Balance ระหว่าง quality และ cost ($3/$15 per MTok) |
| Tool use แทน JSON mode | Structured output ที่แน่นอนกว่า |
| Supabase Storage แทน local | ทำงานได้บน Vercel serverless |
| pdf-parse แทน OCR | ราคาถูกกว่า เพียงพอสำหรับ digital PDFs |

---

## Limitations

- ไม่รองรับ scanned PDFs (image-based) — ต้องใช้ OCR ก่อน
- PDF ที่มีตาราง/layout ซับซ้อนอาจได้ confidence_score ต่ำ
- File size limit: 50MB
