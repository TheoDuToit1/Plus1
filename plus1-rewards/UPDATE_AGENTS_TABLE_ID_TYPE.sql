-- =====================================================
-- UPDATE AGENTS TABLE - ADD ID_TYPE FIELD
-- =====================================================

-- Add id_type column to agents table
ALTER TABLE agents 
ADD COLUMN id_type TEXT DEFAULT 'sa_id' CHECK (id_type IN ('sa_id', 'passport', 'drivers_license'));

-- Update existing records to have default id_type
UPDATE agents SET id_type = 'sa_id' WHERE id_type IS NULL;

-- Add comment to explain the column
COMMENT ON COLUMN agents.id_type IS 'Type of identification document: sa_id, passport, or drivers_license';

-- Create index for id_type queries
CREATE INDEX idx_agents_id_type ON agents(id_type);

-- =====================================================
-- UPDATED AGENTS TABLE STRUCTURE
-- =====================================================

/*
agents table now has:
- id (UUID) - Primary key
- name (TEXT) - Agent full name
- email (TEXT) - Email address (if using auth)
- phone (TEXT) - Mobile number (unique)
- id_type (TEXT) - Type of ID document (NEW)
- id_number (TEXT) - ID/Passport/License number
- bank_name (TEXT) - Bank name for payouts
- bank_account (TEXT) - Account number
- total_commission (DECIMAL) - Lifetime earnings
- created_at (TIMESTAMP)
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ AGENTS TABLE UPDATED SUCCESSFULLY';
  RAISE NOTICE '✅ Added id_type column with check constraint';
  RAISE NOTICE '✅ Valid values: sa_id, passport, drivers_license';
  RAISE NOTICE '✅ Index created for id_type queries';
  RAISE NOTICE '✅ Existing records updated with default sa_id';
END $$;