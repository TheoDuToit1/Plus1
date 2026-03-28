# Plus1-Go Complete Test Flow: A to Z
**Full System Integration Test - Member Registration to Food Delivery**  
**Date:** March 27, 2026  
**Version:** 1.0  
**Purpose:** Comprehensive end-to-end testing of Plus1-Go + Plus1-Rewards ecosystem

---

## Test Overview

This document provides a complete test flow covering:
- Member registration and authentication
- Profile completion
- Partner discovery and browsing
- Menu selection and cart management
- Checkout and payment
- Order tracking and delivery
- Cashback allocation to cover plans
- All associated dashboards (Member, Partner, Driver, Agent, Admin)

---

## Prerequisites

### Database Setup
- Supabase project: `gcbmlxdxwakkubpldype.supabase.co`
- All tables created and populated with seed data
- RLS policies enabled
- Test data includes:
  - 3 active partners with menus
  - 1 test agent
  - 1 test driver
  - Default cover plan (R385 target)

### Environment Variables
```env
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
```

### Test Accounts Prepared
- Admin account for monitoring
- Agent account linked to test partners
- Driver account ready for delivery

---

## PHASE 1: MEMBER REGISTRATION & AUTHENTICATION

### Test 1.1: Member Registration
**URL:** `/register`

**Steps:**
1. Navigate to Plus1-Go homepage
2. Click "Sign Up" button
3. Fill registration form:
   - Full Name: "John Doe"
   - Mobile Number: "0821234567"
   - 6-Digit PIN: "123456"
   - Confirm PIN: "123456"
4. Accept terms and conditions
5. Click "Register"

**Expected Results:**
✅ User account created in `users` table (role: 'member')
✅ Member profile created in `members` table
✅ QR code generated (format: `PLUS1-0821234567-[timestamp]`)
✅ Default cover plan created in `member_cover_plans`:
   - Plan: Day1 Health Basic
   - Target: R385 (38500 cents)
   - Funded: R0
   - Status: 'in_progress'
   - Creation order: 1
✅ Auto-login and redirect to dashboard
✅ Welcome SMS sent

**Database Verification:**
```sql
-- Check user created
SELECT * FROM users WHERE mobile_number = '0821234567';

-- Check member profile
SELECT * FROM members WHERE phone = '0821234567';

-- Check cover plan
SELECT * FROM member_cover_plans WHERE member_id = [member_id];
```


### Test 1.2: Login
**URL:** `/login`

**Steps:**
1. Logout from current session
2. Navigate to `/login`
3. Enter credentials:
   - Mobile Number: "0821234567"
   - PIN: "123456"
4. Click "Login"

**Expected Results:**
✅ Authentication successful
✅ Session created (JWT token stored)
✅ Redirect to dashboard
✅ Member name displayed in header

**Test Invalid Login:**
- Wrong PIN: Error message "Invalid PIN"
- Non-existent phone: Error message "Account not found"

---

## PHASE 2: PROFILE COMPLETION

### Test 2.1: Profile Completion Check
**URL:** `/dashboard`

**Expected Results:**
✅ Dashboard loads successfully
✅ Warning banner displayed at top:
   - "⚠️ Complete your profile to start ordering"
   - "Missing: ID Number, Bank Details"
   - "Complete Profile" button visible

**Dashboard Sections Visible:**
- Welcome block with member name
- Cover plan card showing R0 / R385
- QR code shortcut
- Recent transactions (empty)
- Profile completion status

### Test 2.2: Complete Profile
**URL:** `/profile`

**Steps:**
1. Click "Complete Profile" button from dashboard
2. Fill in required fields:
   - ID Number: "9001015800083"
   - Date of Birth: "1990-01-01"
   - Email: "john.doe@example.com" (optional)
3. Fill in bank details:
   - Bank Name: "FNB"
   - Account Number: "62123456789"
   - Account Holder: "John Doe"
   - Branch Code: "250655"
4. Add delivery address:
   - Street Address: "12 Voortrekker Road"
   - Suburb: "Bellville"
   - Delivery Instructions: "Ring doorbell twice"
5. Click "Save Profile"

**Expected Results:**
✅ Profile updated in `members` table
✅ `profile_completed` flag set to TRUE (auto-calculated by trigger)
✅ Success message displayed
✅ Warning banner removed from dashboard
✅ "Start Ordering" button now enabled

**Database Verification:**
```sql
SELECT id_number, bank_account_number, profile_completed, saved_addresses
FROM members WHERE phone = '0821234567';
```

---

## PHASE 3: PARTNER DISCOVERY & BROWSING

### Test 3.1: Homepage Partner Directory
**URL:** `/go`

**Expected Results:**
✅ Search bar visible at top
✅ Category pills displayed (Restaurants, Groceries, Pharmacies, etc.)
✅ Suburb filter dropdown (Bellville, Parow, Goodwood, etc.)
✅ Featured partners carousel
✅ Partner directory grid showing:
   - Partner logo
   - Partner name
   - Cashback percentage badge (e.g., "Earn 10% cashback")
   - Star rating
   - "Open Now" status
   - Delivery radius
   - Estimated prep time

**Test Filters:**
1. Select "Bellville" from suburb dropdown
   - ✅ Only partners in Bellville displayed
2. Click "Restaurants" category
   - ✅ Only restaurant partners shown
3. Toggle "Open Now" filter
   - ✅ Only currently open partners shown
4. Sort by "Highest Cashback"
   - ✅ Partners sorted by cashback_percent DESC

**Database Query:**
```sql
SELECT id, shop_name, cashback_percent, category, rating, is_open
FROM partners
WHERE status = 'active' 
  AND delivery_enabled = true
ORDER BY cashback_percent DESC;
```

### Test 3.2: Search Functionality
**Steps:**
1. Type "Pizza" in search bar
2. View auto-suggest results
3. Press Enter

**Expected Results:**
✅ Partners with "Pizza" in name or menu items displayed
✅ Recent searches saved to local storage
✅ Search results show relevance score

---

## PHASE 4: PARTNER STOREFRONT & MENU

### Test 4.1: View Partner Details
**URL:** `/go/partner/[partner-id]`

**Steps:**
1. Click on "Napoli Pizza" from directory
2. View partner storefront page

