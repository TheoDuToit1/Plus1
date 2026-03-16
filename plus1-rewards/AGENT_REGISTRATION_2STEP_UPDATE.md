# Agent Registration 2-Step Update

## Changes Made

Updated the agent registration page to be a 2-step process with improved user experience and additional identity verification options.

## New 2-Step Process

### **Step 1: Basic Information**
- Full Name *
- Email Address *
- Mobile Number *
- Password * (minimum 8 characters)

### **Step 2: Verification & Banking**
- Identity Document Type * (dropdown)
  - SA ID Number
  - Passport
  - Driver's License
- ID/Passport/License Number *
- Bank Name *
- Account Number *

## Key Features Added

### ✅ **Multi-Step Form**
- Progress indicator showing current step
- Validation at each step before proceeding
- Back button to return to previous step
- Clear step titles and descriptions

### ✅ **Identity Document Options**
- Dropdown to select ID type
- Dynamic placeholder text based on selection
- Supports SA ID, Passport, and Driver's License

### ✅ **Improved UX**
- Better visual hierarchy
- Step-by-step guidance
- Form validation with clear error messages
- Responsive design maintained

### ✅ **Database Schema Update**
- Added `id_type` column to agents table
- Check constraint for valid ID types
- Index for performance
- Backward compatibility with existing records

## Database Changes

### New Column Added:
```sql
ALTER TABLE agents 
ADD COLUMN id_type TEXT DEFAULT 'sa_id' 
CHECK (id_type IN ('sa_id', 'passport', 'drivers_license'));
```

### Updated Agents Table Structure:
```sql
agents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT UNIQUE NOT NULL,
  id_type TEXT DEFAULT 'sa_id',     -- NEW
  id_number TEXT NOT NULL,
  bank_name TEXT,
  bank_account TEXT,
  total_commission DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP
)
```

## Form Validation

### Step 1 Validation:
- All fields required
- Email format validation
- Password minimum 8 characters
- Phone number format

### Step 2 Validation:
- ID number required based on selected type
- Bank details required for payouts
- Form submission only after all validations pass

## Visual Improvements

### Progress Indicator:
- Circular step indicators (1, 2)
- Green highlight for completed steps
- Connection line between steps

### Form Layout:
- Single column layout for better mobile experience
- Clear section separation
- Consistent spacing and typography
- Better button styling and placement

## Files Modified

### 1. **AgentRegister.tsx**
- Complete rewrite with 2-step process
- Added TypeScript interfaces for form data
- Improved state management
- Better error handling

### 2. **Database Schema**
- `UPDATE_AGENTS_TABLE_ID_TYPE.sql` - Migration file
- `documentation/database.md` - Updated schema docs

## Migration Required

Run the following SQL file to update your database:
```sql
-- Execute this file in Supabase
UPDATE_AGENTS_TABLE_ID_TYPE.sql
```

## Benefits

1. **Better User Experience**: Step-by-step process reduces form overwhelm
2. **Improved Data Quality**: Better validation and required field handling
3. **Flexible ID Verification**: Supports multiple document types
4. **Professional Appearance**: Modern multi-step form design
5. **Mobile Friendly**: Responsive design works on all devices

## Testing Checklist

- [ ] Step 1 form validation works
- [ ] Step 2 form validation works
- [ ] Back button functionality
- [ ] Progress indicator updates correctly
- [ ] ID type dropdown changes placeholder text
- [ ] Database insertion with new id_type field
- [ ] Error handling for each step
- [ ] Mobile responsiveness
- [ ] Navigation to dashboard after successful registration

The agent registration process is now more professional, user-friendly, and collects all necessary information for proper identity verification and commission payouts.