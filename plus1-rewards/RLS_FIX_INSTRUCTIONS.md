# Fix RLS Policy for Member Registration

## Problem
Registration is failing with error: `new row violates row-level security policy for table "members"`

This is because the RLS (Row Level Security) policy is too restrictive and doesn't allow authenticated users to insert their own member records.

## Solution

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: **plus1-rewards**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `FIX_RLS_POLICY.sql`
6. Click **Run**

## What This Does
- Removes the old restrictive policy
- Creates new policies that allow:
  - Authenticated users to insert their own member record (using their auth UID)
  - Authenticated users to view their own data
  - Authenticated users to update their own data
  - Service role to have full access (for admin operations)

## After Running
- Try registering again - it should work now
- The member record will be created with the user's auth ID

## Verification
After running the SQL, you should see these policies in the output:
- Members can insert own record
- Members can view own data
- Members can update own data
- Service role full access on members
