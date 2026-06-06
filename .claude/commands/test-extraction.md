# /test-extraction — ทดสอบ Extraction

ทดสอบ Claude extraction กับ sample text หรือ PDF จริง

## วิธีใช้

```
/test-extraction [paste PDF text content ที่นี่]
```

หรือ

```
/test-extraction document_id=[uuid]
```

## สิ่งที่ทดสอบ

1. **Happy Path** — PDF สัญญาก่อสร้างมาตรฐาน
2. **Thai Language** — เอกสารภาษาไทยทั้งหมด
3. **Mixed Language** — ภาษาไทย/อังกฤษปะปน
4. **Scanned PDF** — เอกสารที่ scan มา (text quality ต่ำ)
5. **Multiple Change Orders** — PDF ที่มีหลาย change order

## Expected Output

```json
{
  "order_number": "CO-001",
  "issue_date": "2024-01-15",
  "days_changed": 30,
  "extension_type": "extension",
  "confidence_score": 0.92
}
```

## Debugging Tips

- confidence_score < 0.5 → ดู raw_extraction ใน extraction_logs
- null fields → ตรวจว่า PDF text มี section นั้นหรือไม่
- wrong dates → ตรวจ date format ใน prompt
