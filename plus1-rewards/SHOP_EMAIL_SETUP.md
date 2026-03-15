# Shop Email Setup

## Error Fixed
The error "Unable to validate email address: invalid format" has been fixed by adding a proper email field to the shop registration form.

## What Changed

### ShopRegister.tsx
- Added ✉️ Email field (required)
- Email is now used for Supabase auth instead of generated email
- Email is stored in shops table

### ShopLogin.tsx
- Changed from phone-based login to email-based login
- Now uses: Email + Password
- Queries shops table by email to get shop details

## Database Migration Required

Run this SQL in your Supabase SQL Editor to add the email column:

1. Go to https://app.supabase.com
2. Select **plus1-rewards** project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the contents of `ADD_EMAIL_TO_SHOPS.sql`
5. Click **Run**

This will:
- Add `email` column to shops table
- Make email unique (no duplicate emails)
- Add email validation constraint

## Shop Registration Flow (Updated)

1. Shop owner fills form:
   - 🏪 Shop Name
   - 📱 Phone Number
   - ✉️ Email (NEW)
   - 🔒 Password
   - 💰 Commission Rate
   - 🏦 Bank details

2. System creates:
   - Supabase auth user (email + password)
   - Shop record in database

3. Shop is activated immediately

## Shop Login Flow (Updated)

1. Shop owner enters:
   - ✉️ Email
   - 🔒 Password

2. System:
   - Authenticates with Supabase auth
   - Queries shops table by email
   - Verifies shop is active
   - Redirects to dashboard

## Testing

After running the SQL migration, try:

**Register:**
- Shop Name: Test Shop
- Phone: 082 555 5555
- Email: shop@example.com (NEW)
- Password: TestPassword123!
- Commission: 10%
- Bank: FNB
- Account: 1234567890
- Holder: Test Business

**Login:**
- Email: shop@example.com
- Password: TestPassword123!

Should work without errors!