**Expected Results:**
✅ Partner banner image displayed
✅ Partner logo
✅ Business name and address
✅ Operating hours (Mon-Sun schedule)
✅ Cashback percentage prominently displayed: "Earn 10% cashback"
✅ Star rating and review count
✅ "Delivers to your area" badge
✅ Minimum order value displayed
✅ Menu organized by categories (Starters, Mains, Drinks, Desserts)

**Menu Items Display:**
✅ Each item shows:
   - Item photo
   - Item name
   - Description
   - Price (in rands)
   - "Available" or "Out of Stock" badge
   - "Add to Cart" button

**Database Query:**
```sql
-- Get partner details
SELECT * FROM partners WHERE id = [partner-id];

-- Get menu items
SELECT p.*, pc.name as category_name
FROM products p
LEFT JOIN product_categories pc ON p.category = pc.id
WHERE p.partner_id = [partner-id] AND p.is_available = true
ORDER BY pc.display_order, p.name;
```


### Test 4.2: Add Items to Cart
**Steps:**
1. Click "Margherita Pizza" (R85)
2. Product detail modal opens
3. Select size: "Large" (+R20)
4. Add extra: "Extra Cheese" (+R10)
5. Set quantity: 2
6. Click "Add to Cart"
7. Add another item: "Garlic Bread" (R35)
8. View cart icon - shows "3" items

**Expected Results:**
✅ Cart icon updates with item count
✅ Items stored in cart state
✅ Cart persists on page refresh (session storage)
✅ Subtotal calculated correctly:
   - Margherita Large x2: (R85 + R20 + R10) x 2 = R230
   - Garlic Bread x1: R35
   - Subtotal: R265

**Live Cashback Preview:**
✅ "This order earns you R21.20 toward cover" displayed
✅ Calculation: R265 × 10% = R26.50 total cashback
   - System: R2.65 (1%)
   - Agent: R2.65 (1%)
   - Member: R21.20 (8%)

---

## PHASE 5: CHECKOUT & PAYMENT

### Test 5.1: Proceed to Checkout
**URL:** `/go/checkout`

**Steps:**
1. Click "Proceed to Checkout" from cart
2. Checkout page loads

**Expected Results:**
✅ Profile completion check passes (ID + Bank details present)
✅ Checkout page displays:
   - Order summary (items, subtotal)
   - Delivery address selector
   - Delivery fee calculation
   - Special instructions field
   - Payment method selector
   - Total amount
   - Cashback breakdown

### Test 5.2: Delivery Address & Fee Calculation
**Steps:**
1. Select saved address: "12 Voortrekker Road, Bellville"
2. System calculates distance from partner to address

**Expected Results:**
✅ Google Maps Distance Matrix API called
✅ Distance calculated: 3.2km
✅ Delivery fee calculated:
   - Base fee: R25
   - Distance fee: 3.2km × R8 = R25.60
   - Total delivery fee: R50.60 (rounded to R51)
✅ Delivery fee displayed: "Delivery: R51 (3.2km)"

**Total Order:**
- Subtotal: R265
- Delivery: R51
- Total Due: R316

**Cashback Breakdown:**
✅ Order cashback: R21.20 (member portion)
✅ Delivery fee split:
   - Driver: R47.43 (93%)
   - System: R2.55 (5%)
   - Agent: R1.02 (2%)
✅ Total member earns: R21.20

### Test 5.3: Payment
**Steps:**
1. Select payment method: "Instant EFT"
2. Enter special instructions: "No onions"
3. Click "Place Order"
4. Redirect to Ozow payment gateway
5. Select bank: "FNB"
6. Complete payment (test mode)
7. Redirect back to Plus1-Go

**Expected Results:**
✅ Order created in database:
```sql
INSERT INTO orders (
  order_number, member_id, partner_id,
  subtotal, delivery_fee, total_amount,
  delivery_type, delivery_address,
  delivery_latitude, delivery_longitude,
  special_instructions,
  payment_status, status
) VALUES (
  'ORD-20260327-1234', [member-id], [partner-id],
  26500, 5100, 31600,
  'delivery', '12 Voortrekker Road, Bellville',
  -33.9249, 18.4241,
  'No onions',
  'paid', 'pending'
);
```

✅ Order items created:
```sql
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, line_total)
VALUES 
  ([order-id], [product-id], 'Margherita Pizza Large', 11500, 2, 23000),
  ([order-id], [product-id], 'Garlic Bread', 3500, 1, 3500);
```

✅ Confirmation page displayed:
   - Order number: ORD-20260327-1234
   - Estimated delivery: 45 minutes
   - "Track Order" button

✅ SMS sent to member:
   - "Your order from Napoli Pizza is confirmed. Track: [link]"

---

## PHASE 6: PARTNER DASHBOARD - ORDER MANAGEMENT

### Test 6.1: Partner Receives Order
**URL:** `/partner/orders` (Partner dashboard)

**Expected Results:**
✅ Sound notification plays
✅ Desktop notification: "New order #ORD-20260327-1234"
✅ Order appears in "New Orders" queue
✅ Order card displays:
   - Order number
   - Member name: "John Doe"
   - Delivery address: "Bellville"
   - Items ordered (expandable)
   - Special instructions: "No onions"
   - Total value: R265
   - Cashback to member: R21.20
   - Timestamp

### Test 6.2: Partner Confirms Order
**Steps:**
1. Partner clicks "Confirm Order"
2. Enter estimated prep time: "30 minutes"
3. Click "Confirm"

**Expected Results:**
✅ Order status updated: 'pending' → 'confirmed'
✅ `confirmed_at` timestamp recorded
✅ `estimated_prep_time` set to 30 minutes
✅ SMS sent to member:
   - "Your order is being prepared. Ready in 30 min."
✅ Order moves to "Preparing" queue in partner dashboard

**Database Update:**
```sql
UPDATE orders
SET status = 'confirmed',
    confirmed_at = NOW(),
    estimated_prep_time = 30
WHERE id = [order-id];
```

### Test 6.3: Partner Marks Order Ready
**Steps:**
1. After 25 minutes, partner clicks "Mark as Ready"
2. Confirm action

**Expected Results:**
✅ Order status updated: 'confirmed' → 'ready'
✅ `ready_at` timestamp recorded
✅ System searches for available drivers in zone
✅ Order broadcast to driver queue
✅ Order moves to "Ready for Pickup" in partner dashboard

---

## PHASE 7: DRIVER DASHBOARD - DELIVERY ASSIGNMENT

### Test 7.1: Driver Receives Delivery Request
**URL:** `/driver` (Driver dashboard)

