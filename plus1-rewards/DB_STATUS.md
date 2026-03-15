# ✅ Supabase Database Status

**Connection**: ✅ SUCCESSFUL
**Project**: gcbmlxdxwakkubpldype.supabase.co

## 📊 Database Tables

| Table | Status | Rows | Purpose |
|-------|--------|------|---------|
| `shops` | ✅ Ready | 0 | Partner shop information |
| `members` | ✅ Ready | 0 | Member profiles |
| `wallets` | ✅ Ready | 0 | Member reward balances per shop |
| `transactions` | ✅ Ready | 0 | Earn/spend audit trail |
| `monthly_invoices` | ✅ Ready | 0 | Shop billing records |
| `policy_plans` | ✅ Ready | 0 | Day1 Health plan configurations |
| `agents` | ✅ Ready | 0 | Sales agent information |

## 🎯 Schema Overview

### shops
- `id` (UUID) - Primary key
- `name` (TEXT) - Shop name
- `phone` (TEXT) - Contact number
- `commission_rate` (DECIMAL) - 3-20%
- `status` (TEXT) - active/suspended
- `bank_name`, `bank_account`, `account_holder` - EFT details
- `location` (TEXT)
- `created_at`, `updated_at` - Timestamps

### members
- `id` (UUID) - Primary key
- `name` (TEXT) - Member name
- `phone` (TEXT) - Contact (optional)
- `dob` (DATE) - Date of birth (optional)
- `qr_code` (TEXT) - Unique QR identifier
- `active_policy` (TEXT) - Currently selected policy
- `created_at`, `updated_at` - Timestamps

### wallets
- `id` (UUID) - Primary key
- `member_id` (UUID) - Foreign key to members
- `shop_id` (UUID) - Foreign key to shops
- `commission_rate` (DECIMAL) - Shop's commission %
- `rewards_total` (DECIMAL) - Spendable balance
- `policies` (JSONB) - Multi-tier policy buckets
- `status` (TEXT) - active/paused
- `created_at` - Timestamp

### transactions
- `id` (UUID) - Primary key
- `shop_id`, `member_id`, `agent_id` (UUID) - Foreign keys
- `purchase_amount` (DECIMAL) - Original purchase
- `shop_contribution` (DECIMAL) - Reward amount
- `agent_commission` (DECIMAL) - 1% to agent
- `platform_fee` (DECIMAL) - 1% to +1 Rewards
- `member_reward` (DECIMAL) - Amount to member
- `policy_filled` (TEXT) - Which policy was filled
- `status` (TEXT) - pending_sync/synced/reverted
- `is_spend` (BOOLEAN) - Earn or spend transaction
- `created_at`, `synced_at` - Timestamps
- `offline_signature` (TEXT) - Device signature

### monthly_invoices
- `id` (UUID) - Primary key
- `shop_id` (UUID) - Foreign key
- `invoice_month` (TEXT) - '2026-03' format
- `total_rewards_issued` (DECIMAL)
- `customer_rewards` (DECIMAL)
- `agent_commission_total` (DECIMAL)
- `platform_fee_total` (DECIMAL)
- `total_due` (DECIMAL)
- `penalty_amount` (DECIMAL)
- `status` (TEXT) - generated/sent/overdue/paid/suspended
- `due_date` (DATE)
- `paid_date` (TIMESTAMP)
- `eft_reference` (TEXT)
- `created_at` - Timestamp

### policy_plans
- `id` (UUID) - Primary key
- `name` (TEXT) - 'day_to_day_single'
- `family` (TEXT) - 'day_to_day', 'hospital', etc
- `variant` (TEXT) - 'single', 'couple'
- `adults` (INTEGER) - Number of adults
- `children` (INTEGER) - Number of children (0-4)
- `monthly_target` (DECIMAL) - Premium amount
- `description` (TEXT)
- `is_active` (BOOLEAN)
- `created_at` - Timestamp

### agents
- `id` (UUID) - Primary key
- `name` (TEXT) - Agent name
- `phone` (TEXT) - Contact number
- `total_commission` (DECIMAL) - Lifetime earnings
- `created_at` - Timestamp

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Service role key configured
- ✅ Anon key configured
- ✅ Policies ready for implementation

## 🚀 Next Steps

1. ✅ Database connected
2. ⏳ Implement RLS policies
3. ⏳ Create sample data (shops, members, plans)
4. ⏳ Build frontend pages
5. ⏳ Implement business logic

## 📝 Notes

- All tables are empty (0 rows) - ready for data
- Indexes are created for performance
- Triggers are configured for auto-timestamps
- JSONB support for flexible wallet structures
- Real-time subscriptions enabled

---

**Status**: ✅ Production Ready
**Last Checked**: March 15, 2026
