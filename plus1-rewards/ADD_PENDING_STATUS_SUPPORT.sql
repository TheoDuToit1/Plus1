-- =====================================================
-- ADD PENDING STATUS SUPPORT FOR SHOPS AND AGENTS
-- This script updates the database to support pending approvals
-- =====================================================

-- 1. Update shops table to support 'pending' status
ALTER TABLE shops 
DROP CONSTRAINT IF EXISTS shops_status_check;

ALTER TABLE shops 
ADD CONSTRAINT shops_status_check 
CHECK (status IN ('active', 'suspended', 'pending'));

-- Set default status to 'pending' for new registrations
ALTER TABLE shops 
ALTER COLUMN status SET DEFAULT 'pending';

-- 2. Add status column to agents table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'agents' AND column_name = 'status') THEN
        ALTER TABLE agents ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('active', 'suspended', 'pending'));
    END IF;
END $$;

-- 3. Add approved_at timestamp columns for tracking approval dates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shops' AND column_name = 'approved_at') THEN
        ALTER TABLE shops ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'agents' AND column_name = 'approved_at') THEN
        ALTER TABLE agents ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 4. Add approved_by columns to track which admin approved
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shops' AND column_name = 'approved_by') THEN
        ALTER TABLE shops ADD COLUMN approved_by TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'agents' AND column_name = 'approved_by') THEN
        ALTER TABLE agents ADD COLUMN approved_by TEXT;
    END IF;
END $$;

-- 5. Create indexes for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_shops_status_pending ON shops(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_agents_status_pending ON agents(status) WHERE status = 'pending';

-- 6. Update existing active shops/agents to have approved_at timestamp
UPDATE shops 
SET approved_at = created_at, approved_by = 'system_migration'
WHERE status = 'active' AND approved_at IS NULL;

UPDATE agents 
SET approved_at = created_at, approved_by = 'system_migration'
WHERE status = 'active' AND approved_at IS NULL;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ PENDING STATUS SUPPORT ADDED SUCCESSFULLY';
    RAISE NOTICE '✅ Shops: status now supports (active, suspended, pending)';
    RAISE NOTICE '✅ Agents: status column added with (active, suspended, pending)';
    RAISE NOTICE '✅ Approval tracking columns added (approved_at, approved_by)';
    RAISE NOTICE '✅ New registrations will default to pending status';
END $$;