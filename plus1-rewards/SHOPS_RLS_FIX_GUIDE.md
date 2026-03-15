# Shop Registration RLS Fix

## Error
```
new row violates row-level security policy for table "shops"
```

## Root Cause
The RLS (Row Level Security) policy on the `shops` table is blocking shop registration. The original policy was too restrictive.

## Solution

### Step 1: Fix Shops RLS Policy

1. Go to https://app.supabase.com
2. Select your **plus1-rewards** project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `FIX_SHOPS_RLS.sql`
6. Click **Run**

### Step 2: Verify Fix

After running the SQL, you should see these policies:
- Anyone can create shop
- Shops can view own data
- Shops can update own data
- Service role full access on shops

### Step 3: Test Shop Registration

Try registering a shop with:
- Shop Name: Test Shop
- Phone: 082 555 5555
- Commission: 10%
- Bank: FNB
- Account: 1234567890
- Holder: Test Business

Should redirect to shop dashboard.

---

## Alternative: Disable RLS Temporarily

If you need immediate fix for testing:

1. Go to https://app.supabase.com
2. Select your **plus1-rewards** project
3. Click **SQL Editor**
4. Click **New Query**
5. Run this:
```sql
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;
```

**Note:** Only for development. Re-enable before production:
```sql
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
```

---

## What Was Fixed

**Before:** RLS policy checked for shop phone in JWT (impossible for new shops)
**After:** RLS policy allows anyone to insert shop records (proper for registration)

This allows:
- New shops to register without authentication
- Shops to view/update their own data
- Service role to manage shops (admin operations)