**Prerequisites:**
- Driver logged in
- Availability toggle: ON
- Driver location: Within 5km of partner

**Expected Results:**
✅ Delivery request appears in driver queue
✅ Request card shows:
   - Partner name: "Napoli Pizza"
   - Partner address
   - Delivery address: "12 Voortrekker Road, Bellville"
   - Distance: "3.2km delivery"
   - Delivery fee: R51
   - Driver's share: R47.43 (93%)
   - Estimated time: "12 min drive"
   - "Accept" and "Decline" buttons

### Test 7.2: Driver Accepts Delivery
**Steps:**
1. Driver clicks "Accept"
2. Confirm acceptance

**Expected Results:**
✅ Order status updated: 'ready' → 'driver_assigned'
✅ Driver assigned to order
✅ SMS sent to member:
   - "Mike Smith is picking up your order"
✅ Navigation starts automatically (Google Maps route)
✅ Driver sees:
   - Partner location on map
   - Route to partner
   - ETA to partner
   - "Navigate in Google Maps" button

**Database Update:**
```sql
UPDATE orders
SET status = 'driver_assigned',
    driver_id = [driver-id]
WHERE id = [order-id];
```


### Test 7.3: Driver Picks Up Order
**Steps:**
1. Driver arrives at Napoli Pizza
2. Partner hands over order
3. Driver clicks "Picked Up" button
4. Confirm pickup

**Expected Results:**
✅ Order status updated: 'driver_assigned' → 'picked_up'
✅ `picked_up_at` timestamp recorded
✅ Member's tracking page activates
✅ Driver GPS tracking starts (updates every 5 seconds)
✅ Navigation switches to delivery address
✅ SMS sent to member:
   - "Your order is on the way. Track live: [link]"

**Database Update:**
```sql
UPDATE orders
SET status = 'picked_up',
    picked_up_at = NOW()
WHERE id = [order-id];
```

---

## PHASE 8: MEMBER DASHBOARD - LIVE ORDER TRACKING

### Test 8.1: Member Tracks Order
**URL:** `/go/order/[order-id]`

**Expected Results:**
✅ Order tracking page displays:
   - Order status timeline (visual stepper)
   - Live map with 3 markers:
     - Partner location (blue pin)
     - Delivery address (green pin)
     - Driver location (moving car icon)
   - Route polyline from driver to delivery address
   - Driver information panel:
     - Name: "Mike Smith"
     - Photo
     - Vehicle: "White Toyota Corolla"
     - "Call Driver" button
   - Estimated arrival: "Arriving in 12 minutes"
   - Order details (expandable)

**Real-Time Updates:**
✅ Driver location updates every 5 seconds
✅ Car icon moves smoothly on map
✅ ETA updates dynamically
✅ Status timeline updates when status changes

**Supabase Realtime Subscription:**
```typescript
const subscription = supabase
  .channel(`order:${orderId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, (payload) => {
    setOrderStatus(payload.new.status);
  })
  .subscribe();
```

### Test 8.2: Driver Location Tracking
**Expected Results:**
✅ Driver's GPS coordinates stored in database every 5 seconds:
```sql
INSERT INTO delivery_tracking (order_id, driver_id, latitude, longitude)
VALUES ([order-id], [driver-id], -33.9250, 18.4242);
```

✅ Member's map updates in real-time via Supabase Realtime
✅ Polyline shows actual path taken
✅ ETA recalculates based on remaining distance

---

## PHASE 9: DELIVERY COMPLETION

### Test 9.1: Driver Delivers Order
**Steps:**
1. Driver arrives at delivery address
2. Driver hands order to member
3. Driver clicks "Delivered" button
4. Confirm delivery

**Expected Results:**
✅ Order status updated: 'picked_up' → 'delivered'
✅ `delivered_at` timestamp recorded
✅ Transaction processing begins

**Database Update:**
```sql
UPDATE orders
SET status = 'delivered',
    delivered_at = NOW()
WHERE id = [order-id];
```

### Test 9.2: Transaction Creation - Order Cashback
**Automatic Process:**

**Step 1: Create Transaction Record**
```sql
INSERT INTO transactions (
  partner_id, member_id, agent_id,
  purchase_amount, cashback_percent,
  system_percent, agent_percent, member_percent,
  system_amount, agent_amount, member_amount,
  status, order_id, transaction_type
) VALUES (
  [partner-id], [member-id], [agent-id],
  26500, 10,
  1, 1, 8,
  265, 265, 2120,
  'completed', [order-id], 'online_order'
);
```

**Calculation Breakdown:**
- Purchase amount: R265 (26500 cents)
- Cashback percent: 10%
- Total cashback: R26.50 (2650 cents)
- System (1%): R2.65 (265 cents)
- Agent (1%): R2.65 (265 cents)
- Member (8%): R21.20 (2120 cents)

**Step 2: Allocate Cashback to Cover Plan**
```sql
-- Get member's cover plans in order
SELECT * FROM member_cover_plans
WHERE member_id = [member-id]
  AND status IN ('in_progress', 'active')
ORDER BY creation_order ASC;

-- Update first plan (creation_order = 1)
UPDATE member_cover_plans
SET funded_amount = funded_amount + 2120,
    updated_at = NOW()
WHERE id = [plan-id];

-- Create wallet entry
INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id, transaction_id,
  entry_type, amount, balance_after
) VALUES (
  [member-id], [plan-id], [transaction-id],
  'cashback_added', 2120, 2120
);
```

**Expected Results:**
✅ Transaction record created with status 'completed'
✅ Member's cover plan funded_amount increased: R0 → R21.20
✅ Wallet entry created for audit trail
✅ Cover plan progress updated: R21.20 / R385 (5.5%)

### Test 9.3: Transaction Creation - Delivery Fee Split
**Automatic Process:**

**Step 1: Create Driver Earnings Record**
```sql
INSERT INTO driver_earnings (
  driver_id, order_id,
  total_fee, driver_amount, system_amount, agent_amount
) VALUES (
  [driver-id], [order-id],
  5100, 4743, 255, 102
);
```

**Calculation Breakdown:**
- Total delivery fee: R51 (5100 cents)
- Driver (93%): R47.43 (4743 cents)
- System (5%): R2.55 (255 cents)
- Agent (2%): R1.02 (102 cents)

**Step 2: Credit Driver's Cover Wallet**
```sql
-- If driver is also a member, credit their cover plan
UPDATE member_cover_plans
SET funded_amount = funded_amount + 4743
WHERE member_id = (SELECT member_id FROM members WHERE user_id = [driver-user-id])
  AND status = 'in_progress'
