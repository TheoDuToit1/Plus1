# Agent Registration Setup - Complete Instructions

## Step 1: Run Database Migration

In Supabase SQL Editor, run **UPDATE_AGENTS_TABLE.sql** first:
- Adds new columns to agents table
- Updates existing agents with defaults
- Creates email index

## Step 2: Fix RLS & Create Storage

In Supabase SQL Editor, run **FIX_AGENTS_RLS.sql**:
- Disables RLS temporarily
- Creates 'documents' storage bucket
- Adds storage RLS policies
- Re-enables agents table RLS with proper policies
- Allows registration without authentication

## What This Fixes

✅ **406 Error** - RLS policy now allows registration queries
✅ **400 Error** - Storage bucket 'documents' now exists
✅ **403 Error** - RLS policy allows unauthenticated registration

## Registration Flow

1. **Step 1: Personal Info**
   - Name, Surname, Email, Phone, Address
   - Validates email format
   - Checks phone & email uniqueness

2. **Step 2: Contract**
   - Download PDF from `/public/plus1_rewards_sales_agent_agreement.pdf`
   - Accept checkbox
   - Blocks progression until accepted

3. **Step 3: ID Upload**
   - Select document type
   - Upload image or PDF
   - Saves to `documents/agents/{phone}/{timestamp}_{filename}`
   - Creates agent record with all details

## Testing

1. Go to `/agent/register`
2. Fill in all personal information
3. Download and accept contract
4. Upload ID document
5. Should redirect to `/agent/dashboard`

## Troubleshooting

**Still getting 406 error?**
- Make sure FIX_AGENTS_RLS.sql was run
- Check that RLS is enabled on agents table

**Still getting 400 error on upload?**
- Verify 'documents' bucket exists in Storage
- Check bucket is not public

**Still getting 403 error on insert?**
- Verify "Allow agent registration" policy exists
- Check policy allows INSERT

## Files Modified

- `src/pages/AgentRegister.tsx` - 3-step registration form
- `public/plus1_rewards_sales_agent_agreement.pdf` - Contract PDF
- `UPDATE_AGENTS_TABLE.sql` - Database schema
- `FIX_AGENTS_RLS.sql` - RLS & storage setup

## Next Steps

After successful registration:
- Agent can login at `/agent/login`
- Agent dashboard at `/agent/dashboard` shows recruited shops
- Commission tracking works automatically
