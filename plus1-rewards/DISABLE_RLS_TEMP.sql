-- =====================================================
-- TEMPORARY: DISABLE RLS FOR DEVELOPMENT
-- Run this in Supabase SQL Editor if you need immediate fix
-- =====================================================

-- Disable RLS on members table temporarily
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- You can re-enable it later with:
-- ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'members';
