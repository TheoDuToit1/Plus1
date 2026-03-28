# Cover Plan Overflow & Upgrade System

## Overview
When a member earns cashback, the system automatically deducts their plan amount and keeps the remainder. Overflow features only activate when the remaining balance equals or exceeds the plan amount (2x total earned).

---

## Critical System Rules

### Automatic Deduction System
**The system ALWAYS deducts the plan amount automatically when cashback is earned**

```
Member earns cashback → System deducts plan amount → Plan activated for 30 days → Remainder stays as overflow
```

### 2x Requirement for Overflow Features
**Overflow features ONLY activate when remaining balance ≥ plan amount**

**Example:**
```
Plan Cost: R500

Scenario A: Earn R500
- System deducts: R500 → Plan active
- Remaining: R0
- Status: ❌ No overflow (buttons DISABLED)

Scenario B: Earn R750
- System deducts: R500 → Plan active
- Remaining: R250
- Status: ❌ No overflow (buttons DISABLED, need R500)

Scenario C: Earn R1,000
- System deducts: R500 → Plan active
- Remaining: R500 (overflow!)
- Status: ✅ OVERFLOW ACTIVATED (buttons will activate after popups)
```

**Why 2x Requirement?**
- Member earns R1,000 total (2x plan amount)
- R500 deducted for plan activation
- R500 remains as overflow
- Ensures member has full coverage + extra funds for overflow actions

---

## Overflow Detection & Popup Sequence

### When Overflow Activates (Remaining Balance ≥ Plan Amount)
Member logs into dashboard → System detects overflow → **TWO POPUPS APPEAR IN SEQUENCE**

### Popup #1: Upgrade Your Policy
**Trigger:** Member logs in with overflow balance ≥ plan amount

**Popup Message:**
```
🎉 Congratulations! You have overflow cashback!

Current Plan: Day1 Health Basic (R500)
Plan Status: Active (30 days remaining)
Overflow Available: R500

Would you like to upgrade to a higher plan?

Upgrade Options:
→ Day1 Health Plus (R750) - Costs R250 from overflow
→ Day1 Health Premium (R1,000) - Costs R500 from overflow

✓ Yes, Upgrade My Plan
✗ No, Keep Current Plan
```

**If Member Clicks "Yes, Upgrade":**
1. Member selects new plan tier
2. System deducts upgrade cost from overflow
3. New plan activated for 30 days
4. Remaining overflow updated
5. Popup #2 appears next (profile completion)
6. Check if remaining overflow ≥ plan amount → buttons activate/deactivate accordingly

**If Member Clicks "No, Keep Current Plan":**
1. Popup #1 disappears
2. Popup #2 appears immediately (profile completion)
3. Plan remains at current tier
4. Overflow remains available for other actions

### Popup #2: Complete Your Profile
**Trigger:** Appears after Popup #1 (regardless of Yes/No choice)

**Popup Message:**
```
⚠️ Important: Complete Your Profile

We noticed your profile is incomplete. To fully activate 
your cover plan and unlock all features, please update:

Missing Information:
□ Full Name
□ ID Number
□ Physical Address
□ Email Address
□ Emergency Contact

✓ Complete Profile Now
✗ I'll Do This Later
```

**If Member Clicks "Complete Profile Now":**
1. Redirected to profile edit page
2. Form shows all missing fields highlighted
3. Member fills in required information
4. After saving → Returns to dashboard
5. **3 overflow buttons become ACTIVE** (if overflow ≥ plan amount)

**If Member Clicks "I'll Do This Later":**
1. Popup #2 disappears
2. Returns to dashboard
3. **3 overflow buttons become ACTIVE** (if overflow ≥ plan amount)
4. Profile completion reminder shows in dashboard banner
5. Popup #2 will appear again on next login

### Important: Button Activation Logic
**The 3 overflow management buttons are NOT permanently active**

**Buttons ACTIVATE when:**
- ✅ Overflow balance ≥ plan amount
- ✅ Member has seen both popups (upgrade + profile)
- ✅ Member completed popup sequence

**Buttons REMAIN DISABLED when:**
- ❌ Overflow balance < plan amount
- ❌ Member hasn't logged in since reaching overflow threshold
- ❌ Popups haven't been shown yet

**Button States After Actions:**
- After any overflow action → System checks: overflow ≥ plan amount?
- If YES → Buttons stay ACTIVE
- If NO → Buttons become DISABLED

---

## Dashboard Overflow Management Buttons

### Location
Member Dashboard → Cover Plan Section → 3 Action Buttons

