-- Migration: initial_schema
-- Applied: 2026-06-06
-- Description: Create documents, change_orders, and extraction_logs tables

-- Documents: เก็บ metadata ของ PDF ที่อัปโหลด
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  page_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Change Orders: ข้อมูลที่ Claude extract ออกมา
CREATE TABLE IF NOT EXISTS change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

  order_number TEXT,
  issue_date DATE,
  effective_date DATE,

  original_completion_date DATE,
  new_completion_date DATE,
  days_changed INTEGER,
  extension_type TEXT CHECK (extension_type IN ('extension','reduction','unknown')),

  reason TEXT,
  work_details TEXT,
  conditions TEXT,

  contractor_name TEXT,
  project_owner TEXT,
  approver_name TEXT,
  contractor_signed BOOLEAN DEFAULT false,
  owner_signed BOOLEAN DEFAULT false,
  approver_signed BOOLEAN DEFAULT false,

  raw_extraction JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extraction Logs: สำหรับ debug และ cost tracking
CREATE TABLE IF NOT EXISTS extraction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  model TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  extraction_time_ms INTEGER,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all documents" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all change_orders" ON change_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all extraction_logs" ON extraction_logs FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
