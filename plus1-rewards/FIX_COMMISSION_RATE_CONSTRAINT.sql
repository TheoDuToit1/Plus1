-- =====================================================
-- FIX COMMISSION_RATE NULL CONSTRAINT ERROR
-- =====================================================

-- Option 1: Make commission_rate nullable (RECOMMENDED)
-- This allows wallets to be created without immediately knowing the shop's rate
ALTER TABLE wallets 
ALTER COLUMN commission_rate DROP NOT NULL;

-- Add a default value for existing/new records
ALTER TABLE wallets 
ALTER COLUMN commission_rate SET DEFAULT 5.00;

-- Update any existing NULL values with a default rate
UPDATE wallets 
SET commission_rate = 5.00 
WHERE commission_rate IS NULL;

-- =====================================================
-- ALTERNATIVE APPROACH (if you want to keep NOT NULL)
-- =====================================================

/*
-- Option 2: Keep NOT NULL but ensure shop rate is always copied
-- This requires updating your application code to always set commission_rate

-- First, let's see what shops exist and their rates:
SELECT id, name, commission_rate FROM shops;

-- Update existing wallets with their shop's commission rate:
UPDATE wallets 
SET commission_rate = shops.commission_rate
FROM shops 
WHERE wallets.shop_id = shops.id 
  AND wallets.commission_rate IS NULL;

-- If you still get errors, it means some wallets reference non-existent shops
-- Check for orphaned wallet records:
SELECT w.id, w.member_id, w.shop_id 
FROM wallets w 
LEFT JOIN shops s ON w.shop_id = s.id 
WHERE s.id IS NULL;
*/

-- =====================================================
-- RECOMMENDED WALLET CREATION PATTERN
-- =====================================================

/*
When creating a new wallet, use this pattern:

INSERT INTO wallets (member_id, shop_id, commission_rate, rewards_total, balance)
SELECT 
  $1 as member_id,
  $2 as shop_id, 
  s.commission_rate,
  0 as rewards_total,
  0 as balance
FROM shops s 
WHERE s.id = $2;

This ensures commission_rate is always populated from the shop's current rate.
*/

-- =====================================================
-- CREATE HELPER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION create_wallet(
  p_member_id UUID,
  p_shop_id UUID
) RETURNS UUID AS $$
DECLARE
  v_wallet_id UUID;
  v_commission_rate DECIMAL(5,2);
BEGIN
  -- Get shop's current commission rate
  SELECT commission_rate INTO v_commission_rate
  FROM shops 
  WHERE id = p_shop_id;
  
  IF v_commission_rate IS NULL THEN
    RAISE EXCEPTION 'Shop not found or has no commission rate: %', p_shop_id;
  END IF;
  
  -- Create wallet with proper commission rate
  INSERT INTO wallets (member_id, shop_id, commission_rate, rewards_total, balance)
  VALUES (p_member_id, p_shop_id, v_commission_rate, 0, 0)
  ON CONFLICT (member_id, shop_id) DO NOTHING
  RETURNING id INTO v_wallet_id;
  
  -- If wallet already existed, get its ID
  IF v_wallet_id IS NULL THEN
    SELECT id INTO v_wallet_id
    FROM wallets 
    WHERE member_id = p_member_id AND shop_id = p_shop_id;
  END IF;
  
  RETURN v_wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ COMMISSION_RATE CONSTRAINT FIXED';
  RAISE NOTICE '✅ Column is now nullable with default value 5.00';
  RAISE NOTICE '✅ Helper function create_wallet() added';
  RAISE NOTICE '✅ Use create_wallet(member_id, shop_id) to safely create wallets';
END $$;