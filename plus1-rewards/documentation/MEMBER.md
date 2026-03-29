# MEMBER - Complete Feature & Activity Guide

**Role:** Member (Customer)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Shop at partner stores, earn cashback, fund medical cover plans, order deliveries

---

## 1. REGISTRATION & ONBOARDING

### 1.1 Initial Registration
- Enter full name
- Enter mobile number (becomes login username)
- Create 6-digit PIN (becomes login password)
- Accept terms and conditions
- Submit registration

### 1.2 Account Creation (Automatic)
- System creates member account
- System generates unique QR code
- System assigns default cover plan
- Account status set to 'active'
- Member can now log in

### 1.3 Profile Completion (Optional but Recommended)
- Add email address
- Add South African ID number
- Add date of birth
- Add profile picture
- Add city and suburb
- Add default delivery address
- Save multiple delivery addresses
- Set GPS coordinates for delivery

---

## 2. LOGIN & AUTHENTICATION

### 2.1 Login Process
- Enter cell phone number (10 digits)
- Enter 6-digit PIN
- No OTP required
- Authentication uses `members` table directly (cell_phone + pin_code)
- No central users table - each role authenticates independently
- Access member dashboard

### 2.2 Session Management
- Session stores member data directly
- Dashboard fetches fresh data from database on each load
- Stay logged in (remember me for 30 days)
- Log out (clears session)
- Forgot PIN (contact admin)

---

## 3. MEMBER DASHBOARD (REWARDS)

### 3.1 Dashboard Overview
**View:**
- Member name
- Cell phone number
- QR code (for in-store scanning)
- Current cover plan name
- Cover plan status (🟢 Active / 🟡 In Progress / 🔴 Suspended)
- Cashback progress bar
- Funded amount vs target amount
- Days remaining in active cycle (if active)
- Overflow cashback balance (available for upgrades/dependants/sponsoring)
- Total transactions count
- Last transaction date
- Recent transactions (last 5)

**Dashboard Data:**
- Fetches fresh member data from database on each load
- Shows latest profile information (email, SA ID, suburb, city)
- Real-time cover plan status
- Accurate overflow balance

### 3.2 Cover Plan Section
**View:**
- Current cover plan details
- Plan name (e.g., "Day to Day Single")
- Monthly target amount (e.g., R385)
- Funded amount (amount allocated to plan)
- Status badge:
  - 🟢 ACTIVE (plan is active with coverage)
  - 🟡 IN PROGRESS (building up cashback)
  - 🔴 SUSPENDED (insufficient funds)
- Active from date
- Active to date (30-day cycle end)
- Progress percentage
- Amount still needed (if in progress)
- Next renewal date

**Status Messages:**
- In Progress (< 100%): "⏳ Keep shopping to build up your cashback! R[amount] more needed."
- In Progress (100% reached): "🎉 Congratulations! Your medical cover plan target has been reached! Complete your dashboard information to activate your cover."
- Active: "✓ Policy Active - Coverage until [date]"
- Suspended: "⚠ Not enough cashback yet. Shop more or top up to reactivate your cover."

**Actions:**
- View cover plan history
- Request plan upgrade (if overflow available)
- Request plan change (requires telephonic approval)

### 3.3 Multiple Cover Plans
**View:**
- List all linked cover plans
- Main member cover plan
- Dependant cover plans
- Additional cover plans
- Creation order (funding priority)
- Status of each plan
- Funded amount for each

**Actions:**
- Add new cover plan (requires telephonic approval)
- View funding order
- See which plan is currently being funded

### 3.4 Overflow Cashback
**View:**
- Total overflow balance (extra cashback after plan is funded)
- Overflow history
- How overflow is allocated

**Cashback Balance Breakdown (shown on dashboard):**
- Total Cashback Earned: R[amount] (member cashback only, no system/agent shown)
- Allocated to Cover Plan: -R[amount]
- Available Balance (Overflow): R[amount]

**Important Notes:**
- Only member cashback is shown (14% for 16% partner)
- System (1%) and agent (1%) commissions are NOT displayed to members
- Overflow updates automatically when active plan receives new cashback
- Overflow can be used for upgrades, dependants, or sponsoring

**Actions:**
- View overflow transactions
- See overflow applied to next cycle
- Use overflow for plan upgrades
- Use overflow for dependants

### 3.5 Dependants & Linked People
**View:**
- List of linked dependants
- Dependant names
- ID numbers
- Cover plan status for each
- Funded amounts

