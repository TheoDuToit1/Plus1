# Plus1-Go Authentication & Profile Flow
**Unified System:** Same database as Plus1 Rewards

---

## Registration Flow (Minimal - Like Plus1 Rewards)

### Registration Page (`/register`)
**Only 3 fields required:**
1. **Full Name** (text input)
2. **Phone Number** (10 digits, numeric only)
3. **6-Digit PIN** (exactly 6 digits, numeric only)

**No email, no password, no address - just these 3 fields!**

### What Happens on Registration:
1. Create user in `users` table
2. Create member in `members` table
3. Create default cover plan in `member_cover_plans`
4. Generate QR code for in-store use
5. Auto-login and redirect to dashboard

---

## Login Flow (Same as Plus1 Rewards)

### Login Page (`/login`)
**Only 2 fields:**
1. **Phone Number** (10 digits)
2. **6-Digit PIN**

**No email option, no password - just phone + PIN!**

### What Happens on Login:
1. Verify phone number exists
2. Verify PIN matches
3. Create session
4. Redirect to dashboard

---

## Unified Database = Unified Accounts

### Key Principle:
**If you registered on Plus1 Rewards → You can login to Plus1-Go with same phone + PIN**

**If you registered on Plus1-Go → You can login to Plus1 Rewards with same phone + PIN**

**Same account, same wallet, same cover plan, same QR code!**

### Database Tables (Shared):
- `users` - Same user record
- `members` - Same member profile
- `member_cover_plans` - Same cover wallet
- `wallets` - Same wallet balance
- `transactions` - All transactions (in-store + online)

---

## Profile Completion Flow

### On Dashboard Load:
**Check if profile is complete:**
```typescript
const isProfileComplete = member.id_number && member.bank_account_number;

if (!isProfileComplete) {
  // Show notification banner at top of dashboard
  showNotification({
    type: 'warning',
    message: 'Complete your profile to start ordering',
    action: 'Complete Profile',
    link: '/profile'
  });
}
```

### Notification Banner (Top of Dashboard):
```
⚠️ Complete your profile to start ordering
   Missing: Bank Details, ID Number
   [Complete Profile] button
```

### Profile Page (`/profile`)
**Additional fields to complete:**

**Personal Information:**
- Full Name (already filled from registration)
- Phone Number (already filled, display only)
- Email (optional)
- ID Number (required for orders)
- Date of Birth (optional)

**Bank Details (Required for orders):**
- Bank Name (dropdown: FNB, Nedbank, Standard Bank, Absa, Capitec, etc.)
- Account Number
- Account Holder Name
- Branch Code

**Delivery Addresses (Optional - can add later):**
- Home address
- Work address
- Custom addresses

### Profile Completion Status:
```typescript
const profileStatus = {
  basic: true, // Name + Phone (from registration)
  identity: !!member.id_number, // ID Number
  banking: !!member.bank_account_number, // Bank details
  address: member.saved_addresses?.length > 0 // At least 1 address
};

const canOrder = profileStatus.basic && profileStatus.identity && profileStatus.banking;
```

---

## Order Blocking Logic

### When User Tries to Checkout:
**Before allowing checkout, check profile completion:**

```typescript
// On "Proceed to Checkout" button click
const handleCheckout = () => {
  // Check if profile is complete
  if (!member.id_number) {
    showModal({
      title: 'Complete Your Profile',
      message: 'Please add your ID Number to continue',
      icon: '⚠️',
      actions: [
        { label: 'Complete Profile', onClick: () => navigate('/profile') },
        { label: 'Cancel', variant: 'secondary' }
      ]
    });
    return;
  }

  if (!member.bank_account_number) {
    showModal({
      title: 'Complete Your Profile',
      message: 'Please add your Bank Details to continue',
      icon: '⚠️',
      actions: [
        { label: 'Complete Profile', onClick: () => navigate('/profile') },
        { label: 'Cancel', variant: 'secondary' }
      ]
    });
    return;
  }

  // Profile complete - proceed to checkout
  navigate('/checkout');
};
```

### Modal Design:
```
┌─────────────────────────────────────┐
│  ⚠️  Complete Your Profile          │
├─────────────────────────────────────┤
│                                     │
│  Please add your ID Number and      │
│  Bank Details to start ordering.    │
│                                     │
│  Missing:                           │
│  • ID Number                        │
│  • Bank Details                     │
│                                     │
│  ┌─────────────────┐  ┌──────────┐ │
│  │ Complete Profile│  │  Cancel  │ │
│  └─────────────────┘  └──────────┘ │
└─────────────────────────────────────┘
```

---

## Database Schema Updates

### Members Table (Extend Existing):
```sql
ALTER TABLE members ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bank_account_holder TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bank_branch_code TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS saved_addresses JSONB DEFAULT '[]';
ALTER TABLE members ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
```

### Profile Completion Check Function:
```sql
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completed := (
    NEW.id_number IS NOT NULL AND
    NEW.bank_account_number IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completion
BEFORE INSERT OR UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION check_profile_completion();
```

