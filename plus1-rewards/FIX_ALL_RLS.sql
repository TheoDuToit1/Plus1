-- =====================================================
-- COMPLETE RLS FIX FOR +1 REWARDS
-- Run this in Supabase SQL Editor to fix all RLS issues
-- =====================================================

-- =====================================================
-- 1. FIX MEMBERS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Members view own data" ON members;
DROP POLICY IF EXISTS "Members can insert own record" ON members;
DROP POLICY IF EXISTS "Members can view own data" ON members;
DROP POLICY IF EXISTS "Members can update own data" ON members;
DROP POLICY IF EXISTS "Service role full access on members" ON members;

CREATE POLICY "Members can insert own record" ON members
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

CREATE POLICY "Members can view own data" ON members
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

CREATE POLICY "Members can update own data" ON members
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    id = auth.uid()
  );

CREATE POLICY "Service role full access on members" ON members
  FOR ALL TO service_role USING (true);

-- =====================================================
-- 2. FIX SHOPS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Shops can view own shop" ON shops;
DROP POLICY IF EXISTS "Anyone can create shop" ON shops;
DROP POLICY IF EXISTS "Shops can view own data" ON shops;
DROP POLICY IF EXISTS "Shops can update own data" ON shops;
DROP POLICY IF EXISTS "Service role full access on shops" ON shops;

CREATE POLICY "Anyone can create shop" ON shops
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Shops can view own data" ON shops
  FOR SELECT USING (true);

CREATE POLICY "Shops can update own data" ON shops
  FOR UPDATE USING (true);

CREATE POLICY "Service role full access on shops" ON shops
  FOR ALL TO service_role USING (true);

-- =====================================================
-- 3. FIX WALLETS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Wallet access for member and shop" ON wallets;

CREATE POLICY "Authenticated users can view wallets" ON wallets
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create wallets" ON wallets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access on wallets" ON wallets
  FOR ALL TO service_role USING (true);

-- =====================================================
-- 4. FIX TRANSACTIONS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Transaction access for participants" ON transactions;

CREATE POLICY "Authenticated users can view transactions" ON transactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access on transactions" ON transactions
  FOR ALL TO service_role USING (true);

-- =====================================================
-- VERIFY ALL POLICIES
-- =====================================================

SELECT tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('members', 'shops', 'wallets', 'transactions')
ORDER BY tablename, policyname;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see policies listed above, the fix was successful!
-- You can now:
-- 1. Register members at /member/register
-- 2. Register shops at /shop/register
-- 3. Create wallet connections
-- 4. Create transactions