ORDER BY creation_order ASC
LIMIT 1;

-- Create wallet entry
INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id,
  entry_type, amount, balance_after
) VALUES (
  [driver-member-id], [driver-plan-id],
  'delivery_earnings', 4743, [new-balance]
);
```

**Expected Results:**
✅ Driver earnings record created
✅ Driver's cover plan credited with R47.43
✅ System revenue tracked: R2.55
✅ Agent commission tracked: R1.02

### Test 9.4: Notifications Sent
**Expected Results:**
✅ SMS to member:
   - "Order delivered! You earned R21.20 toward cover."
✅ SMS to driver:
   - "Delivery complete. R47.43 added to your cover."
✅ Partner invoice updated (monthly total increased by R26.50)

---

## PHASE 10: POST-DELIVERY - DASHBOARDS UPDATE

### Test 10.1: Member Dashboard Updates
**URL:** `/dashboard`

**Expected Results:**
✅ Cover plan progress updated:
   - Progress bar: R21.20 / R385 (5.5%)
   - Status: "in_progress"
   - Amount needed: R363.80
✅ Recent transactions shows new entry:
   - "Napoli Pizza - R265"
   - "Cashback earned: R21.20"
   - Date/time
✅ Order history shows completed order
✅ "Rate & Review" button available for order

### Test 10.2: Partner Dashboard Updates
**URL:** `/partner/orders`

**Expected Results:**
✅ Order moved to "Completed" tab
✅ Monthly totals updated:
   - Transaction count: +1
   - Cashback liability: +R26.50
✅ Invoice preview shows updated amount

### Test 10.3: Driver Dashboard Updates
**URL:** `/driver`

**Expected Results:**
✅ Earnings today: +R47.43
✅ Deliveries completed: +1
✅ Cover progress updated: R47.43 / R320
✅ Order moved to "Completed Deliveries"
✅ Availability toggle resets to ON (ready for next delivery)

### Test 10.4: Agent Dashboard Updates
**URL:** `/agent/dashboard`

**Expected Results:**
✅ Commission earned this month:
   - Order cashback commission: +R2.65
   - Delivery fee commission: +R1.02
   - Total: +R3.67
✅ Linked partner (Napoli Pizza) transaction count: +1


---

## PHASE 11: ADMIN DASHBOARD - MONITORING

### Test 11.1: Admin Overview
**URL:** `/admin/dashboard`

**Expected Results:**
✅ Dashboard metrics updated:
   - Total orders today: +1
   - Total revenue (system fees): +R5.20 (R2.65 + R2.55)
   - Active members: 1
   - Active partners: 3
   - Active drivers: 1
✅ Recent activity feed shows:
   - "Order #ORD-20260327-1234 delivered"
   - "Member John Doe earned R21.20"
   - "Driver Mike Smith earned R47.43"

### Test 11.2: Admin - Transactions View
**URL:** `/admin/transactions`

**Expected Results:**
✅ Transaction list shows new entry:
   - Transaction ID
   - Date/time
   - Member: "John Doe"
   - Partner: "Napoli Pizza"
   - Agent: [Agent name]
   - Purchase amount: R265
   - Cashback: 10%
   - Split: System R2.65, Agent R2.65, Member R21.20
   - Status: "completed"
✅ Click transaction to view full details
✅ Linked order visible
✅ Cover plan allocation visible

### Test 11.3: Admin - Cover Plans View
**URL:** `/admin/cover-plans`

**Expected Results:**
✅ Member cover plan shows:
   - Member: "John Doe"
   - Plan: "Day1 Health Basic"
   - Target: R385
   - Funded: R21.20
   - Progress: 5.5%
   - Status: "in_progress"
   - Creation order: 1
✅ Click to view wallet entries:
   - Entry type: "cashback_added"
   - Amount: R21.20
   - Transaction link
   - Balance after: R21.20

### Test 11.4: Admin - Invoices View
**URL:** `/admin/invoices`

**Expected Results:**
✅ Partner invoice for current month shows:
   - Partner: "Napoli Pizza"
   - Month: "March 2026"
   - Total amount: R26.50
   - Status: "generated"
   - Due date: [7 days from now]
✅ Click invoice to view line items:
   - Transaction #1: R26.50 (from order)

### Test 11.5: Admin - Audit Logs
**URL:** `/admin/audit-logs`

**Expected Results:**
✅ Audit trail shows all actions:
   - User registration (John Doe)
   - Profile completion
   - Order placement
   - Order status changes
   - Transaction creation
   - Wallet entries
   - Each log entry shows:
     - Timestamp
     - User
     - Action type
     - Table affected
     - Old/new values

---

## PHASE 12: ADDITIONAL TESTING SCENARIOS

### Test 12.1: Multiple Orders - Cover Plan Progression
**Scenario:** Member places 17 more orders to reach cover activation

**Steps:**
1. Place order #2: R200 (R16 cashback)
2. Place order #3: R150 (R12 cashback)
3. Continue until total cashback ≥ R385

**Expected Results:**
✅ Each order adds cashback to same cover plan (creation_order = 1)
✅ Funded amount increases progressively:
   - After order 2: R37.20
   - After order 3: R49.20
   - ...
   - After order 18: R385.00

### Test 12.2: Cover Plan Activation
**Trigger:** Funded amount reaches R385

**Expected Results:**
✅ Cover plan status updated: 'in_progress' → 'active'
✅ `active_from` timestamp set to NOW()
✅ `active_to` timestamp set to NOW() + 30 days
✅ SMS sent to member:
   - "Congratulations! Your health cover is now active."
✅ Dashboard shows:
   - "Cover Status: Active ✓"
   - "Renewal Date: [30 days from now]"
   - "Days Remaining: 30"

**Database Update:**
```sql
UPDATE member_cover_plans
SET status = 'active',
    active_from = NOW(),
    active_to = NOW() + INTERVAL '30 days'
WHERE id = [plan-id]
  AND funded_amount >= target_amount;