### The 3 Buttons (Conditionally Active)

**Activation Requirements:**
1. Overflow balance ≥ plan amount
2. Member has completed popup sequence (seen both popups)

**Visual States:**
- **Before Overflow:** All 3 buttons DISABLED (grayed out)
- **After Overflow + Popups:** All 3 buttons ACTIVE (clickable)
- **After Using Overflow:** Buttons activate/deactivate based on remaining balance

#### 1. 🔼 Upgrade Plan
**Purpose:** Increase current plan to higher tier

**Available Upgrades:**
- Basic (R500) → Plus (R750) = R250 from overflow
- Plus (R750) → Premium (R1,000) = R250 from overflow
- Basic (R500) → Premium (R1,000) = R500 from overflow

**Process:**
1. Member clicks "Upgrade Plan"
2. Shows available upgrade options with costs
3. Member selects new plan tier
4. System deducts cost from overflow
5. New plan activated for 30 days
6. Remaining overflow updated
7. System checks: remaining overflow ≥ plan amount?
   - If YES → Buttons stay ACTIVE
   - If NO → Buttons become DISABLED

**Example:**
```
Current State:
- Plan: R500 Basic (active)
- Overflow: R500

Member upgrades to Premium (R1,000):
- Upgrade cost: R500
- System deducts: R500 from overflow
- New plan: R1,000 Premium (active for 30 days)
- Remaining overflow: R0
- Button check: R0 < R1,000 (new plan amount)
- Result: Buttons become DISABLED
```

#### 2. 👥 Add Dependant (Link Someone)
**Purpose:** Add family members to your cover plan

**How It Works:**
- Each dependant adds to your monthly plan cost
- Dependant types: Spouse, Child, Parent, Other
- Each dependant has their own cost

**Cost Structure:**
- Adult dependant: R285
- Child dependant: R150
- Senior dependant: R350

**Process:**
1. Member clicks "Add Dependant"
2. Fills in dependant details:
   - Full name
   - ID number
   - Relationship type
   - Date of birth
3. System deducts dependant cost from overflow
4. New total plan cost calculated
5. Plan activated for 30 days (covers member + dependants)
6. Remaining overflow updated
7. System checks: remaining overflow ≥ plan amount?
   - If YES → Buttons stay ACTIVE
   - If NO → Buttons become DISABLED

**Example:**
```
Current State:
- Plan: R500 (active)
- Overflow: R500

Member adds spouse (R285):
- Dependant cost: R285
- System deducts: R285 from overflow
- New plan cost: R785 (R500 + R285)
- Plan activated for 30 days (member + spouse)
- Remaining overflow: R215
- Button check: R215 < R500 (original plan amount)
- Result: Buttons become DISABLED
```

**Multiple Dependants:**
- Can add up to 5 dependants
- Each deduction checks button activation
- Buttons disable when overflow < plan amount

**Monthly Renewal:**
- System deducts total plan cost (base + all dependants) every 30 days
- If insufficient funds → Plan becomes "suspended"
- Member needs to earn more cashback or do top-up

#### 3. 🎁 Sponsor Someone
**Purpose:** Fund a cover plan for someone else using your overflow cashback

**Activation Requirement:**
- Button ACTIVATES when overflow ≥ plan amount
- To sponsor, member needs overflow ≥ plan amount
- Example: Plan is R500, need R500 overflow to sponsor

**Two Sponsorship Options:**

##### Option A: Register New Member
**Process:**
1. Click "Sponsor Someone" → "Register New Member"
2. Fill in registration form:
   - Full name
   - Phone number
   - Email
   - ID number
   - Address
3. Select plan to sponsor (default: same as your plan)
4. System deducts plan amount from overflow
5. Creates new member account
6. New member gets fully funded plan (active for 30 days)
7. New member receives login credentials
8. Remaining overflow updated
9. System checks: remaining overflow ≥ plan amount?
   - If YES → Buttons stay ACTIVE
   - If NO → Buttons become DISABLED

**Example:**
```
Current State:
- Plan: R500 (active)
- Overflow: R500

Member sponsors friend:
- Sponsorship cost: R500
- System deducts: R500 from overflow
- Friend's plan: R500 (active for 30 days)
- Remaining overflow: R0
- Button check: R0 < R500
- Result: Buttons become DISABLED
```

##### Option B: Add to Existing Member
**Process:**
1. Click "Sponsor Someone" → "Add to Existing Member"
2. Enter existing member's:
   - Phone number OR
   - Member ID OR
   - QR code
