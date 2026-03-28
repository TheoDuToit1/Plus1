# Plus1 Rewards - Member & Partner Testing Guide

## How to Test as a Member

### 1. Member Registration & Login
- Navigate to member registration page
- Enter your details (name, phone, email)
- Create a 6-digit PIN
- QR code is automatically generated: `PLUS1-{phone}-{timestamp}`
- Login with phone number and PIN

### 2. Member Dashboard Features
- View your cover plans and funding progress
- See recent transactions and cashback earned
- Check linked people/dependants
- View top-up history
- Create disputes for transactions

### 3. Shopping & Earning Cashback
**Process:**
1. Member shops at a partner store
2. Partner scans member's QR code
3. Partner enters purchase amount
4. System calculates cashback split:
   - 1% to system
   - 1% to agent (who recruited the partner)
   - Remaining % to member (e.g., if partner offers 15%, member gets 13%)
5. Transaction is created with status "completed"
6. Cashback is added to member's oldest cover plan (by creation_order)

**Example:**
- Purchase: R100 at Spar (15% cashback)
- System: R1.00
- Agent: R1.00
- Member: R13.00 → Added to cover plan

### 4. Cover Plan Funding Rules
- Cover plans fill in `creation_order` (1 fills first, then 2, then 3, etc.)
- Each plan has a `target_amount` (e.g., R385 for Day1 Health Basic)
- When plan reaches target → status changes to "active"
- Active period: 30 days from `active_from` to `active_to`
- After 30 days: If still funded, renews automatically; if not, becomes "suspended"

### 5. Overflow Cashback System
**What happens when a cover plan is full?**
- Cashback automatically moves to next priority cover plan
- Priority determined by `creation_order`
- If all plans are full → overflow can go to:
  1. Next 30-day cycle (carry over)
  2. Higher tier plans
  3. Dependants' plans
  4. Additional plans member creates

**Example:**
- Member has 2 plans: Plan A (order 1, target R385) and Plan B (order 2, target R500)
- Plan A is at R385 (full)
- Member earns R50 cashback
- R50 goes to Plan B automatically
- Tracked in `cover_plan_wallet_entries` with `entry_type = 'overflow_moved'`

### 6. Creating a Dispute
**Where:** Member dashboard → Transactions tab → Click on transaction → "Dispute" button

**Dispute Types:**
- `missing_cashback` - Didn't receive expected cashback
- `wrong_amount` - Purchase amount recorded incorrectly
- `unauthorized` - Transaction wasn't made by member
- `other` - Other issues

**Process:**
1. Member selects transaction
2. Chooses dispute type
3. Writes description
4. Submits dispute
5. Admin reviews in Admin Dashboard → Disputes tab
6. Admin can resolve, reject, or investigate

### 7. Top-Ups
**When needed:** Cover plan is short of target amount

**Process:**
1. Member goes to cover plan details
2. Clicks "Top Up"
3. Chooses payment method (EFT, card, cash)
4. Makes payment
5. Uploads proof of payment
6. Admin approves in Admin Dashboard → Top-Ups tab
7. Amount is added to cover plan

---

## How to Test as a Partner

### 1. Partner Registration & Login
- Navigate to partner registration page
- Enter shop details:
  - Shop name
  - Responsible person
  - Phone, email
  - Category (Grocery, Pharmacy, Clothing, etc.)
  - Address
  - Cashback percentage (3-40%)
  - Included/excluded products
- Status starts as "pending"
- Admin approves in Admin Dashboard → Partners tab
- Login with phone and PIN

### 2. Partner Dashboard Features
- View transaction history
- See monthly invoices
- Check cashback statistics
- Manage shop profile

### 3. Processing Member Purchases
**Process:**
1. Member presents QR code
2. Partner scans QR code (or enters manually)
3. Partner enters purchase amount
4. System validates:
   - Member exists and is active
   - Partner is active
   - Purchase amount > 0