```

### Test 12.3: Overflow Cashback
**Scenario:** Member places order after cover plan is fully funded

**Steps:**
1. Cover plan at R385 (fully funded)
2. Place order: R100 (R8 cashback)

**Expected Results:**
✅ R8 cashback goes to overflow_balance
✅ Wallet entry created with entry_type: 'overflow_moved'
✅ Dashboard shows: "Overflow balance: R8.00"
✅ Overflow can be used for:
   - Next 30-day cycle
   - Second cover plan (if created)
   - Dependant cover

**Database Update:**
```sql
UPDATE member_cover_plans
SET overflow_balance = overflow_balance + 800
WHERE id = [plan-id];

INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id, transaction_id,
  entry_type, amount, balance_after
) VALUES (
  [member-id], [plan-id], [transaction-id],
  'overflow_moved', 800, 800
);
```

### Test 12.4: Multiple Cover Plans - Sequential Funding
**Scenario:** Member creates second cover plan

**Steps:**
1. Member requests second plan: "Day1 Health Plus" (R500 target)
2. Admin approves (telephonic approval)
3. Second plan created with creation_order = 2
4. Member places order: R100 (R8 cashback)

**Expected Results:**
✅ First plan (creation_order = 1) is fully funded (R385)
✅ Cashback goes to second plan (creation_order = 2)
✅ Second plan funded_amount: R0 → R8
✅ Wallet entry created for second plan

**Database State:**
```sql
-- Plan 1 (fully funded)
member_cover_plan_id: 1
creation_order: 1
target_amount: 38500
funded_amount: 38500
status: 'active'

-- Plan 2 (in progress)
member_cover_plan_id: 2
creation_order: 2
target_amount: 50000
funded_amount: 800
status: 'in_progress'
```

### Test 12.5: Top-Up Functionality
**Scenario:** Member wants to activate cover faster

**Steps:**
1. Member at R350 / R385 (R35 short)
2. Click "Top Up" button
3. Select "Do Instant EFT"
4. Opens chat with Admin
5. Member makes EFT payment
6. Uploads proof of payment
7. Admin approves top-up

**Expected Results:**
✅ Top-up record created:
```sql
INSERT INTO top_ups (
  payer_type, payer_id, member_cover_plan_id,
  amount, payment_method, reference_note
) VALUES (
  'member', [member-id], [plan-id],
  3500, 'eft', 'Proof uploaded'
);
```

✅ Admin approves:
```sql
UPDATE top_ups
SET approved_by = [admin-id]
WHERE id = [top-up-id];

-- Credit cover plan
UPDATE member_cover_plans
SET funded_amount = funded_amount + 3500
WHERE id = [plan-id];

-- Create wallet entry
INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id,
  entry_type, amount, balance_after
) VALUES (
  [member-id], [plan-id],
  'top_up', 3500, 38500
);
```

✅ Cover plan activates immediately (R350 + R35 = R385)
✅ SMS sent: "Top-up approved. Your cover is now active!"

### Test 12.6: Partner Suspension
**Scenario:** Partner has overdue invoice

**Steps:**
1. Admin marks partner invoice as overdue (14 days past due)
2. Admin suspends partner

**Expected Results:**
✅ Partner status updated: 'active' → 'suspended'
✅ Partner cannot receive new orders
✅ Existing orders remain active (completed normally)
✅ Partner storefront shows: "Temporarily unavailable"
✅ Removed from directory search results
✅ Member trying to order sees:
   - "Transaction error, please contact administrator"

**Database Update:**
```sql
UPDATE partners
SET status = 'suspended'
WHERE id = [partner-id];
```

### Test 12.7: Dispute Resolution
**Scenario:** Member didn't receive full order

**Steps:**
1. Member clicks "Report Problem" on order
2. Selects dispute type: "wrong_amount"
3. Writes description: "Missing garlic bread"
4. Submits dispute
5. Admin reviews dispute
6. Admin resolves: Partial refund R35

**Expected Results:**
✅ Dispute record created:
```sql
INSERT INTO disputes (
  transaction_id, member_id, partner_id,
  dispute_type, description, status
) VALUES (
  [transaction-id], [member-id], [partner-id],
  'wrong_amount', 'Missing garlic bread', 'open'
);
```

✅ Admin resolves:
```sql
UPDATE disputes
SET status = 'resolved',
    resolution_note = 'Partial refund issued',
    resolved_by = [admin-id],
    resolved_at = NOW()
WHERE id = [dispute-id];

-- Reverse partial transaction
UPDATE transactions
SET member_amount = member_amount - 2800
WHERE id = [transaction-id];

-- Adjust cover plan
UPDATE member_cover_plans
SET funded_amount = funded_amount - 2800
WHERE id = [plan-id];

-- Create reversal entry
INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id, transaction_id,
  entry_type, amount, balance_after
) VALUES (
  [member-id], [plan-id], [transaction-id],
  'reversal', -2800, [new-balance]
);
```

✅ Member refunded R35
✅ Cashback adjusted: R21.20 → R18.40
✅ SMS sent: "Dispute resolved. R35 refunded."


---

## PHASE 13: CROSS-PLATFORM INTEGRATION TEST

### Test 13.1: Plus1 Rewards In-Store Transaction
**Scenario:** Same member shops in-store at partner

**Steps:**
1. Member visits physical store (not Plus1-Go)
2. Shows QR code at POS
3. Partner scans QR code
4. Partner enters purchase: R150
5. Transaction processed

**Expected Results:**
✅ Transaction created in Plus1 Rewards system
✅ Cashback calculated: R150 × 10% = R15
   - System: R1.50
   - Agent: R1.50
   - Member: R12.00
✅ Member's cover plan credited with R12
✅ Same cover plan used (unified wallet)
✅ Plus1-Go dashboard shows updated balance:
   - Previous: R21.20
   - New: R33.20
✅ Transaction visible in both Plus1 Rewards and Plus1-Go

**Database Verification:**
```sql
-- Check transaction
SELECT * FROM transactions
WHERE member_id = [member-id]
  AND transaction_type = 'in_store'
ORDER BY created_at DESC LIMIT 1;

-- Check cover plan balance
SELECT funded_amount FROM member_cover_plans
WHERE member_id = [member-id]
  AND creation_order = 1;