3. System finds member
4. Shows member's current cover plans
5. Select which plan to fund or create new plan
6. System deducts plan amount from overflow
7. Amount added to selected member's plan
8. Remaining overflow updated
9. System checks button activation

---

## Complete Workflow Examples

### Example 1: Member Reaches Overflow and Sees Popups
```
Initial State:
- Plan: Day1 Health Basic (R500)
- Funded: R0

Shopping Event:
- Member shops at partner for R5,000
- Partner offers 20% cashback
- Cashback earned: R1,000

System Processing:
- Total earned: R1,000
- System deducts: R500 → Plan activated for 30 days
- Remaining: R500 (overflow!)
- Check: R500 = R500 (plan amount) ✓ Overflow activated!

Member Logs In:
→ Popup #1 appears: "Upgrade Your Policy?"
→ Member clicks "No, Keep Current Plan"
→ Popup #2 appears: "Complete Your Profile"
→ Member clicks "I'll Do This Later"
→ Returns to dashboard
→ 3 buttons are now ACTIVE ✅

Dashboard Display:
- Plan Status: Active (30 days remaining)
- Plan Amount: R500 (deducted)
- Overflow Available: R500
- Button States: ALL ACTIVE
```

### Example 2: Member Upgrades via Popup
```
Initial State:
- Total earned: R1,000
- System deducts: R500 → Plan active
- Overflow: R500

Member logs in
Popup #1: "Upgrade to Premium (R1,000)?"
Member clicks "Yes, Upgrade to Premium"

System Processing:
- Upgrade cost: R500
- System deducts: R500 from overflow
- New plan: R1,000 Premium (active for 30 days)
- Remaining overflow: R0

Popup #2: "Complete Your Profile"
Member completes profile

Dashboard Display:
- Plan: Premium R1,000 (Active)
- Overflow: R0
- Button check: R0 < R1,000
- Button States: ALL DISABLED
```

### Example 3: Member Adds Dependant
```
Initial State:
- Plan: R500 (active)
- Overflow: R500
- Buttons: ALL ACTIVE

Member clicks "Add Dependant"
Adds spouse (R285)

System Processing:
- Dependant cost: R285
- System deducts: R285 from overflow
- New plan cost: R785 (R500 + R285)
- Plan activated for 30 days (member + spouse)
- Remaining overflow: R215

Button Check:
- R215 < R500 (plan amount)
- Result: Buttons become DISABLED

Dashboard Display:
- Plan: R785 (Active - Member + Spouse)
- Overflow: R215
- Button States: ALL DISABLED
```

### Example 4: Member Sponsors Someone
```
Initial State:
- Plan: R500 (active)
- Overflow: R500
- Buttons: ALL ACTIVE

Member clicks "Sponsor Someone" → "Register New Member"
Fills in friend's details

System Processing:
- Sponsorship cost: R500
- System deducts: R500 from overflow
- Friend's plan: R500 (active for 30 days)
- Remaining overflow: R0

Button Check:
- R0 < R500 (plan amount)
- Result: Buttons become DISABLED

Dashboard Display:
- Member Plan: R500 (Active)
- Member Overflow: R0
- Button States: ALL DISABLED
- Sponsored: 1 person (friend's name shown)

Friend's Account:
- Plan: R500 (Active for 30 days)
- Sponsored by: Member's name
```

### Example 5: Member Without Overflow
```
Scenario A: Exactly 1x
Member earns: R500 cashback
System deducts: R500 → Plan active for 30 days
Remaining: R0
Button States: ALL DISABLED
Tooltip: "Earn more cashback to unlock overflow features"

Scenario B: Between 1x and 2x
Member earns: R750 cashback
System deducts: R500 → Plan active for 30 days
Remaining: R250
Button States: ALL DISABLED
Tooltip: "Need R500 overflow to unlock features. You have R250."

Scenario C: Exactly 2x
Member earns: R1,000 cashback
System deducts: R500 → Plan active for 30 days
Remaining: R500 (overflow!)
Member logs in → Popups appear
Button States: ALL ACTIVE (after popups)
```

### Example 6: Member Uses Overflow and Drops Below Threshold
```
Initial State:
- Plan: R500 (active)
- Overflow: R500 (buttons ACTIVE)

Member adds dependant (R285)
After action:
- Plan cost: R785 (R500 + R285)
- Remaining overflow: R215
- Button check: R215 < R500
- Result: Buttons become DISABLED

Member continues shopping
Earns R300 more cashback
System processing:
- New cashback: R300
- No plan deduction (already active)
- Added to overflow: R300
- New overflow: R515
- Button check: R515 > R500 ✓
- Result: Buttons REACTIVATE (no popups this time)
```

