-- =====================================================
-- FIX RLS POLICIES FOR MEMBER REGISTRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Members view own data" ON members;

-- Create new policy that allows authenticated users to insert their own record
CREATE POLICY "Members can insert own record" ON members
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

-- Create policy for members to view their own data
CREATE POLICY "Members can view own data" ON members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

-- Create policy for members to update their own data
CREATE POLICY "Members can update own data" ON members
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role full access on members" ON members
  FOR ALL TO service_role USING (true);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'members';