-- Should show: 33.20 (21.20 + 12.00)
```

### Test 13.2: Unified Login
**Scenario:** Member registered on Plus1-Go, logs into Plus1 Rewards

**Steps:**
1. Member opens Plus1 Rewards app
2. Enters same mobile number: "0821234567"
3. Enters same PIN: "123456"
4. Logs in

**Expected Results:**
✅ Login successful (same user account)
✅ Same QR code displayed
✅ Same cover plan visible
✅ Same wallet balance: R33.20
✅ Transaction history shows both:
   - In-store transactions
   - Online orders (Plus1-Go)

### Test 13.3: Cover Activation Across Platforms
**Scenario:** Member reaches R385 through mixed transactions

**Transaction History:**
- Plus1-Go orders: R300 cashback
- In-store purchases: R85 cashback
- Total: R385

**Expected Results:**
✅ Cover activates when total reaches R385
✅ Activation visible on both platforms:
   - Plus1-Go dashboard: "Cover Status: Active ✓"
   - Plus1 Rewards dashboard: "Cover Status: Active ✓"
✅ Same renewal date on both platforms
✅ SMS sent once (not duplicate)

---

## PHASE 14: MONTHLY PROCESSES

### Test 14.1: Partner Invoice Generation
**Trigger:** End of month (automated job)

**Expected Results:**
✅ Invoice generated for each partner:
```sql
INSERT INTO partner_invoices (
  partner_id, invoice_month, total_amount, due_date, status
)
SELECT 
  partner_id,
  '2026-03',
  SUM(system_amount + agent_amount + member_amount),
  CURRENT_DATE + INTERVAL '7 days',
  'generated'
FROM transactions
WHERE DATE_TRUNC('month', created_at) = '2026-03-01'
  AND status = 'completed'
GROUP BY partner_id;
```

✅ Invoice line items created:
```sql
INSERT INTO invoice_items (invoice_id, transaction_id, amount, description)
SELECT 
  [invoice-id],
  id,
  system_amount + agent_amount + member_amount,
  'Order #' || order_number
FROM transactions
WHERE partner_id = [partner-id]
  AND DATE_TRUNC('month', created_at) = '2026-03-01';
```

✅ Partner notified via email/SMS
✅ Invoice visible in partner dashboard
✅ Admin can view all invoices

### Test 14.2: Agent Commission Calculation
**Trigger:** End of month (automated job)

**Expected Results:**
✅ Commission calculated for each agent:
```sql
INSERT INTO agent_commissions (agent_id, month, total_amount, payout_status)
SELECT 
  agent_id,
  '2026-03',
  SUM(agent_amount),
  'pending'
FROM transactions
WHERE DATE_TRUNC('month', created_at) = '2026-03-01'
  AND status = 'completed'
  AND agent_id IS NOT NULL
GROUP BY agent_id;
```

✅ Agent dashboard shows:
   - Commission earned: R[amount]
   - Payout status: "Pending"
✅ Admin can mark as paid
✅ Agent receives payout notification

### Test 14.3: Provider Export
**Trigger:** Monthly export to Day1 Health

**Expected Results:**
✅ Export batch created:
```sql
INSERT INTO provider_exports (
  provider_id, export_month, total_cover_plans, total_value, status
)
SELECT 
  [provider-id],
  '2026-03',
  COUNT(*),
  SUM(target_amount),
  'pending'
FROM member_cover_plans
WHERE status = 'active'
  AND active_from >= '2026-03-01'
  AND active_from < '2026-04-01';
```

✅ Export items created:
```sql
INSERT INTO provider_export_items (
  provider_export_id, member_cover_plan_id, export_status
)
SELECT 
  [export-id],
  id,
  'pending'
FROM member_cover_plans
WHERE status = 'active'
  AND active_from >= '2026-03-01'
  AND active_from < '2026-04-01';
```

✅ Provider dashboard shows new export
✅ Admin can download CSV/Excel
✅ Export includes:
   - Member name
   - ID number
   - Cover plan name
   - Activation date
   - Renewal date

### Test 14.4: Cover Plan Renewal Check
**Trigger:** Daily job checks plans reaching 30-day mark

**Scenario:** Member's cover plan active_to date reached

**Expected Results:**
✅ System checks wallet balance
✅ If balance ≥ R385:
   - R385 deducted from wallet
   - active_from updated to NOW()
   - active_to updated to NOW() + 30 days
   - Status remains 'active'
   - SMS: "Your cover has been renewed for 30 days"
✅ If balance < R385:
   - Status changed to 'suspended'
   - SMS: "Your cover is suspended. Add R[shortfall] to reactivate"

**Database Update:**
```sql
-- Renewal (sufficient balance)
UPDATE member_cover_plans
SET funded_amount = funded_amount - 38500,
    active_from = NOW(),
    active_to = NOW() + INTERVAL '30 days'
WHERE id = [plan-id]
  AND active_to <= NOW()
  AND funded_amount >= 38500;

-- Suspension (insufficient balance)
UPDATE member_cover_plans
SET status = 'suspended',
    suspended_at = NOW()
WHERE id = [plan-id]
  AND active_to <= NOW()
  AND funded_amount < 38500;