### Example 7: Member with Multiple Dependants
```
Initial State:
- Total earned: R1,500
- System deducts: R500 → Plan active
- Overflow: R1,000 (buttons ACTIVE)

Action 1: Add Spouse (R285)
- Deducts R285 from overflow
- Remaining: R715
- Check: R715 > R500 ✓ (buttons stay ACTIVE)

Action 2: Add Child 1 (R150)
- Deducts R150 from overflow
- Remaining: R565
- Check: R565 > R500 ✓ (buttons stay ACTIVE)

Action 3: Add Child 2 (R150)
- Deducts R150 from overflow
- Remaining: R415
- Check: R415 < R500 ✗ (buttons become DISABLED)

Final State:
- Plan cost: R1,085 (R500 + R285 + R150 + R150)
- Status: Active for 30 days (covers all 4 people)
- Overflow: R415
- Button States: ALL DISABLED

Monthly Renewal:
- System deducts R1,085 every 30 days
- If insufficient funds → Plan becomes "suspended"
```

---

## UI/UX Specifications

### Dashboard Buttons Layout

**Before Overflow (Buttons Disabled):**
```
┌─────────────────────────────────────────────┐
│  Your Cover Plan: Day1 Health Basic         │
│  Status: ✅ Active (30 days remaining)      │
│  Plan Amount: R500 (deducted)               │
│  Overflow: R250                              │
│  Need R500 overflow to unlock features      │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🔼       │ │ 👥       │ │ 🎁       │   │
│  │ Upgrade  │ │ Add      │ │ Sponsor  │   │
│  │ Plan     │ │ Dependant│ │ Someone  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│  (Disabled)   (Disabled)    (Disabled)     │
└─────────────────────────────────────────────┘
```

**After Overflow + Popups (Buttons Active):**
```
┌─────────────────────────────────────────────┐
│  Your Cover Plan: Day1 Health Basic         │
│  Status: ✅ Active (30 days remaining)      │
│  Plan Amount: R500 (deducted)               │
│  Overflow: R500 available 🎉               │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🔼       │ │ 👥       │ │ 🎁       │   │
│  │ Upgrade  │ │ Add      │ │ Sponsor  │   │
│  │ Plan     │ │ Dependant│ │ Someone  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│   (Active)     (Active)      (Active)      │
└─────────────────────────────────────────────┘
```

### Button States
- **Disabled (overflow < plan amount):** 
  - Gray background, not clickable
  - Tooltip: "Need R[amount] overflow to unlock"
  - Icon grayed out
- **Active (overflow ≥ plan amount + popups completed):** 
  - Blue background, clickable
  - Hover: Slight animation, shows description
  - Icon colored
- **In Use:** 
  - Loading spinner while processing
  - Disabled temporarily during action

---

## Business Rules Summary

### Automatic Deduction System
- ✅ System ALWAYS deducts plan amount when cashback is earned
- ✅ Deduction happens automatically (no manual action needed)
- ✅ Remaining balance stays in member's account as overflow
- ✅ Member sees: "Plan Active" + "Overflow: R[amount]"

### 2x Requirement (CRITICAL)
- ⚠️ **Overflow features ONLY activate when overflow ≥ plan amount**
- ⚠️ **Buttons are DISABLED until overflow ≥ plan amount**
- ⚠️ **Popups only appear when overflow ≥ plan amount**
- ✅ Example: R500 plan needs R500 overflow to activate features

### Popup Sequence
- ✅ Popup #1: Upgrade prompt (appears first)
- ✅ Popup #2: Profile completion (appears second)
- ✅ Both popups must be seen before buttons activate
- ✅ Popups show once per overflow threshold crossing
- ✅ If member declines both → buttons still activate (if overflow sufficient)

### Button Activation/Deactivation
- ✅ Buttons activate when: Overflow ≥ plan amount + popups completed
- ❌ Buttons deactivate when: Overflow < plan amount
- ✅ Buttons reactivate when: Overflow ≥ plan amount again (no popups)
- ❌ Buttons never permanently active
- ⚠️ Every overflow action checks threshold after deduction

### Overflow Actions
- ✅ Upgrade Plan: Deducts upgrade cost from overflow
- ✅ Add Dependant: Deducts dependant cost from overflow
- ✅ Sponsor Someone: Deducts plan amount from overflow
- ✅ After each action: System checks if overflow ≥ plan amount
- ✅ Buttons activate/deactivate based on remaining overflow

