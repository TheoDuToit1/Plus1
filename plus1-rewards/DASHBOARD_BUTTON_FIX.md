# Dashboard Action Buttons Fix

## Issue
The "Upgrade Plan" button and other action buttons in the member dashboard (DashboardNew.tsx) were not working because they were missing `onClick` handlers.

## Root Cause
When migrating from `MemberDashboard.tsx` to `DashboardNew.tsx`, the button click handlers were not copied over.

## Changes Made

### 1. Added Missing Handler Functions

Added three handler functions after `handleDeclineUpgrade`:

```typescript
const handleAddDependant = () => {
  navigate('/member/add-dependant');
};

const handleSponsorSomeone = () => {
  navigate('/member/sponsor');
};
```

### 2. Fixed "Upgrade Plan" Button

**Before:**
```typescript
<button className="!bg-blue-600 !text-white p-4 rounded-lg...">
```

**After:**
```typescript
<button 
  onClick={handleUpgrade}
  disabled={Number(mainCoverPlan?.target_amount) >= 750}
  className="!bg-blue-600 !text-white p-4 rounded-lg... disabled:!bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
>
```

**Features:**
- Calls `handleUpgrade` function when clicked
- Disabled when user is already on the highest plan (R750)
- Shows gray background when disabled
- Prevents hover animation when disabled

### 3. Fixed "Add Dependant" Button

**Before:**
```typescript
<button className="!bg-teal-800 !text-white p-4 rounded-lg...">
```

**After:**
```typescript
<button 
  onClick={handleAddDependant}
  className="!bg-teal-800 !text-white p-4 rounded-lg..."
>
```

**Action:** Navigates to `/member/add-dependant`

### 4. Fixed "Sponsor Someone" Button

**Before:**
```typescript
<button className="!bg-green-700 !text-white p-4 rounded-lg...">
```

**After:**
```typescript
<button 
  onClick={handleSponsorSomeone}
  className="!bg-green-700 !text-white p-4 rounded-lg..."
>
```

**Action:** Navigates to `/member/sponsor`

### 5. Fixed "View All Plans" Button

**Before:**
```typescript
<button className="!bg-slate-600 !text-white p-4 rounded-lg...">
```

**After:**
```typescript
<button 
  onClick={() => navigate('/member/cover-plans')}
  className="!bg-slate-600 !text-white p-4 rounded-lg..."
>
```

**Action:** Navigates to `/member/cover-plans`

## Upgrade Plan Logic

The `handleUpgrade` function (already existed, just needed to be connected):

1. **Checks current plan tier:**
   - R385 → Can upgrade to R500 (costs R115)
   - R500 → Can upgrade to R750 (costs R250)
   - R750 → Already at max (button disabled)

2. **Validates overflow balance:**
   - Checks if user has enough overflow to cover upgrade cost
   - Shows alert if insufficient funds

3. **Performs upgrade:**
   - Deducts upgrade cost from overflow balance
   - Updates plan target amount
   - Sets plan to active status
   - Extends active period by 30 days
   - Records transaction in wallet entries

4. **User feedback:**
   - Shows success message with new plan amount and remaining overflow
   - Reloads dashboard data to reflect changes
   - Closes upgrade prompt modal

## Testing

Test each button:

1. **Upgrade Plan:**
   - Click button → Should show upgrade confirmation or error if insufficient funds
   - If at R750 plan → Button should be disabled and gray

2. **Add Dependant:**
   - Click button → Should navigate to `/member/add-dependant`

3. **Sponsor Someone:**
   - Click button → Should navigate to `/member/sponsor`

4. **View All Plans:**
   - Click button → Should navigate to `/member/cover-plans`

## Files Modified

- `plus1-rewards/src/pages/DashboardNew.tsx`

## Reference

Original implementation from:
- `plus1-rewards/src/pages/MemberDashboard.tsx` (lines 391-398, 720-760)

---

**Status:** ✅ Fixed  
**Date:** March 28, 2026  
**Issue:** All action buttons now functional
