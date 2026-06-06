# /thai-review — ตรวจสอบภาษาไทยใน UI

ตรวจสอบและปรับปรุงภาษาไทยใน labels, messages, และ UI text ของ change-order-analyzer

## วิธีใช้

```
/thai-review [paste UI text หรือ component ที่ต้องการ review]
```

## สิ่งที่ตรวจสอบ

### 1. ความถูกต้องของ terminology
- "คำสั่งเปลี่ยนแปลงเวลา" (Time Change Order) — ถูกต้อง
- "วันแล้วเสร็จ" vs "วันสิ้นสุด" — ใช้ "วันแล้วเสร็จ" สำหรับ construction
- "ผู้รับเหมา" (Contractor) vs "คู่สัญญา" — ระบุให้ชัดเจน

### 2. Status Labels (ภาษาไทย)
- pending → "รอดำเนินการ"
- processing → "กำลังประมวลผล"
- completed → "สำเร็จ"
- failed → "ล้มเหลว"
- extension → "ขยายเวลา"
- reduction → "ลดเวลา"

### 3. Error Messages
- ภาษากระชับ ไม่เป็นทางการเกินไป
- บอก action ที่ user ต้องทำต่อ

### 4. โทน
- เป็นกันเอง professional
- ไม่ใช้คำศัพท์เทคนิคโดยไม่อธิบาย
