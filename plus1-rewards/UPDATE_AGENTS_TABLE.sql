-- =====================================================
-- UPDATE AGENTS TABLE - Add Contract & ID Fields
-- =====================================================

-- Add new columns to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS surname TEXT CHECK (length(surname) >= 2 AND length(surname) <= 100);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email TEXT UNIQUE CHECK (length(email) >= 5 AND length(email) <= 100);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS address TEXT CHECK (length(address) >= 5 AND length(address) <= 200);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS id_document_type TEXT CHECK (id_document_type IN ('passport', 'drivers_license', 'id_card'));
ALTER TABLE agents ADD COLUMN IF NOT EXISTS id_document_url TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS contract_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS contract_signed_at TIMESTAMP WITH TIME ZONE;

-- Update existing agents to have required fields (for backward compatibility)
UPDATE agents SET 
  surname = 'Agent',
  email = phone || '@agent.local',
  address = 'Not provided',
  contract_signed = FALSE
WHERE surname IS NULL;

-- Make new columns NOT NULL after setting defaults
ALTER TABLE agents ALTER COLUMN surname SET NOT NULL;
ALTER TABLE agents ALTER COLUMN email SET NOT NULL;
ALTER TABLE agents ALTER COLUMN address SET NOT NULL;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
