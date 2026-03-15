-- Create policy_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS policy_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  single_price DECIMAL(10, 2) NOT NULL,
  couple_price DECIMAL(10, 2) NOT NULL,
  per_child_price DECIMAL(10, 2) NOT NULL,
  max_children INTEGER DEFAULT 4,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE policy_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated users to read policy_plans"
  ON policy_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert Day1 Health plans
INSERT INTO policy_plans (family, plan_type, single_price, couple_price, per_child_price, max_children, status)
VALUES
  ('Day-to-Day', 'Day-to-Day', 385.00, 674.00, 193.00, 4, 'active'),
  ('Hospital', 'Hospital', 390.00, 780.00, 156.00, 4, 'active'),
  ('Comprehensive', 'Comprehensive', 665.00, 1330.00, 266.00, 4, 'active'),
  ('Senior', 'Senior', 425.00, 850.00, 0.00, 0, 'active')
ON CONFLICT DO NOTHING;
