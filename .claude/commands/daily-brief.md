# /daily-brief — สรุปสถานะประจำวัน

สรุปสถานะการทำงานของ change-order-analyzer

## วิธีใช้

```
/daily-brief
```

## โครงสร้าง Brief

```
## Change Order Analyzer — Daily Brief [วันที่]

### Processing Status
- 📄 Documents today: [จำนวน uploaded]
- ✓ Completed: [จำนวน]
- ⚠️ Pending: [จำนวน]  
- ✗ Failed: [จำนวน]

### Extraction Quality
- Average confidence: [score]
- Low confidence flags: [จำนวน ที่ < 0.7]

### Development
- [งานที่กำลังทำอยู่]
- [bugs ที่พบ]
- [สิ่งที่ต้องทำต่อไป]

### Priority วันนี้
1. 🔴 [สำคัญที่สุด]
2. 🟡 [ควรทำวันนี้]
3. 🟢 [ถ้ามีเวลา]
```

## Query สำหรับดึงข้อมูล (Supabase)

```sql
SELECT status, COUNT(*) FROM documents
WHERE created_at::date = CURRENT_DATE
GROUP BY status;
```
