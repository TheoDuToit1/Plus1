-- Quick setup for Policy Providers table
-- Run this in your Supabase SQL Editor

-- Create the policy_providers table
CREATE TABLE IF NOT EXISTS policy_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  bank_name TEXT,
  bank_account TEXT,
  account_holder TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE policy_providers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY IF NOT EXISTS "Policy providers can view own data" ON policy_providers
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert Day1 Health as sample provider
INSERT INTO policy_providers (
  name, email, phone, company_name, registration_number, 
  contact_person, status, commission_rate
) VALUES (
  'Day1 Health Admin', 
  'day1health@plus1rewards.co.za', 
  '+27123456789',
  'Day1 Health (Pty) Ltd',
  '2023/123456/07',
  'Policy Administrator',
  'active',
  10.00
) ON CONFLICT (email) DO NOTHING;

-- Insert a few more sample providers for testing
INSERT INTO policy_providers (
  name, email, phone, company_name, contact_person, status, commission_rate
) VALUES 
(
  'Discovery Health Rep', 
  'partnerships@discovery.co.za', 
  '+27119871000',
  'Discovery Health Medical Scheme',
  'Partnership Manager',
  'active',
  8.50
),
(
  'Momentum Health Contact', 
  'corporate@momentum.co.za', 
  '+27115551234',
  'Momentum Health Solutions',
  'Corporate Sales',
  'pending',
  9.00
),
(
  'Bonitas Medical Rep', 
  'business@bonitas.co.za', 
  '+27115559876',
  'Bonitas Medical Fund',
  'Business Development',
  'active',
  7.75
)
ON CONFLICT (email) DO NOTHING;

-- Verify the data was inserted
SELECT 
  name, 
  company_name, 
  status, 
  commission_rate,
  created_at
FROM policy_providers 
ORDER BY created_at DESC;