5. Transaction is created immediately with status "completed"
6. Cashback is split and allocated
7. Receipt/confirmation shown

**Important:** Transactions are NOT pending - they go through immediately as "completed"

### 4. Monthly Invoices
**What are they?**
- Partners pay Plus1 for the cashback they offered
- Generated monthly in `partner_invoices` table
- Due date: Usually 7-14 days after month end
- Status flow: generated → sent → paid (or overdue → suspended)

**Invoice Calculation:**
- Sum of all cashback amounts partner offered that month
- Example: Partner offered R1000 in cashback → Invoice is R1000

**Payment:**
- Partner pays via EFT/bank transfer
- Can do partial top-ups
- Admin marks as paid in Admin Dashboard → Invoices tab
- If overdue → partner status becomes "suspended"
- Suspended partners cannot process new transactions

### 5. Partner-Agent Relationship
- Each partner is recruited by an agent
- Tracked in `partner_agent_links` table
- Agent earns 1% commission on all partner transactions
- Commission paid monthly via `agent_commissions` table

---

## Admin Dashboard - Tab Descriptions

### 1. Members Tab
**Purpose:** Manage all member accounts

**Shows:**
- List of all members with name, phone, email, QR code
- Member status (always "active" - no pending/suspended for members)
- Funded amount (total across all cover plans)
- Join date

**Actions:**
- View Details → Opens modal with:
  - Personal information
  - All cover plans with funding progress
  - Recent transactions (up to 15)
  - Top-ups history
  - Disputes
  - Linked people/dependants
  - Statistics (total funded, target, transactions, cashback)

### 2. Partners Tab
**Purpose:** Manage partner shops and approvals

**Shows:**
- List of all partner shops
- Shop name, category, cashback percentage
- Responsible person, contact details
- Status (pending, active, suspended)
- Approval status and date

**Actions:**
- View Details → Shop information, transaction history
- Approve → Change status from pending to active
- Suspend → Temporarily disable partner (e.g., for non-payment)
- Edit → Update shop details

### 3. Agents Tab
**Purpose:** Manage sales agents

**Shows:**
- List of all agents (name from users table via join)
- ID number, phone, email
- Status (pending, active, suspended, rejected)
- Approval date
- Total partners recruited
- Total commissions earned

**Actions:**
- View Details → Agent info, recruited partners, commission history
- Approve → Change status from pending to active
- Reject → Deny agent application
- View Commissions → See monthly breakdown

### 4. Transactions Tab
**Purpose:** Monitor all cashback transactions

**Shows:**
- All transactions between members and partners
- Purchase amount, cashback split (system, agent, member)
- Transaction date and status
- Member name, partner shop name

**Transaction Statuses:**
- `completed` - Normal successful transaction (most common)
- `pending` - Rare, only if system needs verification
- `reversed` - Transaction was cancelled/refunded
- `disputed` - Member raised a dispute

**Note:** Transactions are NOT about invoice payments - they're about member purchases at partner shops earning cashback

**Actions:**
- View Details → Full transaction breakdown
- Reverse → Cancel transaction and remove cashback
- View Dispute → If transaction is disputed

### 5. Invoices Tab
**Purpose:** Manage monthly partner invoices

**Shows:**
- Monthly invoices for each partner
- Invoice month, total amount, due date
- Status (generated, sent, overdue, paid, suspended)
- Payment date

**Actions:**
- View Details → Invoice line items (all transactions)
- Mark as Sent → Update status
- Mark as Paid → Record payment
- Send Reminder → Email partner
- Suspend Partner → If severely overdue

### 6. Commissions Tab
**Purpose:** Manage agent commission payouts

**Shows:**
- Monthly commission records for each agent
- Agent name (from users table)
- Month, total amount
- Payout status (pending, paid)
- Payment date

