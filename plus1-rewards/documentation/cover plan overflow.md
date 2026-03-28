Cover Plan Overflow System - Complete Rules & Flow
Core Concept
The overflow system allows members to accumulate cashback beyond their plan amount, which can be used for upgrades, adding dependants, or sponsoring others. The system has a 2x threshold requirement - overflow features only activate when the member has earned at least 2x their plan amount.

Automatic Cashback Processing
When a Transaction Occurs
Partner processes sale (e.g., R5,000 purchase with 20% cashback)
System calculates member cashback (e.g., 20% - 2% = 18% → R900 to member)
System checks member's cover plan status:
Scenario A: Plan is "in_progress" (not yet activated)
Current funded amount + new cashback < plan target:

Add cashback to funded_amount
Plan stays "in_progress"
No overflow yet
Current funded amount + new cashback >= plan target:

Deduct plan amount from total cashback
Set funded_amount = plan target amount
Set plan status = "active" for 30 days
Remaining amount goes to overflow_balance
Example:

Plan: R385
Current funded: R200
New cashback: R900
Total: R1,100

Result:

- funded_amount = R385 (plan activated)
- overflow_balance = R715 (R1,100 - R385)
- status = "active"
  Scenario B: Plan is already "active"
  All new cashback goes directly to overflow_balance

Plan stays active (30-day timer continues)

Example:

Plan: R385 (already active)
Current overflow: R100
New cashback: R300

Result:

- funded_amount = R385 (unchanged)
- overflow_balance = R400 (R100 + R300)
- status = "active"
  The 2x Threshold Rule
  What is the 2x Threshold?
  Overflow features ONLY activate when:

overflow_balance >= plan_target_amount
This means the member must have earned at least 2x their plan amount in total:

1x for the plan itself (deducted and stored in funded_amount)
1x remaining as overflow (stored in overflow_balance)
Examples of 2x Threshold
Plan: R385

Total Earned	Plan Deduction	Overflow	Features Active?
R385	R385	R0	❌ NO (0x overflow)
R500	R385	R115	❌ NO (0.3x overflow)
R700	R385	R315	❌ NO (0.8x overflow)
R770	R385	R385	✅ YES (1x overflow = 2x total)
R1,000	R385	R615	✅ YES (1.6x overflow)
Plan: R500

Total Earned	Plan Deduction	Overflow	Features Active?
R500	R500	R0	❌ NO
R750	R500	R250	❌ NO
R1,000	R500	R500	✅ YES (2x total)
R1,500	R500	R1,000	✅ YES (3x total)
Member Dashboard Display
When Overflow < Plan Amount (Features Disabled)
Your Cover Plan: Day1 Health Basic
Status: ✅ Active (30 days remaining)
Plan Amount: R385 (deducted)

Cashback Balance Breakdown:
Total Cashback Earned: R700
Policy Deduction: -R385
Available Balance: R315

Need R385 overflow to unlock features. You have R315.
Keep shopping to earn R70 more!

[Manage Your Cashback section is HIDDEN]
When Overflow >= Plan Amount (Features Active)
Your Cover Plan: Day1 Health Basic
Status: ✅ Active (30 days remaining)
Plan Amount: R385 (deducted)

Cashback Balance Breakdown:
Total Cashback Earned: R900
Policy Deduction: -R385
Available Balance: R515

🎉 Overflow activated! You can upgrade, add dependants, or sponsor someone

[Manage Your Cashback section is VISIBLE with 3 buttons]
Upgrade Popup Flow
When Does the Popup Appear?
The upgrade popup appears when:

Member logs into their dashboard
Their plan status is "active"
Their overflow_balance >= plan_target_amount
They haven't seen the popup for this overflow level yet (tracked in sessionStorage)
Popup Sequence
Popup #1: Upgrade Your Policy

🎉 Congratulations! You have overflow cashback!

Current Plan: Day1 Health Basic (R385)
Plan Status: Active (30 days remaining)
Overflow Available: R515

Would you like to upgrade to a higher plan?

Upgrade Options:
→ Day1 Health Plus (R500) - Costs R115 from overflow
→ Day1 Health Premium (R750) - Costs R365 from overflow

✓ Yes, Upgrade My Plan
✗ No, Keep Current Plan
If YES (Upgrade):

Member selects new plan tier
System deducts upgrade cost from overflow
Updates target_amount to new tier
Updates funded_amount to new tier
Resets 30-day active period
Updates overflow_balance = old overflow - upgrade cost
Records wallet entry with type "overflow_moved"
Popup #2 appears (profile completion)
Check if remaining overflow >= new plan amount
If YES: Buttons stay visible
If NO: Buttons become hidden
Example:

Before upgrade:

- Plan: R385
- Overflow: R515
- Buttons: VISIBLE

Upgrade to R500:

- Upgrade cost: R115 (R500 - R385)
- New overflow: R400 (R515 - R115)
- Check: R400 < R500
- Result: Buttons become HIDDEN
  If NO (Keep Current Plan):

