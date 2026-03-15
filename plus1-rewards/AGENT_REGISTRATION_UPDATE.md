# Agent Registration Update - Complete Guide

## Overview
Updated agent registration to require full details, contract acceptance, and ID document upload.

## Database Changes

### New Fields Added to `agents` Table
```sql
- surname (TEXT, NOT NULL) - Agent's surname
- email (TEXT, UNIQUE, NOT NULL) - Agent's email address
- address (TEXT, NOT NULL) - Agent's physical address
- id_document_type (TEXT) - Type: 'passport', 'drivers_license', 'id_card'
- id_document_url (TEXT) - Storage path to uploaded ID document
- contract_signed (BOOLEAN) - Whether contract was accepted
- contract_signed_at (TIMESTAMP) - When contract was signed
```

### Migration Steps

1. **Run the migration SQL:**
   ```bash
   # In Supabase SQL Editor, run:
   ```
   See: `UPDATE_AGENTS_TABLE.sql`

2. **Verify the changes:**
   ```sql
   SELECT * FROM agents LIMIT 1;
   ```

## Frontend Changes

### AgentRegister Component - 3-Step Process

**Step 1: Personal Information**
- First Name *
- Surname *
- Email *
- Phone Number *
- Address *

**Step 2: Contract Review**
- Download contract PDF
- Accept contract checkbox
- Validates acceptance before proceeding

**Step 3: ID Document Upload**
- Select ID document type (Passport, Driver's License, ID Card)
- Upload image or PDF
- Creates agent account with all details

### File Changes
- `src/pages/AgentRegister.tsx` - Updated with 3-step form
- `public/plus1_rewards_sales_agent_agreement.pdf` - Contract PDF

## Storage Setup

### Required: Create Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Create new bucket: `documents`
3. Set to Private
4. Add RLS policy:

```sql
CREATE POLICY "Agents can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Agents can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );
```

## Validation Rules

### Email
- Must be valid email format
- Must be unique (no duplicates)

### Phone
- Must be 10-15 characters
- Must be unique (no duplicates)

### Address
- Minimum 5 characters
- Maximum 200 characters

### ID Document
- Accepted formats: Image (JPG, PNG) or PDF
- Required for registration completion

## Login Update

AgentLogin now uses phone + password (unchanged):
- Phone number lookup
- Password authentication via Supabase Auth

## Data Flow

```
1. Agent fills personal info (Step 1)
   ↓
2. Agent downloads & accepts contract (Step 2)
   ↓
3. Agent uploads ID document (Step 3)
   ↓
4. System creates agent record with:
   - All personal details
   - ID document URL (from storage)
   - contract_signed = true
   - contract_signed_at = current timestamp
   ↓
5. Redirect to /agent/dashboard
```

## Testing Checklist

- [ ] Run UPDATE_AGENTS_TABLE.sql migration
- [ ] Create 'documents' storage bucket
- [ ] Test agent registration with all fields
- [ ] Verify contract PDF downloads
- [ ] Test ID document upload
- [ ] Verify agent record created with all fields
- [ ] Test login with new agent
- [ ] Check agent dashboard loads correctly

## Rollback (if needed)

```sql
-- Remove new columns
ALTER TABLE agents DROP COLUMN IF EXISTS surname;
ALTER TABLE agents DROP COLUMN IF EXISTS email;
ALTER TABLE agents DROP COLUMN IF EXISTS address;
ALTER TABLE agents DROP COLUMN IF EXISTS id_document_type;
ALTER TABLE agents DROP COLUMN IF EXISTS id_document_url;
ALTER TABLE agents DROP COLUMN IF EXISTS contract_signed;
ALTER TABLE agents DROP COLUMN IF EXISTS contract_signed_at;

-- Drop index
DROP INDEX IF EXISTS idx_agents_email;
```

## Notes

- Existing agents will be updated with default values during migration
- Email field uses phone@agent.local format for existing agents
- Contract PDF is served from public folder
- ID documents stored in private Supabase storage bucket
- All new fields are required for new registrations
