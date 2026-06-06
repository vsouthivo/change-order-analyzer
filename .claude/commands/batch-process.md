# /batch-process — Batch PDF Processing

ออกแบบและ implement การ process PDF หลายไฟล์พร้อมกัน

## วิธีใช้

```
/batch-process [จำนวนไฟล์ที่คาดว่าจะ process, หรือ อธิบาย use case]
```

## Architecture Options

### Option A: Sequential (current)
- Process ทีละไฟล์ — ง่าย, ไม่ติดปัญหา rate limit
- เหมาะสำหรับ < 10 files

### Option B: Concurrent with throttle
- Process 3 files พร้อมกัน ด้วย Promise.allSettled
- เหมาะสำหรับ 10-50 files

### Option C: Queue-based (n8n หรือ Supabase Edge Function)
- เหมาะสำหรับ > 50 files หรือ production scale

## Rate Limits ที่ต้องระวัง

- Claude API: 50 requests/min (Sonnet)
- Supabase Storage: upload concurrent limit
- Vercel: function timeout 60s (Pro: 300s)

## Cost Estimate

- claude-sonnet-4-6: ~$3/MTok input, ~$15/MTok output
- PDF 10 หน้า ≈ 3,000-5,000 tokens input
- ค่าใช้จ่ายต่อไฟล์ ≈ $0.01-0.02
