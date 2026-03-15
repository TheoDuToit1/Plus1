# Complete RLS Fix for +1 Rewards

## Issue
Pages are redirecting to homepage or showing "No data" because RLS policies are blocking queries.

## Solution: Run All RLS Fixes

Run these SQL files in order in your Supabase SQL Editor:

### 1. Fix Members Table
**File:** `FIX_RLS_POLICY.sql`
- Allows members to create their own records
- Allows members to view/update their own data

### 2. Fix Shops Table
**File:** `FIX_SHOPS_RLS.sql`
- Allows anyone to create shop records
- Allows shops to view/update their data

### 3. Fix All Tables (Recommended)
**File:** `FIX_ALL_RLS.sql`
- Fixes members, shops, wallets, transactions all at once
- Most comprehensive fix

### 4. Fix Invoices Table
**File:** `FIX_INVOICES_RLS.sql`
- Allows authenticated users to view invoices
- Allows authenticated users to create/update invoices

## Quick Fix (Copy & Paste)

Go to Supabase SQL Editor and run this:

```sql
-- Fix all RLS policies at once

-- MEMBERS
DROP POLICY IF EXISTS "Members view own data" ON members;
CREATE POLICY "Members can insert own record" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can view own data" ON members FOR SELECT USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Members can update own data" ON members FOR UPDATE USING (auth.role() = 'authenticated' AND id = auth.uid());
CREATE POLICY "Service role full access on members" ON members FOR ALL TO service_role USING (true);

-- SHOPS
DROP POLICY IF EXISTS "Shops can view own shop" ON shops;
CREATE POLICY "Anyone can create shop" ON shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Shops can view own data" ON shops FOR SELECT USING (true);
CREATE POLICY "Shops can update own data" ON shops FOR UPDATE USING (true);
CREATE POLICY "Service role full access on shops" ON shops FOR ALL TO service_role USING (true);

-- WALLETS
DROP POLICY IF EXISTS "Wallet access for member and shop" ON wallets;
CREATE POLICY "Authenticated users can view wallets" ON wallets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create wallets" ON wallets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on wallets" ON wallets FOR ALL TO service_role USING (true);

-- TRANSACTIONS
DROP POLICY IF EXISTS "Transaction access for participants" ON transactions;
CREATE POLICY "Authenticated users can view transactions" ON transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on transactions" ON transactions FOR ALL TO service_role USING (true);

-- INVOICES
DROP POLICY IF EXISTS "Invoices access for shop" ON monthly_invoices;
CREATE POLICY "Authenticated users can view invoices" ON monthly_invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create invoices" ON monthly_invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Service role full access on invoices" ON monthly_invoices FOR ALL TO service_role USING (true);

-- Verify
SELECT tablename, COUNT(*) as policy_count FROM pg_policies WHERE tablename IN ('members', 'shops', 'wallets', 'transactions', 'monthly_invoices') GROUP BY tablename;
```

## After Running SQL

1. **Refresh your browser** (Ctrl+F5 or Cmd+Shift+R)
2. **Clear localStorage** (DevTools → Application → Storage → Clear All)
3. **Log in again** to your shop account
4. **Click "VIEW MONTHLY INVOICE"** button

## If Still Not Working

### Check 1: Verify You're Logged In
- Open DevTools → Application → localStorage
- Look for `currentShop` key
- Should contain: `{"id":"...", "name":"...", "phone":"..."}`

### Check 2: Verify Shop Has Bank Details
In SQL Editor, run:
```sql
SELECT id, name, bank_name, bank_account, account_holder FROM shops WHERE id = 'YOUR_SHOP_ID';
```

### Check 3: Create Test Invoice
```sql
-- Get your shop ID first
SELECT id FROM shops LIMIT 1;

-- Then insert test invoice (replace YOUR_SHOP_ID)
INSERT INTO monthly_invoices (
  shop_id, invoice_month, total_rewards_issued, customer_rewards,
  agent_commission_total, platform_fee_total, total_due, penalty_amount,
  status, due_date, eft_reference
) VALUES (
  'YOUR_SHOP_ID', '2026-03', 2450.00, 2205.00, 24.50, 24.50,
  2450.00, 0, 'sent', '2026-03-31', 'SHOP-A-MAR26'
);
```

### Check 4: Verify RLS Policies
```sql
SELECT tablename, policyname, permissive FROM pg_policies 
WHERE tablename IN ('members', 'shops', 'wallets', 'transactions', 'monthly_invoices')
ORDER BY tablename;
```

Should show multiple policies for each table.

## Expected Result

After fixes:
- ✅ Shop login works
- ✅ Shop dashboard loads
- ✅ "VIEW MONTHLY INVOICE" button works
- ✅ Invoice page displays with data
- ✅ Can copy payment info
- ✅ Previous invoices show

## Support

If issues persist:
1. Check browser console for errors (F12)
2. Check Supabase logs for RLS violations
3. Verify all SQL ran without errors
4. Make sure you're using correct shop ID
