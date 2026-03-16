# Setup Policy Providers Table

## Instructions

1. **Run the SQL file in Supabase:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `CREATE_POLICY_PROVIDERS_TABLE.sql`
   - Execute the SQL

2. **What this creates:**
   - `policy_providers` table with all necessary fields
   - Proper indexes for performance
   - Row Level Security (RLS) policies
   - Auto-update triggers
   - Sample Day1 Health provider record

3. **Verify the setup:**
   - Check that the table exists in your database
   - Verify that Day1 Health provider was inserted
   - Test the admin dashboard to see the Policy Providers tab

## Table Structure

```sql
policy_providers:
- id (UUID) - Primary key
- name (TEXT) - Contact person name
- email (TEXT) - Unique login email
- phone (TEXT) - Contact number
- company_name (TEXT) - Insurance company name
- registration_number (TEXT) - Business registration
- contact_person (TEXT) - Job title/role
- status (TEXT) - active/suspended/pending
- commission_rate (DECIMAL) - Revenue share %
- bank_name, bank_account, account_holder - EFT details
- created_at, updated_at - Timestamps
```

## Admin Dashboard Features

After running this SQL, the admin dashboard will show:
- Policy Providers tab with full management
- Count of total policy providers
- Status management (active/suspended/pending)
- Full CRUD operations
- Integration with the policy system

## Next Steps

1. Run the SQL file
2. Test the admin dashboard
3. Register new policy providers via `/provider/register`
4. Manage providers through the admin interface