**Actions:**
- Request to add dependant (requires telephonic approval)
- View dependant cover plan progress
- Contact admin for dependant changes

---

## 4. TRANSACTIONS (REWARDS)

### 4.1 In-Store Shopping
**Process:**
- Shop at partner store
- Give mobile number OR show QR code to partner
- Partner enters transaction amount
- System calculates cashback
- Cashback added to cover plan
- Receive transaction confirmation

### 4.2 Transaction History
**View:**
- List of all transactions
- Transaction date and time
- Partner name
- Purchase amount
- Cashback percentage
- Cashback amount earned
- System fee (1%)
- Agent commission (1%)
- Member cashback received
- Transaction status (completed/pending/reversed)
- Transaction type (in_store/delivery)

**Filter:**
- By date range
- By partner
- By transaction type
- By status

**Actions:**
- View transaction details
- Report dispute
- Download transaction history

### 4.3 Cashback Breakdown
**View per transaction (member view only):**
- Total purchase amount
- Member cashback amount (e.g., 14% for 16% partner)
- Which cover plan was funded
- Overflow amount (if plan already active)

**Note:** System (1%) and agent (1%) commissions are NOT shown to members. Members only see their own cashback portion.

---

## 5. TOP-UP SYSTEM

### 5.1 View Top-Up Options
**When needed:**
- Cover plan suspended (insufficient funds)
- Want to reach target faster
- Need to activate plan immediately

### 5.2 Top-Up Methods
**Option 1: EFT to Admin**
- View admin bank details
- Make EFT payment
- Upload proof of payment
- Wait for admin confirmation

**Option 2: Instant EFT Button**
- Click "Do Instant EFT" button
- Opens direct chat with admin
- Arrange instant payment
- Admin confirms and applies top-up

### 5.3 Top-Up Types
- Full top-up (complete shortfall)
- Partial top-up (reduce shortfall)
- Advance top-up (fund ahead of time)

### 5.4 Top-Up History
**View:**
- All top-up transactions
- Date and amount
- Payment method
- Reference number
- Which cover plan was topped up
- Approved by (admin name)
- Status (pending/approved/rejected)

---

## 6. MEMBER DASHBOARD (PLUS1-GO)

### 6.1 Plus1-Go Home Screen
**View:**
- Delivery/Pickup toggle
- Current delivery address
- "Deliver now" dropdown
- Browse partner shops
- Category filters
- Search bar
- Featured promotions
- Speedy deliveries section
- Today's offers section

### 6.2 Browse Partners (Restaurants/Shops)
**View:**
- Partner name and logo
- Partner rating (stars)
- Delivery fee
- Estimated delivery time
- Distance from member
- "Free delivery" badge (if applicable)
- Promotional badges
- Opening hours
- Currently open/closed status

**Filter:**
- By category (Grocery, Pizza, Sushi, Burgers, etc.)
- By delivery fee
- By delivery time (Under 30 min)
- By rating (Highest rated)
- By offers
- Sort options

**Actions:**
- Mark partner as favorite
- View partner details
- Browse partner menu

### 6.3 Partner Detail View
**View:**
- Partner banner image
- Partner logo
- Partner name
- Rating and total reviews
- Delivery fee
- Estimated prep time
- Minimum order value
- Delivery radius
- Opening hours
- Store description
- Product categories
- Full product catalog

**Actions:**
- Add products to cart
- View product details
- Read reviews
- Mark as favorite

### 6.4 Product Catalog
**View per product:**
- Product image
- Product name
- Product description
- Price
- Category
- Availability status
- Modifiers/options (if any)

**Actions:**
- View product details
- Select quantity
- Add to cart
- View nutritional info (if available)

---

## 7. SHOPPING CART (PLUS1-GO)

### 7.1 Cart Management
**View:**
- All items in cart
- Product names
- Quantities
- Individual prices
- Line totals
- Subtotal
- Delivery fee
- Total amount
- Estimated cashback to earn

**Actions:**
- Increase quantity
- Decrease quantity
- Remove item
- Clear cart
- Continue shopping
- Proceed to checkout

### 7.2 Cart Badge
**View:**
- Cart icon with item count
- Quick access from any screen

---

## 8. CHECKOUT & ORDER PLACEMENT (PLUS1-GO)

### 8.1 Delivery Options
**Select:**
- Delivery (to address)
- Collection (pickup from partner)

### 8.2 Delivery Address (if delivery selected)
**Options:**
- Use default address
- Select from saved addresses
- Enter new address
- Set GPS coordinates
- Add special instructions