---

## User Flow Examples

### Example 1: New User on Plus1-Go
1. User visits plus1-go.com
2. Clicks "Sign up"
3. Enters: Name, Phone, 6-digit PIN
4. Lands on dashboard
5. Sees notification: "Complete your profile to start ordering"
6. Browses partners, adds items to cart
7. Clicks "Checkout"
8. **BLOCKED** - Modal appears: "Please add ID Number and Bank Details"
9. Clicks "Complete Profile"
10. Fills in ID Number and Bank Details
11. Returns to cart, clicks "Checkout"
12. **SUCCESS** - Proceeds to checkout

### Example 2: Existing Plus1 Rewards User
1. User already registered on Plus1 Rewards (has phone + PIN)
2. User visits plus1-go.com
3. Clicks "Log in"
4. Enters same phone + PIN from Plus1 Rewards
5. **SUCCESS** - Logs in (same account!)
6. Lands on dashboard
7. If profile incomplete: Sees notification
8. If profile complete: Can order immediately

### Example 3: Plus1-Go User Visits Plus1 Rewards
1. User registered on Plus1-Go
2. User visits Plus1 Rewards store
3. Scans QR code at POS
4. **SUCCESS** - Same QR code works!
5. Earns cashback to same wallet
6. Cover plan funded from both in-store and online orders

---

## Implementation Checklist

### Task 1: Database Extension
- [ ] Add new columns to `members` table (ID, bank details, etc.)
- [ ] Create profile completion trigger
- [ ] Test profile completion logic

### Task 2: Registration Page
- [ ] Create `/register` page
- [ ] 3 fields only: Name, Phone (10 digits), PIN (6 digits)
- [ ] Validation: Phone must be unique, PIN exactly 6 digits
- [ ] Create user + member + cover plan on submit
- [ ] Auto-login after registration
- [ ] Redirect to dashboard

### Task 3: Login Page
- [ ] Create `/login` page
- [ ] 2 fields only: Phone (10 digits), PIN (6 digits)
- [ ] Verify credentials against database
- [ ] Create session
- [ ] Redirect to dashboard

### Task 4: Dashboard Notification
- [ ] Check profile completion on dashboard load
- [ ] Show warning banner if incomplete
- [ ] Banner shows missing fields (ID, Bank Details)
- [ ] "Complete Profile" button navigates to `/profile`

### Task 5: Profile Page
- [ ] Display existing info (name, phone)
- [ ] Form for ID Number
- [ ] Form for Bank Details (bank name, account number, holder, branch)
- [ ] Form for delivery addresses (optional)
- [ ] Save button updates `members` table
- [ ] Show success message on save

### Task 6: Checkout Blocking
- [ ] Add profile check before checkout
- [ ] Show modal if ID Number missing
- [ ] Show modal if Bank Details missing
- [ ] "Complete Profile" button in modal
- [ ] Only allow checkout if profile complete

---

## Security Considerations

### PIN Storage:
- Store PIN as hashed value (bcrypt or similar)
- Never store plain text PIN
- Verify PIN by comparing hashes

### Phone Number:
- Validate format (10 digits, South African format)
- Check uniqueness before registration
- Consider adding OTP verification (future enhancement)

### Bank Details:
- Encrypt bank account numbers
- Only show last 4 digits in UI
- Require re-authentication to view full details

---

## Testing Scenarios

### Registration Tests:
- [ ] Register with valid data (name, 10-digit phone, 6-digit PIN)
- [ ] Try duplicate phone number (should fail)
- [ ] Try invalid phone (9 digits, 11 digits, letters)
- [ ] Try invalid PIN (5 digits, 7 digits, letters)
- [ ] Verify user created in database
- [ ] Verify member created in database
- [ ] Verify cover plan created
- [ ] Verify QR code generated

### Login Tests:
- [ ] Login with correct phone + PIN
- [ ] Try wrong PIN (should fail)
- [ ] Try non-existent phone (should fail)
- [ ] Verify session created
- [ ] Verify redirect to dashboard

### Cross-Platform Tests:
- [ ] Register on Plus1 Rewards, login on Plus1-Go (should work)
- [ ] Register on Plus1-Go, login on Plus1 Rewards (should work)
- [ ] Verify same wallet balance on both platforms
- [ ] Verify same QR code on both platforms

### Profile Completion Tests:
- [ ] New user sees notification on dashboard
- [ ] Notification disappears after completing profile
- [ ] Checkout blocked if profile incomplete
- [ ] Modal shows correct missing fields
- [ ] Checkout allowed after profile complete

---

## Summary

**Registration:** Name + Phone + 6-digit PIN (3 fields only)  
**Login:** Phone + 6-digit PIN (2 fields only)  
**Unified:** Same account works on Plus1 Rewards AND Plus1-Go  
**Profile Completion:** Required before first order (ID + Bank Details)  
**Blocking:** Modal prevents checkout until profile complete  
**Notification:** Dashboard banner reminds user to complete profile