**Actions:**
- View Details → Commission breakdown by partner/transaction
- Mark as Paid → Record payout to agent
- Export → Download commission report

### 7. Cover Plans Tab
**Purpose:** Monitor member cover plan funding

**Shows:**
- All member cover plans
- Member name, plan name, creation order
- Target amount, funded amount, progress percentage
- Status (in_progress, active, suspended, cancelled)
- Active period dates (30-day cycles)

**Actions:**
- View Details → Plan history, wallet entries, overflow movements
- Manual Funding → Admin adds funds to plan
- View Transactions → See all transactions that funded this plan

### 8. Disputes Tab
**Purpose:** Handle member transaction disputes

**Shows:**
- All disputes raised by members
- Dispute type, description
- Related transaction, member, partner
- Status (open, investigating, resolved, rejected)
- Resolution notes

**Actions:**
- View Details → Full dispute information
- Investigate → Change status to investigating
- Resolve → Mark as resolved with notes
- Reject → Deny dispute with reason
- Reverse Transaction → If dispute is valid

### 9. Top-Ups Tab
**Purpose:** Approve member and partner top-up payments

**Shows:**
- All top-up requests
- Payer type (member or partner)
- Amount, payment method
- Related cover plan (for members) or invoice (for partners)
- Approval status

**Actions:**
- View Details → Payment proof, reference notes
- Approve → Add funds to cover plan/invoice
- Reject → Deny top-up request
- Request More Info → Ask for additional documentation

### 10. Providers Tab
**Purpose:** Manage medical cover providers (e.g., Day1 Health)

**Shows:**
- List of providers
- Provider name, company details
- Status (pending, active, suspended)
- Number of cover plans offered
- Last export date

**Actions:**
- View Details → Provider information, offered plans
- View Plans → See all cover plans from this provider
- Create Export → Generate monthly export of active members
- Approve → Activate new provider

**Note:** Currently only Day1 Health is the provider, offering plans like:
- Day1 Health Basic (R385/month)
- Day1 Health Plus (R500/month)
- Day1 Health Premium (R750/month)

### 11. Exports Tab
**Purpose:** Generate and manage provider exports

**Shows:**
- Export batches sent to providers
- Export month, provider name
- Total cover plans, total value
- Status (pending, completed, failed)
- Export date

**Actions:**
- Create Export → Generate new monthly export
- View Details → See all cover plans in export
- Download → Get export file (CSV/Excel)
- Resend → Send export to provider again
- View Failed Items → See plans that failed to export

### 12. Approvals Tab
**Purpose:** Centralized approval queue

**Shows:**
- All pending approvals in one place:
  - Partner applications
  - Agent applications
  - Top-up requests
  - Linked people/dependants
  - Provider applications

**Actions:**
- Quick approve/reject for each item type
- Bulk approve multiple items
- View details before approving

### 13. Audit Logs Tab
**Purpose:** System-wide audit trail

**Shows:**
- All important system actions
- User who performed action
- Action type, table name, record ID
- Old value vs new value (JSON)
- Timestamp

**Use Cases:**
- Track who approved what
- Investigate suspicious activity
- Compliance and reporting
- Debugging issues

---

## Key System Rules

### Cashback Split Formula
```
Total Cashback = Purchase Amount × Partner Cashback %
System Amount = Purchase Amount × 1%
Agent Amount = Purchase Amount × 1%
Member Amount = Total Cashback - System Amount - Agent Amount
```

### Cover Plan Priority
1. Plans fill by `creation_order` (1, 2, 3, ...)
2. Oldest plan fills first
3. Overflow moves to next plan automatically
4. All tracked in `cover_plan_wallet_entries`

### Transaction Flow
```
Member shops → Partner scans QR → Enter amount → 
System calculates split → Transaction created (completed) → 
Cashback added to member's cover plan → 
Agent commission recorded → 
Partner invoice updated
```