```

---

## PHASE 15: EDGE CASES & ERROR HANDLING

### Test 15.1: Order Cancellation by Member
**Scenario:** Member cancels before partner confirms

**Steps:**
1. Member places order
2. Order status: 'pending'
3. Member clicks "Cancel Order"
4. Confirms cancellation

**Expected Results:**
✅ Order status updated: 'pending' → 'cancelled'
✅ Refund issued automatically
✅ Partner notified
✅ No cashback credited
✅ SMS: "Order cancelled. Refund processed."

### Test 15.2: Order Rejection by Partner
**Scenario:** Partner out of stock

**Steps:**
1. Order status: 'pending'
2. Partner clicks "Reject Order"
3. Selects reason: "Out of stock"
4. Confirms rejection

**Expected Results:**
✅ Order status updated: 'pending' → 'cancelled'
✅ Refund issued to member
✅ SMS: "Order cancelled by Napoli Pizza. Refund processed."
✅ Partner's rejection rate tracked
✅ If rejection rate > 30%: Admin warning

### Test 15.3: Driver Unavailable
**Scenario:** No drivers accept delivery

**Steps:**
1. Order status: 'ready'
2. Broadcast to 5 drivers
3. All drivers decline or timeout (60 seconds)

**Expected Results:**
✅ Order remains in 'ready' status
✅ System broadcasts to next batch of drivers
✅ If no driver after 3 rounds:
   - Admin notified
   - Member notified: "Delivery delayed. Finding driver."
   - Option to cancel with full refund

### Test 15.4: Payment Failure
**Scenario:** Payment gateway error

**Steps:**
1. Member proceeds to checkout
2. Redirected to Ozow
3. Payment fails (insufficient funds)
4. Redirected back to Plus1-Go

**Expected Results:**
✅ Order not created
✅ Cart preserved
✅ Error message: "Payment failed. Please try again."
✅ Member can retry payment
✅ No transaction created in database

### Test 15.5: GPS Tracking Failure
**Scenario:** Driver's GPS unavailable

**Steps:**
1. Driver accepts delivery
2. GPS signal lost (tunnel, poor signal)
3. Location updates stop

**Expected Results:**
✅ Member's map shows last known location
✅ Message: "Driver location temporarily unavailable"
✅ ETA based on last known position
✅ "Call Driver" button still works
✅ When GPS returns, tracking resumes

### Test 15.6: Duplicate Order Prevention
**Scenario:** Member double-clicks "Place Order"

**Expected Results:**
✅ First click creates order
✅ Second click blocked (button disabled)
✅ Only one order created
✅ No duplicate transactions

### Test 15.7: Partner Closed During Order
**Scenario:** Partner closes while order in progress

**Steps:**
1. Member places order at 9:55 PM
2. Partner closes at 10:00 PM
3. Order status: 'pending'

**Expected Results:**
✅ Order still processed (already accepted)
✅ New orders blocked after 10:00 PM
✅ Partner can still confirm existing orders
✅ Menu shows "Closed" for new customers


---

## PHASE 16: PERFORMANCE & SECURITY TESTING

### Test 16.1: Database Performance
**Load Test:**
- 100 concurrent orders
- 50 concurrent GPS updates
- 20 concurrent dashboard loads

**Expected Results:**
✅ All queries complete < 500ms
✅ No database locks
✅ Indexes used efficiently
✅ Connection pool stable

**Key Indexes to Verify:**
```sql
-- Orders
CREATE INDEX idx_orders_member ON orders(member_id);
CREATE INDEX idx_orders_partner ON orders(partner_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Transactions
CREATE INDEX idx_transactions_member ON transactions(member_id);
CREATE INDEX idx_transactions_partner ON transactions(partner_id);

-- Cover Plans
CREATE INDEX idx_cover_plans_member ON member_cover_plans(member_id);
CREATE INDEX idx_cover_plans_status ON member_cover_plans(status);
```

### Test 16.2: Row-Level Security (RLS)
**Test Member Access:**
```sql
-- Member should only see own data
SELECT * FROM orders WHERE member_id != [current-member-id];
-- Should return 0 rows (blocked by RLS)

SELECT * FROM member_cover_plans WHERE member_id != [current-member-id];
-- Should return 0 rows (blocked by RLS)
```

**Test Partner Access:**
```sql
-- Partner should only see own orders
SELECT * FROM orders WHERE partner_id != [current-partner-id];
-- Should return 0 rows (blocked by RLS)
```

**Test Driver Access:**
```sql
-- Driver should only see assigned orders
SELECT * FROM orders WHERE driver_id != [current-driver-id];
-- Should return 0 rows (blocked by RLS)
```

### Test 16.3: Authentication Security
**Test Cases:**
- ✅ JWT token expires after 24 hours
- ✅ Refresh token rotation works
- ✅ Invalid token rejected
- ✅ PIN stored as hash (bcrypt)
- ✅ PIN never returned in API responses
- ✅ Session invalidated on logout

### Test 16.4: Input Validation
**Test Cases:**
- ✅ SQL injection prevented (parameterized queries)
- ✅ XSS prevented (sanitized inputs)
- ✅ Phone number format validated (10 digits)
- ✅ PIN format validated (6 digits)
- ✅ Negative amounts rejected
- ✅ Invalid coordinates rejected

---

## PHASE 17: COMPLETE TEST CHECKLIST

### Member Journey ✅
- [x] Registration
- [x] Login
- [x] Profile completion
- [x] Partner discovery
- [x] Menu browsing
- [x] Add to cart
- [x] Checkout
- [x] Payment
- [x] Order tracking
- [x] Delivery confirmation
- [x] Cashback received
- [x] Cover plan progress
- [x] Cover activation
- [x] Order history
- [x] Reviews

### Partner Journey ✅
- [x] Registration
- [x] Login
- [x] Menu management
- [x] Order notification
- [x] Order confirmation
- [x] Mark ready
- [x] Invoice viewing
- [x] Payment tracking

### Driver Journey ✅
- [x] Registration
- [x] Login
- [x] Availability toggle
- [x] Delivery request
- [x] Accept delivery
- [x] Navigate to partner
- [x] Pick up order
- [x] Navigate to member
- [x] Deliver order
- [x] Earnings tracking
- [x] Cover plan progress

### Agent Journey ✅
- [x] Dashboard overview
- [x] Partner management
- [x] Commission tracking
- [x] Monthly payout

### Admin Journey ✅
- [x] Dashboard overview
- [x] Member management
- [x] Partner management
- [x] Driver management
- [x] Order monitoring
- [x] Transaction viewing
- [x] Invoice generation
- [x] Commission calculation
- [x] Cover plan monitoring
- [x] Dispute resolution
- [x] Top-up approval
- [x] Provider export
- [x] Audit logs

### Integration Tests ✅
- [x] Plus1-Go + Plus1-Rewards unified wallet
- [x] Cross-platform login
- [x] Unified transaction history
- [x] Cover activation across platforms

### Monthly Processes ✅
- [x] Invoice generation
- [x] Commission calculation
- [x] Provider export
- [x] Cover renewal check

### Edge Cases ✅
- [x] Order cancellation
- [x] Partner rejection
- [x] Driver unavailable
- [x] Payment failure
- [x] GPS tracking failure
- [x] Duplicate prevention
- [x] Partner closed

### Security & Performance ✅
- [x] RLS policies
- [x] Authentication
- [x] Input validation
- [x] Database performance
- [x] Load testing

---

## PHASE 18: TEST DATA SUMMARY

### Test Member
```
Name: John Doe
Phone: 0821234567
PIN: 123456
Email: john.doe@example.com
ID: 9001015800083
Bank: FNB 62123456789
Address: 12 Voortrekker Road, Bellville
```

### Test Partner
```
Name: Napoli Pizza
Cashback: 10%
Category: Restaurant
Address: 45 Voortrekker Road, Bellville
Status: Active
Agent: [Test Agent]
```

### Test Driver
```
Name: Mike Smith
Phone: 0827654321
Vehicle: White Toyota Corolla
License: ABC123GP
Status: Active
```

### Test Agent
```
Name: Sarah Johnson
Phone: 0823456789
Partners: 3 (including Napoli Pizza)
Commission: 1% order + 2% delivery
```

### Test Order
```
Order Number: ORD-20260327-1234
Items: 
  - Margherita Pizza Large x2 (R230)
  - Garlic Bread x1 (R35)
Subtotal: R265
Delivery: R51
Total: R316
Cashback: R21.20 (member)
Delivery Earnings: R47.43 (driver)
```

---

## PHASE 19: VERIFICATION QUERIES

### Verify Member Registration
```sql
SELECT 
  u.id as user_id,
  u.full_name,
  u.mobile_number,
  u.role,
  m.id as member_id,
  m.qr_code,
  m.profile_completed,
  mcp.id as cover_plan_id,
  mcp.target_amount,
  mcp.funded_amount,
  mcp.status
FROM users u
JOIN members m ON u.id = m.user_id
JOIN member_cover_plans mcp ON m.id = mcp.member_id
WHERE u.mobile_number = '0821234567';
```

### Verify Order Flow
```sql
SELECT 
  o.order_number,
  o.status,
  o.subtotal,
  o.delivery_fee,
  o.total_amount,
  o.created_at,
  o.confirmed_at,
  o.ready_at,
  o.picked_up_at,
  o.delivered_at,
  p.shop_name as partner,
  m.full_name as member,
  d.full_name as driver
FROM orders o
JOIN partners p ON o.partner_id = p.id
JOIN members m ON o.member_id = m.id
LEFT JOIN users d ON o.driver_id = d.id
WHERE o.order_number = 'ORD-20260327-1234';
```

### Verify Cashback Allocation
```sql
SELECT 
  t.id as transaction_id,
  t.purchase_amount,
  t.cashback_percent,
  t.member_amount,
  t.status,
  cpwe.entry_type,
  cpwe.amount,
  cpwe.balance_after,
  mcp.funded_amount,
  mcp.target_amount,
  mcp.status as plan_status
FROM transactions t
JOIN cover_plan_wallet_entries cpwe ON t.id = cpwe.transaction_id
JOIN member_cover_plans mcp ON cpwe.member_cover_plan_id = mcp.id
WHERE t.order_id = [order-id];
```

### Verify Driver Earnings
```sql
SELECT 
  de.total_fee,
  de.driver_amount,
  de.system_amount,
  de.agent_amount,
  o.order_number,
  u.full_name as driver_name
FROM driver_earnings de
JOIN orders o ON de.order_id = o.id
JOIN drivers d ON de.driver_id = d.id
JOIN users u ON d.user_id = u.id
WHERE o.order_number = 'ORD-20260327-1234';
```

### Verify Invoice Generation
```sql
SELECT 
  pi.invoice_month,
  pi.total_amount,
  pi.due_date,
  pi.status,
  p.shop_name,
  COUNT(ii.id) as line_item_count
FROM partner_invoices pi
JOIN partners p ON pi.partner_id = p.id
LEFT JOIN invoice_items ii ON pi.id = ii.invoice_id
WHERE pi.invoice_month = '2026-03'
GROUP BY pi.id, p.shop_name;
```

### Verify Agent Commission
```sql
SELECT 
  ac.month,
  ac.total_amount,
  ac.payout_status,
  u.full_name as agent_name,
  COUNT(DISTINCT t.partner_id) as partner_count,
  COUNT(t.id) as transaction_count
FROM agent_commissions ac
JOIN agents a ON ac.agent_id = a.id
JOIN users u ON a.user_id = u.id
LEFT JOIN transactions t ON a.id = t.agent_id 
  AND DATE_TRUNC('month', t.created_at) = ac.month::date
WHERE ac.month = '2026-03'
GROUP BY ac.id, u.full_name;
```

---

## PHASE 20: SUCCESS CRITERIA

### System Integration ✅
- Member can register once and use both Plus1-Go and Plus1-Rewards
- Single wallet accumulates cashback from both platforms
- Cover plan activates when threshold reached
- All dashboards update in real-time

### Order Flow ✅
- Member can browse partners, add items, checkout, and pay
- Partner receives order, confirms, and marks ready
- Driver accepts, picks up, and delivers
- All status changes tracked and notified

### Financial Accuracy ✅
- Cashback split calculated correctly (1% + 1% + remainder)
- Delivery fee split calculated correctly (93% + 5% + 2%)
- Cover plans funded in correct order
- Invoices generated accurately
- Commissions calculated correctly

### Real-Time Features ✅
- GPS tracking updates every 5 seconds
- Order status updates instantly
- Dashboard metrics update in real-time
- Notifications sent immediately

### Security ✅
- RLS policies prevent unauthorized access
- Authentication required for all actions
- PINs stored as hashes
- Input validation prevents injection attacks

### Performance ✅
- Page loads < 2 seconds
- Database queries < 500ms
- Real-time updates < 1 second latency
- System handles 100+ concurrent users

---

## CONCLUSION

This comprehensive test flow covers the complete Plus1-Go + Plus1-Rewards ecosystem from member registration through food delivery, cashback allocation, cover plan funding, and all associated dashboards.

**Total Test Phases:** 20  
**Total Test Cases:** 100+  
**Dashboards Tested:** 5 (Member, Partner, Driver, Agent, Admin)  
**Integration Points:** 7 database tables  
**Edge Cases:** 15+  

**Status:** ✅ READY FOR IMPLEMENTATION

---

## NEXT STEPS

1. **Set up test environment**
   - Create test database with seed data
   - Configure test accounts
   - Set up payment gateway test mode

2. **Run automated tests**
   - Unit tests for calculations
   - Integration tests for order flow
   - E2E tests for complete journey

3. **Manual testing**
   - Follow this document step-by-step
   - Verify all expected results
   - Document any issues

4. **Performance testing**
   - Load test with 100+ concurrent users
   - Stress test database queries
   - Monitor real-time updates

5. **Security audit**
   - Verify RLS policies
   - Test authentication
   - Validate input sanitization

6. **User acceptance testing**
   - Real users test the flow
   - Gather feedback
   - Iterate and improve

---

**Document Version:** 1.0  
**Last Updated:** March 27, 2026  
**Status:** Complete and Ready for Testing
