-- Plus1 Rewards & Plus1 Go Database Schema
-- Project: plus1 (gcbmlxdxwakkubpldype)
-- Region: eu-west-1
-- PostgreSQL 17.6.1.084
-- Last Updated: 2026-03-29

-- NOTE: This is a reference schema. The actual database is managed via Supabase migrations.
-- See: plus1-rewards/documentation/SUPABASE_DATABASE_SCHEMA.md for complete documentation

-- CORE CONCEPT: No central users table - each role has its own table with authentication

-- ============================================================================
-- ROLE TABLES (6 Total)
-- ============================================================================
-- 1. members - Customers (includes admin role)
-- 2. partners - Shops offering cashback
-- 3. agents - Sales people recruiting partners
-- 4. insurers - Medical policy providers
-- 5. drivers - Delivery drivers for Plus1-Go
-- 6. admin - System administrators (stored in members with role='admin')

-- ============================================================================
-- AUTHENTICATION PATTERN (used in all role tables)
-- ============================================================================
-- mobile_number text UNIQUE - Phone number for login
-- pin_code text CHECK (length = 6) - 6-digit PIN
-- pin_hash text - Hashed PIN for security
-- role text - Role identifier
-- status text - Account status
-- kyc_status text - KYC verification status
-- device_token text - Push notification token

-- ============================================================================
-- KEY RELATIONSHIPS
-- ============================================================================
-- members → member_cover_plans → cover_plans → insurers
-- members → transactions ← partners
-- agents → transactions (commission tracking)
-- agents ← partner_agent_links → partners
-- members → orders → order_items → products ← partners
-- drivers → orders (delivery assignments)
-- drivers → driver_earnings (payment tracking)

-- ============================================================================
-- CASHBACK SPLIT FORMULA
-- ============================================================================
-- Total Cashback = partner.cashback_percent (3-40%)
-- System Fee = 1% (fixed)
-- Agent Commission = 1% (fixed)
-- Member Cashback = Total - 2%

-- ============================================================================
-- DELIVERY FEE SPLIT FORMULA
-- ============================================================================
-- Total Delivery Fee = calculated based on distance
-- Driver Amount = 93%
-- System Fee = 5%
-- Agent Commission = 2%

-- ============================================================================
-- COVER PLAN FUNDING LOGIC
-- ============================================================================
-- 1. Cashback goes to member_cover_plans by creation_order (1, 2, 3...)
-- 2. When plan reaches target_amount, status changes to 'active'
-- 3. Extra cashback goes to overflow_balance
-- 4. Overflow can be used for: upgrades, dependants, sponsorships

-- For actual table structures, see:
-- plus1-rewards/documentation/SUPABASE_DATABASE_SCHEMA.md