---

## Testing Scenarios

### Test 1: Overflow Threshold and Popup Sequence
1. Member has R500 plan
2. Member earns R1,000 cashback
3. Verify system deducts R500 → Plan active
4. Verify overflow shows R500
5. Member logs in
6. Verify Popup #1 appears (Upgrade prompt)
7. Click "No, Keep Current Plan"
8. Verify Popup #2 appears (Profile completion)
9. Click "I'll Do This Later"
10. Verify all 3 buttons are now ACTIVE
11. Verify dashboard shows:
    - Plan: Active (30 days)
    - Overflow: R500

### Test 2: Buttons Disabled Before Overflow Threshold
1. Member has R500 plan
2. Member earns R750 cashback
3. Verify system deducts R500 → Plan active
4. Verify overflow shows R250
5. Verify all 3 buttons are DISABLED
6. Hover over buttons
7. Verify tooltip: "Need R500 overflow to unlock. You have R250."
8. Try clicking buttons
9. Verify nothing happens (disabled)

### Test 3: Upgrade via Popup
1. Member earns R1,000 (overflow R500)
2. Member logs in
3. Popup #1 appears: "Upgrade to Premium (R1,000)?"
4. Click "Yes, Upgrade to Premium"
5. Verify system deducts R500 from overflow
6. Verify plan changes to Premium R1,000
7. Verify status is "active" for 30 days
8. Verify overflow is now R0
9. Popup #2 appears
10. Complete or skip profile
11. Verify buttons are DISABLED (no overflow remaining)

### Test 4: Add Dependant with Overflow
1. Member has R500 overflow (buttons ACTIVE)
2. Click "Add Dependant"
3. Add spouse (R285)
4. Verify system deducts R285 from overflow
5. Verify new plan cost is R785
6. Verify status is "active" for 30 days
7. Verify overflow is now R215
8. Verify buttons become DISABLED (R215 < R500)

### Test 5: Sponsor Someone
1. Member has R500 overflow (buttons ACTIVE)
2. Click "Sponsor Someone" → "Register New Member"
3. Fill in friend's details
4. Submit
5. Verify system deducts R500 from overflow
6. Verify friend's account created with R500 plan
7. Verify member's overflow is now R0
8. Verify buttons become DISABLED

### Test 6: Overflow Reactivation
1. Member has R215 overflow (buttons DISABLED)
2. Member earns R300 more cashback
3. Verify overflow increases to R515
4. Verify buttons REACTIVATE (no popups)
5. Verify member can use overflow features again

---

## Error Handling

### Insufficient Overflow for Action
```
Error: "You need R500 overflow to use this feature. 
You currently have R250. Keep shopping to earn more cashback!"

Note: This error appears when:
- Member tries to use button when overflow < plan amount
- Should not happen as buttons are disabled
- Safety check in case of race condition
```

### Dependant Limit Reached
```
Error: "You've reached the maximum of 5 dependants. 
Please upgrade to a higher plan or sponsor someone instead."
```

### Invalid Member for Sponsorship
```
Error: "Member not found. Please check the phone number or Member ID."
```

### Upgrade Not Available
```
Error: "You're already on the highest plan (Premium). 
Consider adding dependants or sponsoring someone!"
```

---

## Database Implementation

### Tables Affected

#### `member_cover_plans`
```sql
- plan_amount: Base plan cost (e.g., R500)
- overflow_balance: Remaining cashback after plan deduction
- status: active, suspended, cancelled
- active_until: 30 days from activation
```

#### `cover_plan_wallet_entries`
```sql
- entry_type: 'plan_deduction', 'overflow_added', 'upgrade_cost', 'dependant_cost', 'sponsorship_sent'
- amount: Amount deducted or added
- balance_after: Overflow balance after operation
```

#### `linked_people`
```sql
- member_cover_plan_id: Which plan the dependant is linked to
- linked_type: spouse, child, parent, other
- cost: Dependant cost (R285, R150, etc.)
- status: active, pending
```

#### `sponsorships`
```sql
- sponsor_member_id: Who is sponsoring
- sponsored_member_id: Who is being sponsored
- amount: Amount sponsored (plan amount)
- sponsorship_type: 'new_registration' or 'existing_member'
- created_at: When sponsorship occurred
```

---

This document now accurately reflects the automatic deduction system and conditional button activation!
