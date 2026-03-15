-- =====================================================
-- FIX RLS POLICIES FOR MONTHLY INVOICES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Invoices access for shop" ON monthly_invoices;

-- Create new policies
CREATE POLICY "Authenticated users can view invoices" ON monthly_invoices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create invoices" ON monthly_invoices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update invoices" ON monthly_invoices
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access on invoices" ON monthly_invoices
  FOR ALL TO service_role USING (true);

-- =====================================================
-- CREATE TEST INVOICE (Optional - for testing)
-- =====================================================

-- First, get a shop ID (replace with actual shop ID from your database)
-- SELECT id FROM shops LIMIT 1;

-- Then uncomment and run this to create a test invoice:
/*
INSERT INTO monthly_invoices (
  shop_id,
  invoice_month,
  total_rewards_issued,
  customer_rewards,
  agent_commission_total,
  platform_fee_total,
  total_due,
  penalty_amount,
  status,
  due_date,
  eft_reference
) VALUES (
  'YOUR_SHOP_ID_HERE',
  '2026-03',
  2450.00,
  2205.00,
  24.50,
  24.50,
  2450.00,
  0,
  'sent',
  '2026-03-31',
  'SHOP-A-MAR26'
);
*/

-- =====================================================
-- VERIFY POLICIES
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'monthly_invoices';
