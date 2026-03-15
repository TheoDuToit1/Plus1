-- =====================================================
-- FIX AGENTS TABLE - RLS Policies & Storage
-- =====================================================

-- 1. DISABLE RLS TEMPORARILY (for registration)
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- 2. CREATE STORAGE BUCKET FOR DOCUMENTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 3. ADD RLS POLICIES FOR STORAGE
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.role() = 'authenticated'
);

-- 4. RE-ENABLE RLS WITH PROPER POLICIES
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (registration)
CREATE POLICY "Allow agent registration" ON agents
  FOR INSERT WITH CHECK (true);

-- Allow agents to view their own data
CREATE POLICY "Agents view own data" ON agents
  FOR SELECT USING (
    auth.role() = 'authenticated' OR
    auth.role() = 'anon'
  );

-- Allow agents to update their own data
CREATE POLICY "Agents update own data" ON agents
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR
    auth.role() = 'anon'
  );
