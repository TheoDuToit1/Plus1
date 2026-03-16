# Balance Column Addition to Wallets Table

## Change Summary

Added a `balance` column to the `wallets` table to track current spendable rewards separately from lifetime earnings.

## New Column Details

```sql
ALTER TABLE wallets 
ADD COLUMN balance DECIMAL(10,2) DEFAULT 0 CHECK (balance >= 0);
```

## Key Differences

| Column | Purpose | Behavior |
|--------|---------|----------|
| `rewards_total` | Lifetime earnings tracker | **Never decreases** - for analytics/reporting |
| `balance` | Current spendable amount | **Decreases when spent** - for transactions |

## Usage Examples

### When Member Earns Rewards
```sql
UPDATE wallets 
SET rewards_total = rewards_total + 50.00,
    balance = balance + 50.00
WHERE member_id = ? AND shop_id = ?;
```
*Both columns increase together*

### When Member Spends Rewards
```sql
UPDATE wallets 
SET balance = balance - 25.00
WHERE member_id = ? AND shop_id = ? AND balance >= 25.00;
```
*Only balance decreases, rewards_total stays the same*

## Benefits

1. **Clear Separation**: Lifetime earnings vs current spendable amount
2. **Better Analytics**: Can track total rewards issued vs current outstanding balances
3. **Spend Validation**: Easy to check if member has sufficient balance
4. **Reporting**: Distinguish between earned rewards and available rewards

## Database Changes Made

✅ Added `balance` column with default value 0
✅ Added check constraint `balance >= 0`
✅ Created index `idx_wallets_balance` for performance
✅ Updated existing records to set `balance = rewards_total`
✅ Updated documentation in `database.md` and `DATABASE_RELATIONSHIPS.md`

## Migration File

Run `ADD_BALANCE_COLUMN.sql` to apply this change to your Supabase database.

## Updated Wallet Structure

```sql
wallets (
  id UUID PRIMARY KEY,
  member_id UUID → members.id,
  shop_id UUID → shops.id,
  commission_rate DECIMAL(5,2),
  rewards_total DECIMAL(10,2),  -- Lifetime earnings (never decreases)
  balance DECIMAL(10,2),        -- Current spendable (NEW)
  policies JSONB,
  status TEXT,
  created_at TIMESTAMP,
  UNIQUE(member_id, shop_id)
)
```

This change provides better financial tracking and makes it easier to implement spending functionality while maintaining historical earning records.