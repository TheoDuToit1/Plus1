-- =====================================================
-- CREATE POLICY PROVIDERS TABLE
-- =====================================================

-- 1. POLICY PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS policy_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (length(phone) >= 10 AND length(phone) <= 15),
  company_name TEXT NOT NULL CHECK (length(company_name) >= 2 AND length(company_name) <= 100),
  registration_number TEXT,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  bank_name TEXT,
  bank_account TEXT,
  account_holder TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_policy_providers_status ON policy_providers(status);
CREATE INDEX IF NOT EXISTS idx_policy_providers_email ON policy_providers(email);

-- 3. RLS POLICIES
ALTER TABLE policy_providers ENABLE ROW LEVEL SECURITY;

-- Policy providers can see their own data
DROP POLICY IF EXISTS "Policy providers view own data" ON policy_providers;
CREATE POLICY "Policy providers view own data" ON policy_providers
  FOR ALL USING (auth.role() = 'authenticated' AND 
                 email = auth.jwt() ->> 'email');

-- 4. TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_policy_providers_updated_at ON policy_providers;
CREATE TRIGGER update_policy_providers_updated_at BEFORE UPDATE ON policy_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. SAMPLE DATA - Insert Day1 Health as default provider
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

-- Success message
SELECT 'Policy Providers table created successfully!' as result;