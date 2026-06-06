# /extract-review — ตรวจสอบ Extraction Quality

ตรวจสอบความถูกต้องของข้อมูล Time Change Order ที่ Claude extract ออกมา

## วิธีใช้

```
/extract-review [document_id หรือ paste extracted JSON]
```

## สิ่งที่ตรวจสอบ

1. **Consistency Check** — days_changed ตรงกับ original/new completion date หรือไม่
2. **Date Validation** — issue_date <= effective_date, วันที่อยู่ใน format ถูกต้อง
3. **Signature Logic** — signed fields สอดคล้องกับ raw text
4. **Confidence Assessment** — score < 0.7 = แนะนำ manual review
5. **Missing Fields** — fields ไหนที่ควรมีแต่ไม่มี

## Output

```
## Extraction Review

✓ Verified: order_number, issue_date, days_changed
⚠️ Low Confidence: contractor_name (0.6) — ชื่อในเอกสารไม่ชัดเจน
✗ Inconsistency: days_changed=30 แต่ date diff=25 วัน

Recommendation: ตรวจสอบ contractor_name และ days_changed manually
```
