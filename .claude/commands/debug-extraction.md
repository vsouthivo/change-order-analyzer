# /debug-extraction — Debug Extraction Failures

Debug เมื่อ extraction fail หรือให้ผลไม่ถูกต้อง

## วิธีใช้

```
/debug-extraction [document_id หรือ error message]
```

## Common Issues และวิธีแก้

### 1. PDF text extraction ว่างเปล่า
**สาเหตุ:** PDF เป็น image-based (scanned) ไม่มี text layer
**แก้:** บอก user ว่าต้องใช้ OCR ก่อน — แนะนำ Adobe Acrobat หรือ Google Drive

### 2. Claude ตอบว่า "ไม่พบข้อมูล"
**สาเหตุ:** Document ไม่ใช่ change order หรือ format ต่างจาก training
**แก้:** ดู raw PDF text, ปรับ system prompt ให้ครอบคลุม format นั้น

### 3. Date format ผิด
**สาเหตุ:** เอกสารใช้ พ.ศ. แต่ model extract เป็น ค.ศ.
**แก้:** เพิ่มใน prompt: "แปลง พ.ศ. เป็น ค.ศ. โดยลบ 543"

### 4. confidence_score ต่ำ (< 0.6)
**สาเหตุ:** ข้อมูลขัดแย้งกัน หรือ text ไม่ชัดเจน
**แก้:** ตรวจ raw_extraction, flag สำหรับ manual review

### 5. Timeout ใน Vercel
**สาเหตุ:** PDF ใหญ่เกินไป หรือ Claude response ช้า
**แก้:** ตั้ง `maxDuration: 60` ใน `vercel.json`

## Debug Steps

1. ดู `extraction_logs` table สำหรับ error_message
2. ตรวจ `raw_extraction` JSONB field
3. ดู Vercel function logs
4. ทดสอบด้วย `/test-extraction` กับ text extract จาก PDF นั้น