### 8.3 Order Summary
**View:**
- Partner name
- All order items
- Quantities and prices
- Subtotal
- Delivery fee (if delivery)
- Total amount
- Estimated cashback breakdown:
  - System (1%)
  - Agent (1%)
  - Member cashback
- Which cover plan will be funded
- Estimated delivery time

### 8.4 Payment
**Select payment method:**
- Saved payment method
- New card
- EFT
- Other payment options

**Actions:**
- Enter payment details
- Authorize payment
- Place order

### 8.5 Order Confirmation
**View:**
- Order number
- Order status
- Estimated delivery time
- Partner details
- Order items
- Total paid
- Cashback earned

---

## 9. ORDER TRACKING (PLUS1-GO)

### 9.1 Active Orders
**View:**
- Order number
- Partner name
- Order status:
  - Pending (waiting for partner confirmation)
  - Confirmed (partner accepted)
  - Preparing (partner preparing order)
  - Ready (ready for pickup/delivery)
  - Driver Assigned (driver on the way to partner)
  - Picked Up (driver has order)
  - On The Way (driver delivering)
  - Delivered (order complete)
  - Cancelled

### 9.2 Live Tracking (if delivery)
**View:**
- Driver name
- Driver photo
- Driver rating
- Vehicle details
- Driver location on map (GPS)
- Estimated arrival time
- Contact driver button

**Actions:**
- Call driver
- Message driver
- View driver location in real-time

### 9.3 Order Updates
**Receive notifications for:**
- Order confirmed by partner
- Order being prepared
- Order ready
- Driver assigned
- Driver picked up order
- Driver on the way
- Order delivered

---

## 10. ORDER HISTORY (PLUS1-GO)

### 10.1 Past Orders
**View:**
- All completed orders
- Order date and time
- Partner name
- Order number
- Total amount
- Delivery fee
- Cashback earned
- Order status
- Items ordered

**Filter:**
- By date range
- By partner
- By status

**Actions:**
- View order details
- Reorder (add same items to cart)
- Rate order
- Leave review
- Report issue

### 10.2 Order Details
**View:**
- Complete order breakdown
- All items with quantities
- Prices
- Subtotal
- Delivery fee
- Total paid
- Cashback earned and applied
- Delivery address
- Driver details (if delivery)
- Timestamps (placed, confirmed, delivered)

---

## 11. RATINGS & REVIEWS

### 11.1 Rate Partner
**After order delivery:**
- Rate partner (1-5 stars)
- Write review text
- Submit review

### 11.2 Rate Driver
**After delivery:**
- Rate driver (1-5 stars)
- Write review text
- Submit review

### 11.3 View Reviews
**See:**
- Partner reviews from other members
- Average ratings
- Recent reviews

---

## 12. FAVORITES & WISHLIST

### 12.1 Favorite Partners
**Actions:**
- Mark partner as favorite (heart icon)
- View all favorite partners
- Quick access to favorites
- Remove from favorites

### 12.2 Favorite Products
**Actions:**
- Save favorite products
- Quick reorder from favorites

---

## 13. SAVED ADDRESSES

### 13.1 Address Management
**View:**
- All saved delivery addresses
- Default address marked
- Address labels (Home, Work, etc.)

**Actions:**
- Add new address
- Edit existing address
- Delete address
- Set default address
- Set GPS coordinates

---

## 14. PAYMENT METHODS

### 14.1 Payment Management
**View:**
- Saved payment methods
- Card last 4 digits
- Payment method type
- Default payment method
- Authorization status

**Actions:**
- Add new payment method
- Remove payment method
- Set default payment method
- Update payment details
- Authorize payment method

### 14.2 Bank Details (for cashback payouts if applicable)
**Add:**
- Bank name
- Account number
- Account holder name
- Branch code

---

## 15. PROFILE MANAGEMENT

### 15.1 View Profile (Edit Profile Section on Dashboard)
**See:**
- Full name (cannot edit - contact support)
- Cell phone number (cannot edit - contact support)
- Email address (editable)
- SA ID number (editable)
- Suburb (editable)
- City (editable)
- Account status (display only)

**Profile Completion Requirements:**
- Valid email address (not @plus1rewards.local placeholder)
- SA ID number
- Suburb
- City

**Profile Incomplete Modal:**
- Shows when plan reaches 90%+ or 100%
- Title: "Dashboard Update Required!"
- Message: "Your cover plan cannot be activated until you complete your member dashboard."
- Lists missing fields
- Button: "Go to Member Dashboard" (scrolls to edit section)

