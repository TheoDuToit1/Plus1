-- =====================================================
-- ADD EMAIL FIELD TO SHOPS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add email column to shops table
ALTER TABLE shops ADD COLUMN email TEXT UNIQUE;

-- Add constraint to ensure email is valid
ALTER TABLE shops ADD CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'shops' AND column_name = 'email';

-- =====================================================
-- SUCCESS
-- =====================================================
-- Email column added to shops table
-- You can now register shops with email addresses
