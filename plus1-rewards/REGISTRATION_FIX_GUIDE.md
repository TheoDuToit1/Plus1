# Registration Fix Guide

## Error
```
new row violates row-level security policy for table "members"
```

## Root Cause
The RLS (Row Level Security) policies in the database are blocking authenticated users from inserting their own member records.

## Two Solutions

### Option 1: Fix RLS Policies (Recommended - Secure)

1. Go to https://app.supabase.com
2. Select your **plus1-rewards** project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `FIX_RLS_POLICY.sql`
6. Click **Run**
7. Try registering again

**This is the proper fix** - it allows authenticated users to create their own member records while maintaining security.

---

### Option 2: Disable RLS Temporarily (Quick Fix - Development Only)

If you need to test immediately:

1. Go to https://app.supabase.com
2. Select your **plus1-rewards** project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `DISABLE_RLS_TEMP.sql`
6. Click **Run**
7. Try registering again

**Note:** This disables all row-level security on the members table. Only use for development/testing. Re-enable RLS before production.

---

## After Fix

Registration flow should work:
1. User fills form (Phone, Name, Email, Password)
2. Supabase creates auth user
3. Member record is created in database
4. User is redirected to dashboard
5. Dashboard displays their QR code

## Testing

Try registering with:
- Phone: 082 555 1234
- Name: Test User
- Email: test@example.com
- Password: TestPassword123!

Should redirect to dashboard showing QR code.