### 15.2 Edit Profile
**Update:**
- Email address
- SA ID number
- Suburb
- City

**Cannot change:**
- Full name (contact support to change)
- Cell phone number (used for login - contact support)
- PIN (requires separate process)

**Save Changes:**
- Click "Save Changes" button
- Dashboard reloads with fresh data from database
- Profile completion check runs automatically
- If complete and plan at 100%, plan activates automatically

### 15.3 Change PIN
**Process:**
- Enter current PIN
- Enter new 6-digit PIN
- Confirm new PIN
- Submit change

### 15.4 KYC Status
**View:**
- KYC verification status (pending/verified/rejected)
- Required documents
- Upload documents if needed

---

## 16. NOTIFICATIONS

### 16.1 Push Notifications
**Receive notifications for:**
- Cover plan became Active
- Cover plan suspended
- Cover plan renewal due
- Transaction completed
- Cashback added
- Top-up approved
- Order confirmed
- Order status updates
- Driver assigned
- Order delivered
- Promotional offers
- New partners in area

### 16.2 Notification Settings
**Manage:**
- Enable/disable push notifications
- Choose notification types
- Set quiet hours

---

## 17. SUPPORT & HELP

### 17.1 Contact Admin
**Options:**
- "Do Instant EFT" button (opens chat)
- General support chat
- Report issue
- Request callback

### 17.2 Help Center
**Access:**
- FAQs
- How-to guides
- Cover plan information
- Cashback explanation
- Delivery information
- Contact details

### 17.3 Dispute Management
**Report:**
- Missing cashback
- Wrong transaction amount
- Order issues
- Delivery problems
- Payment issues

**Track:**
- Dispute status
- Admin responses
- Resolution notes

---

## 18. ACCOUNT SETTINGS

### 18.1 General Settings
**Manage:**
- Language preference
- Notification preferences
- Privacy settings
- Location services

### 18.2 Security
**Actions:**
- Change PIN
- Enable biometric login (if available)
- View login history
- Manage device tokens

### 18.3 Account Status
**View:**
- Account status (active/suspended)
- Suspension reason (if applicable)
- Failed payment count
- Account warnings

---

## 19. CASHBACK WALLET & COVER PLAN FUNDING

### 19.1 Wallet Entries
**View detailed audit trail:**
- All cashback additions
- Overflow movements
- Manual adjustments
- Reversals
- Top-ups
- Carry-overs
- Balance after each entry
- Entry date and time
- Source transaction

### 19.2 Cover Plan Funding Flow
**Understand:**
- Which cover plan is currently being funded
- Funding priority (creation_order)
- How overflow works
- When plans become active
- 30-day renewal cycle

---

## 20. MEMBER STATISTICS

### 20.1 Personal Stats
**View:**
- Total transactions (in-store + delivery)
- Total amount spent
- Total cashback earned
- Total orders placed (Plus1-Go)
- Total deliveries received
- Favorite partners
- Most ordered products
- Average order value
- Member since date

### 20.2 Cover Plan Stats
**View:**
- Total cover plans
- Active cover plans count
- Total funded amount
- Total overflow earned
- Total top-ups made
- Days with active cover
- Funding velocity (how fast plans fill)

---

## 21. PROMOTIONAL FEATURES

### 21.1 Offers & Promotions
**View:**
- Current offers from partners
- Special cashback rates
- Delivery fee discounts
- Buy 1 Get 1 offers
- Seasonal promotions

### 21.2 Referral Program (if implemented)
**Actions:**
- Refer friends
- Share referral code
- Track referrals
- Earn referral bonuses

---

## 22. DATA & PRIVACY

### 22.1 Data Management
**Actions:**
- View data collected
- Download personal data
- Request data deletion
- Manage privacy settings

### 22.2 Terms & Conditions
**Access:**
- View terms of service
- View privacy policy
- View cashback terms
- View delivery terms

---

## SUMMARY OF MEMBER CAPABILITIES

**Registration & Profile:** Register, login, complete profile, manage settings  
**Cover Plans:** View plans, track funding, manage dependants, request changes  
**In-Store Shopping (Rewards):** Shop with QR code/mobile, earn cashback, view transactions  
**Delivery Orders (Plus1-Go):** Browse partners, order products, track delivery, rate & review  
**Payments:** Manage payment methods, top-up cover plans, view payment history  
**Support:** Contact admin, report disputes, access help center  
**Notifications:** Receive updates on cover plans, orders, and promotions  

**Total Feature Categories:** 22  
**Total Actions Available:** 200+
