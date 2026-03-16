-- =====================================================
-- ⚠️  DANGER: EMPTY ALL TABLES 
-- =====================================================
-- This will DELETE ALL DATA from your +1 Rewards database
-- This action is IRREVERSIBLE.
-- 
-- USE WITH EXTREME CAUTION - ONLY FOR DEVELOPMENT/TESTING
-- =====================================================

-- Disable foreign key checks temporarily (if needed)
SET session_replication_role = replica;

-- =====================================================
-- EMPTY ALL TABLES (in correct order to avoid FK conflicts)
-- =====================================================

-- Clear transaction-related tables first
TRUNCATE TABLE policy_transactions CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE monthly_invoices CASCADE;

-- Clear relationship tables
TRUNCATE TABLE policy_holders CASCADE;
TRUNCATE TABLE wallets CASCADE;

-- Clear main entity tables
TRUNCATE TABLE members CASCADE;
TRUNCATE TABLE shops CASCADE;
TRUNCATE TABLE agents CASCADE;
TRUNCATE TABLE policy_providers CASCADE;

-- Clear configuration tables (optional - uncomment if you want to clear these too)
-- TRUNCATE TABLE policy_plans CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- =====================================================
-- STORAGE BUCKETS - MANUAL CLEARING REQUIRED
-- =====================================================

-- ⚠️  STORAGE BUCKETS CANNOT BE CLEARED VIA SQL
-- You must manually clear storage buckets in Supabase Dashboard:
-- 
-- 1. Go to Storage in your Supabase dashboard
-- 2. For each bucket (avatars, documents, images, etc.):
--    - Click on the bucket
--    - Select all files (Ctrl+A or Cmd+A)
--    - Click Delete
-- 
-- OR use the Supabase JavaScript client:
-- const { data, error } = await supabase.storage.from('bucket-name').list()
-- for (const file of data) {
--   await supabase.storage.from('bucket-name').remove([file.name])
-- }

-- =====================================================
-- CLEAR AUTH USERS (OPTIONAL - UNCOMMENT IF NEEDED)
-- =====================================================

-- ⚠️  DANGER: This will delete all user accounts
-- Uncomment the lines below ONLY if you want to clear all users

-- DELETE FROM auth.users;
-- DELETE FROM auth.identities;
-- DELETE FROM auth.sessions;
-- DELETE FROM auth.refresh_tokens;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that all tables are empty
SELECT 
  schemaname,
  relname as tablename,
  n_tup_ins as "Rows"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY relname;

-- Check storage buckets (this will show bucket info, not files)
SELECT 
  id,
  name,
  created_at
FROM storage.buckets;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '🗑️  ALL DATABASE TABLES CLEARED SUCCESSFULLY';
  RAISE NOTICE '✅ Tables: members, shops, agents, wallets, transactions, etc.';
  RAISE NOTICE '⚠️  STORAGE BUCKETS: Must be cleared manually in dashboard';
  RAISE NOTICE '⚠️  This action was IRREVERSIBLE';
  RAISE NOTICE '📊 Run verification queries above to confirm';
END $$;

-- =====================================================
-- OPTIONAL: RE-INSERT SAMPLE DATA
-- =====================================================

-- Uncomment the section below if you want to re-insert basic configuration data

/*
-- Re-insert Day1 Health policy plans
INSERT INTO policy_plans (name, family, variant, adults, children, monthly_target, description) VALUES
-- Day-to-Day Plans
('day_to_day_single', 'day_to_day', 'single', 1, 0, 385.00, 'Day-to-Day Single Coverage'),
('day_to_day_couple', 'day_to_day', 'couple', 2, 0, 674.00, 'Day-to-Day Couple Coverage'),
('day_to_day_single_1child', 'day_to_day', 'single', 1, 1, 578.00, 'Day-to-Day Single + 1 Child'),
('day_to_day_single_2child', 'day_to_day', 'single', 1, 2, 771.00, 'Day-to-Day Single + 2 Children'),

-- Hospital Plans  
('hospital_single', 'hospital', 'single', 1, 0, 390.00, 'Hospital Single Coverage'),
('hospital_couple', 'hospital', 'couple', 2, 0, 780.00, 'Hospital Couple Coverage'),
('hospital_single_1child', 'hospital', 'single', 1, 1, 546.00, 'Hospital Single + 1 Child'),

-- Comprehensive Plans
('comprehensive_single', 'comprehensive', 'single', 1, 0, 665.00, 'Comprehensive Single Coverage'),
('comprehensive_couple', 'comprehensive', 'couple', 2, 0, 1330.00, 'Comprehensive Couple Coverage'),

-- Senior Plans
('senior_single', 'senior', 'single', 1, 0, 425.00, 'Senior Single Coverage'),
('senior_couple', 'senior', 'couple', 2, 0, 850.00, 'Senior Couple Coverage');

-- Re-insert Day1 Health as default provider
INSERT INTO policy_providers (
  name, email, phone, company_name, registration_number, 
  contact_person, status, commission_rate
) VALUES (
  'Day1 Health', 
  'day1health@plus1rewards.co.za', 
  '+27123456789',
  'Day1 Health (Pty) Ltd',
  '2023/123456/07',
  'Policy Administrator',
  'active',
  10.00
);
*/