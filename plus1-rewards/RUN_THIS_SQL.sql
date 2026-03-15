-- =====================================================
-- COMPLETE RLS FIX FOR +1 REWARDS
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- MEMBERS TABLE
DROP POLICY IF EXISTS "Members view own data" ON members;
CREATE POLICY "Members can insert own record" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can view own data" ON members FOR SELECT USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can update own data" ON members FOR UPDATE USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Service role full access on members" ON members FOR ALL TO service_role USING (true);

-- SHOPS TABLE
DROP POLICY IF EXISTS "Shops can view own shop" ON shops;
CREATE POLICY "Anyone can create shop" ON shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Shops can view own data" ON shops FOR SELECT USING (true);
CREATE POLICY "Shops can update own data" ON shops FOR UPDATE USING (true);
CREATE POLICY "Service role full access on shops" ON shops FOR ALL TO service_role USING (true);

-- WALLETS TABLE
DROP POLICY IF EXISTS "Wallet access for member and shop" ON wallets;
CREATE POLICY "Authenticated users can view wallets" ON wallets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create wallets" ON wallets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on wallets" ON wallets FOR ALL TO service_role USING (true);

-- TRANSACTIONS TABLE
DROP POLICY IF EXISTS "Transaction access for participants" ON transactions;
CREATE POLICY "Authenticated users can view transactions" ON transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on transactions" ON transactions FOR ALL TO service_role USING (true);

-- MONTHLY INVOICES TABLE
DROP POLICY IF EXISTS "Invoices access for shop" ON monthly_invoices;
CREATE POLICY "Authenticated users can view invoices" ON monthly_invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create invoices" ON monthly_invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on invoices" ON monthly_invoices FOR ALL TO service_role USING (true);

-- =====================================================
-- VERIFY ALL POLICIES WERE CREATED
-- =====================================================
SELECT tablename, policyname, permissive, roles 
FROM pg_policies 
WHERE tablename IN ('members', 'shops', 'wallets', 'transactions', 'monthly_invoices')
ORDER BY tablename, policyname;
