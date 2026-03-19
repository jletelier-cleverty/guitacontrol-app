-- Migration: Parser Infalible tables
-- Run this in Supabase SQL Editor

-- Table: bank_formats (auto-learning)
CREATE TABLE IF NOT EXISTS bank_formats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  fingerprint_keywords text[] NOT NULL,
  column_mapping jsonb NOT NULL DEFAULT '{}',
  date_format text,
  source_type text,
  sample_headers text[],
  times_used int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: import_logs (debug without seeing private data)
CREATE TABLE IF NOT EXISTS import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  file_name text,
  detected_bank text,
  parser_used text,
  transactions_found int,
  success boolean,
  error_message text,
  text_preview text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE bank_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- bank_formats: readable by all authenticated users, insertable by edge function (service role) and authenticated
CREATE POLICY "bank_formats_read" ON bank_formats FOR SELECT TO authenticated USING (true);
CREATE POLICY "bank_formats_insert" ON bank_formats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "bank_formats_update" ON bank_formats FOR UPDATE TO authenticated USING (true);

-- import_logs: users can only see their own logs
CREATE POLICY "import_logs_read_own" ON import_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "import_logs_insert" ON import_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Index for fingerprint matching
CREATE INDEX IF NOT EXISTS idx_bank_formats_keywords ON bank_formats USING gin(fingerprint_keywords);
CREATE INDEX IF NOT EXISTS idx_import_logs_user ON import_logs(user_id, created_at DESC);
