-- =====================================================
-- ADD BALANCE COLUMN TO WALLETS TABLE
-- =====================================================

-- Add balance column to wallets table
ALTER TABLE wallets 
ADD COLUMN balance DECIMAL(10,2) DEFAULT 0 CHECK (balance >= 0);

-- Add comment to explain the column
COMMENT ON COLUMN wallets.balance IS 'Current spendable balance for this member at this shop';

-- Update existing records to set balance = rewards_total (if any exist)
UPDATE wallets SET balance = rewards_total WHERE balance IS NULL;

-- Create index for balance queries
CREATE INDEX idx_wallets_balance ON wallets(balance);

-- =====================================================
-- UPDATED WALLET STRUCTURE
-- =====================================================

/*
wallets table now has:
- id (UUID) - Primary key
- member_id (UUID) - FK to members
- shop_id (UUID) - FK to shops  
- commission_rate (DECIMAL) - Shop's commission rate
- rewards_total (DECIMAL) - Total rewards ever earned (historical)
- balance (DECIMAL) - Current spendable balance (NEW)
- policies (JSONB) - Policy funding buckets
- status (TEXT) - active/paused
- created_at (TIMESTAMP)

Key difference:
- rewards_total = lifetime earnings (never decreases)
- balance = current spendable amount (decreases when spent)
*/

-- =====================================================
-- EXAMPLE USAGE
-- =====================================================

/*
When member earns rewards:
UPDATE wallets 
SET rewards_total = rewards_total + 50.00,
    balance = balance + 50.00
WHERE member_id = ? AND shop_id = ?;

When member spends rewards:
UPDATE wallets 
SET balance = balance - 25.00
WHERE member_id = ? AND shop_id = ? AND balance >= 25.00;

Note: rewards_total stays the same when spending
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ BALANCE COLUMN ADDED TO WALLETS TABLE';
  RAISE NOTICE '✅ Index created for balance queries';
  RAISE NOTICE '✅ Check constraint ensures balance >= 0';
  RAISE NOTICE '✅ Existing records updated with balance = rewards_total';
END $$;