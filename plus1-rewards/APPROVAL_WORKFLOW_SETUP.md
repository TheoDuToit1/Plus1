# Shop & Agent Approval Workflow Implementation

## Overview
This document outlines the implementation of the approval workflow for shops and agents in the +1 Rewards platform. All new registrations now require admin approval before becoming active.

## Database Changes

### 1. Status Support
- **Shops**: Updated to support `pending`, `active`, and `suspended` statuses
- **Agents**: Added status column with `pending`, `active`, and `suspended` support
- **Default Status**: All new registrations default to `pending`

### 2. Approval Tracking
- Added `approved_at` timestamp columns to track when approval occurred
- Added `approved_by` text columns to track which admin approved the application

### 3. SQL Script
Run the `ADD_PENDING_STATUS_SUPPORT.sql` script to update your database schema:

```sql
-- This script adds:
-- 1. Pending status support for shops and agents
-- 2. Approval tracking columns
-- 3. Performance indexes
-- 4. Data migration for existing records
```

## Registration Flow Changes

### Shop Registration (`ShopRegister.tsx`)
- **Step 1**: Business Information (name, address, contact details)
- **Step 2**: Contact & Banking Details (email, bank name, account holder, account number)
- **Step 3**: Commission Setup & Agreement (1-40% commission rate, agreement upload)
- **Status**: New shops are created with `status: 'pending'`
- **User Feedback**: "Registration submitted successfully! Your application is pending admin approval."

### Agent Registration (`AgentRegister.tsx`)
- **Step 1**: Personal Information (name, phone, email, ID number)
- **Step 2**: Documentation & Agreement (ID document upload, agreement signing)
- **Status**: New agents are created with `status: 'pending'`
- **User Feedback**: "Registration submitted successfully! Your application is pending admin approval."

## Admin Dashboard Changes

### Shops Management (`ShopsPage.tsx`)
- **New Stats Card**: "Pending Approval" showing count of pending shops
- **Status Indicators**: Color-coded status badges (green=active, yellow=pending, red=suspended)
- **Approval Actions**: For pending shops:
  - ✅ Approve button (sets status to 'active', records approval timestamp)
  - ❌ Reject button (sets status to 'suspended')
- **Regular Actions**: For active/suspended shops:
  - 👁️ View Details
  - ✏️ Edit Shop
  - 🚫 Suspend Shop

### Agents Management (`AgentsPage.tsx`)
- **New Stats Card**: "Pending Approval" showing count of pending agents
- **Status Indicators**: Color-coded status badges (green=active, yellow=pending, red=suspended)
- **Approval Actions**: For pending agents:
  - ✅ Approve button (sets status to 'active', records approval timestamp)
  - ❌ Reject button (sets status to 'suspended')
- **Regular Actions**: For active/suspended agents:
  - 👁️ View Details
  - ✏️ Edit Agent
  - 🚫 Suspend Agent

## Commission Rate Updates
- **Previous Limit**: 1-10%
- **New Limit**: 1-40%
- **Slider**: Updated with proper scaling and labels

## Security & Access Control
- Only admin users can approve/reject applications
- Approval actions are logged with timestamp and admin identifier
- Pending users cannot access shop/agent dashboards until approved

## User Experience
1. **Registration**: Users complete multi-step registration forms
2. **Submission**: Applications are submitted with pending status
3. **Notification**: Users receive confirmation that approval is required
4. **Admin Review**: Admins see pending applications in dashboard
5. **Approval**: Admins can approve or reject with one click
6. **Activation**: Approved users can access their respective dashboards

## Next Steps
1. Run the database migration script
2. Test the registration flows
3. Test the admin approval process
4. Set up email notifications for approval status changes (future enhancement)
5. Add bulk approval actions for multiple applications (future enhancement)

## Files Modified
- `plus1-rewards/src/pages/ShopRegister.tsx` - 3-step registration with Supabase integration
- `plus1-rewards/src/pages/AgentRegister.tsx` - Supabase integration with pending status
- `plus1-rewards/src/components/dashboard/pages/ShopsPage.tsx` - Approval functionality
- `plus1-rewards/src/components/dashboard/pages/AgentsPage.tsx` - Approval functionality
- `plus1-rewards/ADD_PENDING_STATUS_SUPPORT.sql` - Database schema updates

## Files Created
- `plus1-rewards/ADD_PENDING_STATUS_SUPPORT.sql` - Database migration script
- `plus1-rewards/APPROVAL_WORKFLOW_SETUP.md` - This documentation file