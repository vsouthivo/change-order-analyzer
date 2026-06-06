# /deploy-check — Production Deployment Checklist

ตรวจสอบความพร้อมก่อน deploy change-order-analyzer ไป Vercel

## Checklist: Next.js + Supabase + Vercel

### Environment Variables (ต้องตั้งใน Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — https://jcclqupjibeoxeruhvig.supabase.co
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key จาก Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side เท่านั้น)
- [ ] `ANTHROPIC_API_KEY` — key จาก Anthropic console

### Code Quality
- [ ] `npm run build` ผ่านโดยไม่มี TypeScript errors
- [ ] `npm run lint` ผ่านโดยไม่มี warnings สำคัญ
- [ ] ไม่มี console.log ที่เหลือค้างใน production code

### Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ใช้ใน server-side routes เท่านั้น (ไม่มีใน client)
- [ ] `ANTHROPIC_API_KEY` ไม่ถูก expose ใน client bundle
- [ ] File upload validate MIME type ก่อน process
- [ ] File size limit 50MB enforced

### Supabase
- [ ] RLS policies เปิดอยู่บนทุก table
- [ ] Storage bucket `pdfs` สร้างแล้ว
- [ ] Migration ทั้งหมด applied แล้ว

### Vercel Configuration
- [ ] `vercel.json` มี `maxDuration: 60` สำหรับ extract route
- [ ] Framework: Next.js (auto-detected)

### Pre-deploy Commands
```bash
npm run build
npm run lint
```
