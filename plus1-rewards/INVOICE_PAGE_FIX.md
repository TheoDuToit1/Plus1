# Shop Invoice Page Fix

## Problem
The "VIEW MONTHLY INVOICE" button takes you to the invoice page, but it either shows "No invoice available" or redirects to homepage.

## Root Cause
1. **RLS Policy Issue** - The `monthly_invoices` table RLS policy is blocking queries
2. **No Test Data** - There are no invoices in the database yet

## Solution

### Step 1: Fix RLS Policy

1. Go to https://app.supabase.com
2. Select **plus1-rewards** project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the contents of `FIX_INVOICES_RLS.sql`
5. Click **Run**

This will:
- Fix RLS policies on `monthly_invoices` table
- Allow authenticated users to view/create invoices

### Step 2: Create Test Invoice (Optional)

After fixing RLS, you can create a test invoice:

1. In SQL Editor, run this query (replace `YOUR_SHOP_ID_HERE` with actual shop ID):

```sql
-- First, get your shop ID
SELECT id, name FROM shops LIMIT 1;

-- Then insert test invoice (use the shop ID from above)
INSERT INTO monthly_invoices (
  shop_id,
  invoice_month,
  total_rewards_issued,
  customer_rewards,
  agent_commission_total,
  platform_fee_total,
  total_due,
  penalty_amount,
  status,
  due_date,
  eft_reference
) VALUES (
  'YOUR_SHOP_ID_HERE',
  '2026-03',
  2450.00,
  2205.00,
  24.50,
  24.50,
  2450.00,
  0,
  'sent',
  '2026-03-31',
  'SHOP-A-MAR26'
);
```

### Step 3: Test Invoice Page

1. Go to shop dashboard
2. Click "VIEW MONTHLY INVOICE"
3. Should now display the invoice with:
   - Total due: R2,450.00
   - Status: Sent
   - Commission breakdown
   - EFT payment details
   - Copy payment info button

## What the Invoice Page Shows

- **Current Month Invoice**
  - Total due amount
  - Due date
  - Status (Generated/Sent/Overdue/Paid/Suspended)
  - Penalty if applicable

- **Commission Breakdown**
  - Agent Commission (1%)
  - Platform Fee (1%)
  - Customer Rewards (98%)

- **EFT Payment Details**
  - Bank name
  - Account number
  - Account holder
  - Reference number
  - Copy to clipboard button

- **Previous Invoices**
  - Last 3 months history
  - Status for each

## Troubleshooting

If invoice page still doesn't work:

1. **Check localStorage** - Make sure you're logged in as a shop
   - Open browser DevTools → Application → localStorage
   - Look for `currentShop` key
   - Should have shop ID, name, phone

2. **Check RLS policies** - Run this to verify:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'monthly_invoices';
   ```
   Should show 4 policies (view, create, update, service role)

3. **Check shop data** - Make sure shop has bank details:
   ```sql
   SELECT id, name, bank_name, bank_account, account_holder FROM shops;
   ```

## Next Steps

Once invoices are working:
- Invoices auto-generate on Day 28
- Shops can view and pay
- Payment status updates automatically
- Suspension triggers on Day 7 non-payment
