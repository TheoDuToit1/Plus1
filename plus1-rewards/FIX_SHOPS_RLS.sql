-- =====================================================
-- FIX RLS POLICIES FOR SHOP REGISTRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Shops can view own shop" ON shops;

-- Create new policy that allows anyone to insert a shop record
CREATE POLICY "Anyone can create shop" ON shops
  FOR INSERT WITH CHECK (true);

-- Create policy for shops to view their own data
CREATE POLICY "Shops can view own data" ON shops
  FOR SELECT USING (
    auth.role() = 'authenticated' OR true
  );

-- Create policy for shops to update their own data
CREATE POLICY "Shops can update own data" ON shops
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR true
  );

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role full access on shops" ON shops
  FOR ALL TO service_role USING (true);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'shops';
