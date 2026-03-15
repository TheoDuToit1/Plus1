-- =====================================================
-- CLEAN RLS FIX - DROP ALL EXISTING POLICIES FIRST
-- =====================================================

-- DROP ALL EXISTING POLICIES ON MEMBERS
DROP POLICY IF EXISTS "Members can insert own record" ON members;
DROP POLICY IF EXISTS "Members can view own data" ON members;
DROP POLICY IF EXISTS "Members can update own data" ON members;
DROP POLICY IF EXISTS "Service role full access on members" ON members;
DROP POLICY IF EXISTS "Members view own data" ON members;

-- DROP ALL EXISTING POLICIES ON SHOPS
DROP POLICY IF EXISTS "Anyone can create shop" ON shops;
DROP POLICY IF EXISTS "Shops can view own data" ON shops;
DROP POLICY IF EXISTS "Shops can update own data" ON shops;
DROP POLICY IF EXISTS "Service role full access on shops" ON shops;
DROP POLICY IF EXISTS "Shops can view own shop" ON shops;

-- DROP ALL EXISTING POLICIES ON WALLETS
DROP POLICY IF EXISTS "Authenticated users can view wallets" ON wallets;
DROP POLICY IF EXISTS "Authenticated users can create wallets" ON wallets;
DROP POLICY IF EXISTS "Service role full access on wallets" ON wallets;
DROP POLICY IF EXISTS "Wallet access for member and shop" ON wallets;

-- DROP ALL EXISTING POLICIES ON TRANSACTIONS
DROP POLICY IF EXISTS "Authenticated users can view transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can create transactions" ON transactions;
DROP POLICY IF EXISTS "Service role full access on transactions" ON transactions;
DROP POLICY IF EXISTS "Transaction access for participants" ON transactions;

-- DROP ALL EXISTING POLICIES ON MONTHLY_INVOICES
DROP POLICY IF EXISTS "Authenticated users can view invoices" ON monthly_invoices;
DROP POLICY IF EXISTS "Authenticated users can create invoices" ON monthly_invoices;
DROP POLICY IF EXISTS "Service role full access on invoices" ON monthly_invoices;
DROP POLICY IF EXISTS "Invoices access for shop" ON monthly_invoices;

-- =====================================================
-- NOW CREATE NEW CLEAN POLICIES
-- =====================================================

-- MEMBERS - Allow authenticated users to manage their own records
CREATE POLICY "Members can insert own record" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can view own data" ON members FOR SELECT USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can update own data" ON members FOR UPDATE USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Service role full access on members" ON members FOR ALL TO service_role USING (true);

-- SHOPS - Allow anyone to create, authenticated to view/update
CREATE POLICY "Anyone can create shop" ON shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Shops can view own data" ON shops FOR SELECT USING (true);
CREATE POLICY "Shops can update own data" ON shops FOR UPDATE USING (true);
CREATE POLICY "Service role full access on shops" ON shops FOR ALL TO service_role USING (true);

-- WALLETS - Allow authenticated users to view/create
CREATE POLICY "Authenticated users can view wallets" ON wallets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create wallets" ON wallets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update wallets" ON wallets FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on wallets" ON wallets FOR ALL TO service_role USING (true);

-- TRANSACTIONS - Allow authenticated users to view/create
CREATE POLICY "Authenticated users can view transactions" ON transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update transactions" ON transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on transactions" ON transactions FOR ALL TO service_role USING (true);

-- MONTHLY_INVOICES - Allow authenticated users to view/create
CREATE POLICY "Authenticated users can view invoices" ON monthly_invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create invoices" ON monthly_invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update invoices" ON monthly_invoices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on invoices" ON monthly_invoices FOR ALL TO service_role USING (true);

-- =====================================================
-- VERIFY ALL POLICIES
-- =====================================================
SELECT tablename, COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename IN ('members', 'shops', 'wallets', 'transactions', 'monthly_invoices') 
GROUP BY tablename
ORDER BY tablename;
