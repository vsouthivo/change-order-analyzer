# /schema-update — อัปเดต Extraction Schema

เพิ่มหรือปรับ fields ที่ Claude extract จาก PDF และ sync กับ database schema

## วิธีใช้

```
/schema-update [อธิบาย field ใหม่ที่ต้องการ]
```

ตัวอย่าง:
- `/schema-update เพิ่ม field "project_name" และ "contract_value"`
- `/schema-update เปลี่ยน extension_type ให้รองรับ 'partial' ด้วย`

## สิ่งที่ต้องอัปเดต

1. **`lib/extraction.ts`** — เพิ่ม field ใน EXTRACTION_TOOL input_schema
2. **`types/index.ts`** — อัปเดต TypeScript interface
3. **Supabase Migration** — สร้าง ALTER TABLE statement ใหม่
4. **`app/documents/[id]/page.tsx`** — แสดง field ใหม่ใน UI

## Template Migration

```sql
ALTER TABLE change_orders ADD COLUMN [field_name] [TYPE];
```

ใช้ `mcp__claude_ai_Supabase__apply_migration` เพื่อ apply