### Invoice Payment Flow
```
Month ends → System generates invoices → 
Admin sends to partners → Partner pays → 
Admin marks as paid → Partner remains active
```

### Dispute Resolution Flow
```
Member creates dispute → Admin investigates → 
Admin resolves/rejects → If resolved: transaction reversed → 
Cashback removed from cover plan → 
Partner invoice adjusted
```

---

## Testing Scenarios

### Scenario 1: New Member Journey
1. Member registers → Gets QR code
2. Member creates cover plan (Day1 Health Basic, R385 target)
3. Member shops at Spar (R100, 15% cashback)
4. Member earns R13 cashback → Added to cover plan (now R13/R385)
5. Member shops 29 more times → Reaches R385
6. Cover plan becomes "active" for 30 days
7. Member continues shopping → Overflow to next plan

### Scenario 2: Partner Invoice Payment
1. Partner processes R10,000 in transactions (15% cashback = R1,500)
2. Month ends → Invoice generated for R1,500
3. Admin sends invoice to partner
4. Partner pays R1,500
5. Admin marks invoice as paid
6. Partner remains active

### Scenario 3: Dispute Resolution
1. Member shops at Clicks (R300)
2. Member doesn't see cashback
3. Member creates dispute (type: missing_cashback)
4. Admin investigates → Finds transaction exists
5. Admin checks cover plan → Cashback was added
6. Admin resolves dispute with explanation
7. Member sees resolution notes

### Scenario 4: Top-Up
1. Member's cover plan is at R350/R385 (R35 short)
2. Member wants plan active now
3. Member does top-up of R35 via EFT
4. Admin approves top-up
5. R35 added to cover plan → Now R385/R385
6. Plan becomes active immediately

---

## Common Issues & Solutions

### Issue: Partner tab shows no data
**Cause:** RLS policies or incorrect query
**Solution:** Ensure `supabaseAdmin` client is used with service role key

### Issue: Transactions show "pending" status
**Clarification:** Transactions should be "completed" immediately. "Pending" is rare and only for verification cases.

### Issue: Member status shows "pending" or "suspended"
**Fix:** Members only have "active" status. Update database: `UPDATE members SET status = 'active'`

### Issue: Action buttons don't work
**Cause:** Event handlers not implemented or missing state updates
**Solution:** Implement proper async functions with error handling and refresh data after actions

### Issue: Disputes tab empty
**Cause:** No disputes created yet OR RLS blocking access
**Solution:** Create test disputes OR check RLS policies

### Issue: Agent names not showing
**Cause:** Missing join with users table
**Solution:** Query must join: `agents.user_id = users.id` to get `full_name`

---

## Database Quick Reference

### Key Tables
- `members` - Member accounts
- `partners` - Partner shops
- `agents` - Sales agents
- `users` - Centralized auth (join for names)
- `transactions` - Cashback transactions
- `member_cover_plans` - Cover plan tracking
- `cover_plan_wallet_entries` - Funding audit trail
- `partner_invoices` - Monthly partner bills
- `agent_commissions` - Monthly agent payouts
- `disputes` - Transaction disputes
- `top_ups` - Payment top-ups
- `providers` - Medical cover providers
- `provider_exports` - Monthly exports to providers

### Important Joins
```sql
-- Agents with names
SELECT a.*, u.full_name FROM agents a 
LEFT JOIN users u ON a.user_id = u.id

-- Transactions with details
SELECT t.*, m.full_name as member_name, p.shop_name 
FROM transactions t
LEFT JOIN members m ON t.member_id = m.id
LEFT JOIN partners p ON t.partner_id = p.id

-- Cover plans with member info
SELECT mcp.*, m.full_name, cp.plan_name
FROM member_cover_plans mcp
LEFT JOIN members m ON mcp.member_id = m.id
LEFT JOIN cover_plans cp ON mcp.cover_plan_id = cp.id
```

---

This guide should help you understand and test the entire Plus1 Rewards system!