Popup #1 closes
Popup #2 appears (profile completion)
Plan stays at current tier
Overflow unchanged
Buttons remain VISIBLE (since overflow >= plan amount)
Popup #2: Complete Your Profile

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
The 3 Overflow Management Buttons
Button Visibility Rules
Buttons are VISIBLE when:

✅ Plan status = "active"
✅ overflow_balance >= plan_target_amount
✅ Member has completed popup sequence
Buttons are HIDDEN when:

❌ Plan status = "in_progress" or "suspended"
❌ overflow_balance < plan_target_amount
❌ Member hasn't logged in since reaching overflow threshold
Button 1: Upgrade Plan
Purpose: Increase plan tier

Available Upgrades:

R385 → R500 (costs R115)
R500 → R750 (costs R250)
R385 → R750 (costs R365)
Process:

Check if enough overflow for upgrade
Deduct upgrade cost from overflow
Update plan to new tier
Reset 30-day active period
Check if remaining overflow >= new plan amount
Show/hide buttons accordingly
Disabled when: Already on highest plan (R750)

Button 2: Add Dependant
Purpose: Add family members to cover plan

Dependant Costs:

Adult (spouse/parent): R285
Child: R150
Senior: R350
Process:

Member fills in dependant details
System deducts dependant cost from overflow
New total plan cost = base plan + all dependants
Plan remains active for 30 days
Check if remaining overflow >= original plan amount
Show/hide buttons accordingly
Example:

Before:

- Plan: R385
- Overflow: R515
- Buttons: VISIBLE

Add spouse (R285):

- New overflow: R230 (R515 - R285)
- Total plan cost: R670 (R385 + R285)
- Check: R230 < R385
- Result: Buttons become HIDDEN
  Monthly Renewal:

System deducts total plan cost every 30 days
If insufficient funds → plan becomes "suspended"
Button 3: Sponsor Someone
Purpose: Fund a cover plan for someone else

Requirements:

Must have overflow >= plan amount to sponsor
Two Options:

A. Register New Member

Fill in new member's details
System deducts plan amount from overflow
Creates new member account
New member gets fully funded plan (active 30 days)
Check button visibility
B. Add to Existing Member

Enter existing member's phone/ID/QR
System finds member
Select which plan to fund
Deduct plan amount from overflow
Check button visibility
Database Schema
member_cover_plans table

- id: UUID
- member_id: UUID
- cover_plan_id: UUID
- creation_order: INTEGER (funding priority)
- target_amount: NUMERIC (plan cost, e.g., R385)
- funded_amount: NUMERIC (amount used for plan activation)
- overflow_balance: NUMERIC (remaining cashback after plan deduction)
- status: TEXT (in_progress, active, suspended, cancelled)
- active_from: TIMESTAMP (when plan activated)
- active_to: TIMESTAMP (30 days from activation)
  cover_plan_wallet_entries table
- id: UUID
- member_id: UUID
- member_cover_plan_id: UUID
- transaction_id: UUID
- entry_type: TEXT (cashback_added, overflow_moved, etc.)
- amount: NUMERIC (amount of this entry)
- balance_after: NUMERIC (overflow balance after this entry)
- created_at: TIMESTAMP
  Complete Flow Example
  Scenario: Member earns R900 cashback
  Initial State:

Plan: R385 (in_progress)
Funded: R200
Overflow: R0
Transaction Processed:

1. Partner processes R5,000 sale with 20% cashback
2. Member gets R900 cashback (18% after system/agent cuts)
3. Total cashback: R200 + R900 = R1,100
4. System deducts R385 for plan activation
5. Plan becomes "active" for 30 days
6. Remaining R715 goes to overflow
   Result:

Plan: R385 (active)
Funded: R385
Overflow: R715
Member Logs In:

1. Dashboard loads
2. System checks: R715 >= R385? YES
3. Upgrade popup appears
4. Member clicks "No, Keep Current Plan"
5. Profile completion popup appears
6. Member clicks "I'll Do This Later"
7. Dashboard shows 3 overflow buttons (VISIBLE)
   Member Clicks "Upgrade Plan":
8. Selects upgrade to R500
9. Upgrade cost: R115
10. New overflow: R600 (R715 - R115)
11. Plan updated to R500
12. Check: R600 >= R500? YES
13. Buttons stay VISIBLE
    Key Takeaways
    Automatic Deduction: System ALWAYS deducts plan amount when activating
    2x Requirement: Need 2x plan amount total (1x for plan + 1x overflow) to unlock features
    Popup Timing: Appears on login when overflow >= plan amount
    Button Visibility: Dynamic based on overflow >= plan amount check
    Overflow Actions: All actions deduct from overflow and re-check threshold
    No Permanent Activation: Buttons can become hidden again if overflow drops below threshold
    Is this understanding correct? Should I clarify or correct anything?
