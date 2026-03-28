Plus1 Go — Complete Functional Specification Document
Version: 1.0
Date: March 2026
Project: Plus1 Go (Delivery & Online Ordering Marketplace)
Integration: Unified authentication and member system with Plus1 Rewards
Database: Shared database with Plus1 Rewards — single user registration across both platforms

Table of Contents

System Overview
Unified Registration & Authentication
Member Features & User Journey
Partner Features & Dashboard
Driver Features & Application
Agent Features & Commission System
Admin Features & Management
Transaction & Cashback Engine
Delivery Fee Calculation System
Order Management & Status Flow
Real-Time Tracking & GPS
Payment & Checkout System
Notification System
Cover Plan Integration
Search & Discovery Features
Review & Rating System
Batched Delivery & Route Optimization
API Integrations
Business Rules & Logic
Security & Compliance


1. System Overview
1.1 What Is Plus1 Go?
Plus1 Go is a food and grocery delivery marketplace integrated into the Plus1 Rewards health cover ecosystem. Members browse partner businesses, order products online, and have them delivered by Plus1 drivers. Every transaction earns cashback that accumulates toward medical cover activation.
1.2 Core Value Proposition
For Members:

Order food, groceries, and products from local partner businesses
Earn cashback on every order that funds health cover
Track orders in real-time with live GPS
Two ways to accumulate cover: shop in-store (Plus1 Rewards) OR order online (Plus1 Go)

For Partners:

Gain delivery capability without building infrastructure
Increase order volume through online visibility
Access Plus1's member network
Single dashboard manages in-store and online orders

For Drivers:

Keep 93% of delivery fees (vs Uber/Bolt's 50%)
Delivery earnings automatically fund own health cover
Work flexible hours alongside other platforms
No exclusivity requirement — run Plus1 Go + Uber simultaneously

For Agents:

Earn commission on every online order from signed partners
Earn commission on delivery fees for orders from their partners
Passive recurring income as network transacts

1.3 Geographic Scope
Primary Corridor: Voortrekker Road, Cape Town (Maitland to Brackenfell)
Target Zones: Bellville, Parow, Goodwood, Durbanville, Brackenfell, Kraaifontein
Coverage: 17km corridor, 5,800+ businesses, 183,000 workers
1.4 Platform Architecture
Technology Stack:

Frontend: Next.js (Vercel deployment)
Backend: Supabase (PostgreSQL + Realtime + Auth + Storage)
Maps: Google Maps API (Distance Matrix, JavaScript Maps, Geocoding)
Payments: Ozow / PayFast (Instant EFT)
SMS: Clickatell / BulkSMS
Real-Time Updates: Supabase Realtime (WebSockets)

Shared Infrastructure:

Single authentication system across Plus1 Rewards and Plus1 Go
Unified member registration — one account for both platforms
Shared cover plan wallet — cashback from in-store and online orders accumulate together
Single agent commission system — agents earn from both in-store and online activity


2. Unified Registration & Authentication
2.1 Single Sign-On Across Platforms
Critical Principle: A user who registers on Plus1 Rewards can immediately log in to Plus1 Go with the same credentials, and vice versa. There is NO separate registration process.
2.2 Registration Flow
Step 1: Initial Registration

User can register via Plus1 Rewards (in-store QR scan) OR Plus1 Go (online ordering)
Registration captures:

Full name
Mobile number (primary identifier)
Email (optional)
Suburb (for delivery address)
Password (hashed)



Step 2: Account Creation

System creates single user account
Assigns unique member ID
Creates cover plan wallet (starts at R0.00)
Generates QR code for in-store use
User can now access both Plus1 Rewards and Plus1 Go

Step 3: Role Assignment

Default role: Member
User can request Driver role (requires approval)
User can request Partner role (requires business verification)
Roles are additive — a member can also be a driver

2.3 Authentication Methods
Mobile Number + Password:

Primary login method
Mobile verified via OTP on first login

Email + Password:

Alternative login (if email provided during registration)

Session Management:

Persistent session across both platforms
User logged in to Plus1 Rewards = automatically logged in to Plus1 Go
30-day session expiry (configurable)

2.4 Profile Management
Unified Profile Page:

User edits profile once, changes reflect on both platforms
Profile fields:

Personal: Name, surname, date of birth, ID number (optional)
Contact: Mobile, email, physical address
Delivery addresses: Home, work, custom (multiple allowed)
Payment methods: Linked bank account, card (for instant EFT)
Cover plan status: Active/Inactive, funded amount, next renewal date



Privacy Settings:

User controls visibility of profile data
Opt-in/out of marketing communications
Delete account (anonymizes data, preserves transaction history)


3. Member Features & User Journey
3.1 Member Homepage (/go)
Search Bar:

Free-text search across partner names, cuisine types, product categories
Auto-suggest as user types
Recent searches saved

Featured Partners:

Highlighted businesses (admin-curated or cashback-ranked)
Rotating carousel with partner logos and cashback badges

Category Pills:

Quick filters: Restaurants, Groceries, Pharmacies, Bakeries, Butcheries, etc.
Tap category to filter directory

Suburb Filter:

Dropdown: Select delivery area (Bellville, Parow, Goodwood, etc.)
Filters partners by delivery zone coverage

"Near You" Map View:

Toggle between list and map display
Map shows partner locations as pins
Tap pin to view partner profile
Shows user's current location (with permission)

3.2 Partner Discovery (/go/[suburb])
Directory Listing:

All partners in selected suburb
Each card shows:

Partner logo
Partner name
Cuisine type / business category
Cashback percentage badge (e.g., "Earn 10% cashback")
Star rating (e.g., 4.2 ★ from 87 reviews)
"Open Now" or "Closed" status
Delivery radius badge (e.g., "Delivers to Bellville")
Estimated prep time (e.g., "Ready in 25 min")



Sorting Options:

Highest cashback first
Highest rated first
Closest to me
Fastest prep time
Alphabetical

Filters:

Open now only
Minimum order value (e.g., under R50)
Delivery or collection available
Dietary preferences (vegetarian, halaal, kosher, etc.)

3.3 Partner Storefront (/go/partner/[id])
Partner Profile:

Cover image (banner photo)
Logo
Business name
Full address with map pin
Operating hours (Mon-Sun schedule)
Cashback percentage prominently displayed
Star rating + total review count
"Delivers to your area" badge (based on user's location)
Delivery radius in km
Minimum order value (e.g., "Min R50 for delivery")

Menu / Catalogue:

Organized by categories (e.g., Starters, Mains, Drinks, Desserts)
Each item displays:

Item photo
Item name
Description
Price
"Available" or "Out of Stock" badge
Modifier options (e.g., Size: Small/Medium/Large)
Add-ons (e.g., Extra cheese +R10)
Prep time estimate



Add to Cart:

Tap item to open detail modal
Select quantity
Choose modifiers (required and optional)
"Add to Cart" button
Cart icon shows item count

Reviews Section:

Display recent reviews (5 most recent)
Filter by rating (5-star, 4-star, etc.)
"Write a Review" button (only after order delivered)

3.4 Shopping Cart (/go/cart)
Cart Rules:

Member can only have one active cart per partner
If member adds item from different partner, system prompts:

"You have items from [Partner A]. Start a new cart?"
Options: "Keep [Partner A]" or "Switch to [Partner B]"


Switching clears previous cart (with confirmation)

Cart Display:

Partner name and logo at top
List of items with:

Item name
Modifiers selected (e.g., "Large, Extra cheese")
Quantity (editable)
Unit price
Subtotal per line item
Remove item button



Live Cashback Preview:

"This order earns you R42.50 toward cover"
Updates in real-time as cart changes
Shows progress bar: "R42.50 / R320 to activate cover"

Order Summary:

Subtotal (sum of items)
Delivery fee (calculated if delivery selected, R0 if collection)
Total Due
Cashback earned (breakdown: order cashback + delivery fee cashback to driver)

Delivery or Collection Toggle:

Radio buttons: "Delivery" or "Collect"
If Delivery selected, shows delivery address selector
If Collect selected, shows partner address and "Ready by [time]"

Proceed to Checkout Button:

Validates minimum order value
Checks partner is open
Proceeds to checkout page

3.5 Checkout (/go/checkout)
Delivery Address Selection:

Dropdown of saved addresses (Home, Work, etc.)
"Add New Address" button
New address form:

Street address
Suburb (dropdown from approved zones)
Delivery instructions (e.g., "Ring doorbell twice")
Save as Home/Work/Custom



Distance Calculation (If Delivery):

System calculates distance between partner and delivery address
Uses Google Maps Distance Matrix API
Formula: Base Fee (R25) + (Distance in km × R8)
Displays: "Delivery: R49 (3.2km)"

Special Instructions:

Free-text field (e.g., "No onions," "Call when outside")

Order Summary:

Items list (collapsed, expandable)
Subtotal
Delivery fee
Total Due
Cashback breakdown:

"You earn: R18.60 toward your cover"
"Driver earns: R45.57 toward their cover"



Payment Method:

Instant EFT via Ozow/PayFast
"Pay Now" button
Redirects to payment gateway
Returns to confirmation page after payment

Place Order Button:

Validates all fields
Creates order
Sends confirmation SMS to member
Sends order alert to partner
Redirects to order tracking page

3.6 Live Order Tracking (/go/order/[id])
Order Status Timeline:

Placed → Confirmed → Preparing → Driver Assigned → En Route → Delivered
Visual progress indicator (stepper or timeline)
Timestamps for each status change

Live Map:

Shows three markers:

Partner location (blue pin)
Delivery address (green pin)
Driver current location (moving car icon, updates every 5 seconds)


Route polyline from partner → driver → delivery address

Driver Information:

Driver name
Driver photo
Vehicle type and color (e.g., "White Toyota Corolla")
"Call Driver" button (opens phone dialer)

Estimated Time:

"Arriving in 12 minutes"
Updates dynamically based on driver location

Order Details:

Expandable section showing items ordered
Total paid
Cashback earned (displays after delivery confirmed)

Actions:

"Contact Support" button
"Cancel Order" (only if status = Placed or Confirmed, before Preparing)

3.7 Order History (/go/orders)
List of Past Orders:

Sorted by date (most recent first)
Each order card shows:

Partner name and logo
Order date and time
Total paid
Cashback earned
Status (Delivered, Cancelled, Refunded)
"Reorder" button (adds same items to cart)
"Rate & Review" button (if not yet reviewed)



Filter Options:

Date range (Last 7 days, Last 30 days, All time)
Status (Delivered only, Cancelled only, etc.)
Partner (filter by specific business)

Order Details:

Tap order to view full details
Items ordered
Delivery address
Driver name (if applicable)
Invoice download (PDF)

3.8 Cover Progress Dashboard
Accessible from both Plus1 Rewards and Plus1 Go:

Shows unified cover wallet balance
Displays cashback from:

In-store QR scans (Plus1 Rewards)
Online orders (Plus1 Go)


Progress ring visual: "R218 / R320 funded"
Days until next renewal (if active)
Transaction history (all cashback entries)


4. Partner Features & Dashboard
4.1 Partner Registration
Business Verification Process:

Partner submits business details:

Trading name
Registration number (if registered)
Physical address
Owner name and contact
Business type (Restaurant, Grocery, Pharmacy, etc.)
Proof of address document upload



Admin Review:

Admin reviews application
Approves or rejects
If approved, partner gains access to dashboard

Onboarding:

Partner sets cashback percentage (4%-15% range, admin-approved)
Uploads logo and cover image
Sets operating hours
Defines delivery radius (in km)
Sets minimum order value

4.2 Menu Management (/partner/menu)
Category Management:

Create menu categories (e.g., Starters, Mains, Sides, Drinks)
Set display order (drag-and-drop)
Toggle category visibility (active/inactive)

Item Management:

Add new menu item:

Item name
Description (optional)
Price (in rands, system converts to cents internally)
Upload photo (Supabase Storage)
Select category
Set prep time (e.g., 15 minutes)
Toggle availability (in stock / out of stock)



Modifier Groups:

Create modifier groups (e.g., "Size", "Add-ons", "Remove Ingredients")
Set if required or optional
Set single-select or multi-select
Add options within group:

Option name (e.g., "Large")
Price adjustment (e.g., +R10)
Toggle availability



Bulk Actions:

Mark multiple items out of stock
Apply discount to category (e.g., 20% off all Desserts)
Duplicate item (create variant)

Menu Preview:

View menu as members see it
Test add-to-cart flow

4.3 Listing Management (/partner/listing)
Profile Editing:

Update logo (upload new image)
Update cover image (banner photo)
Edit business description (500 char max)
Set cuisine type (dropdown: Italian, Chinese, Bakery, etc.)
Update operating hours:

Day-by-day schedule (Mon-Sun)
Open time / Close time
Mark day as closed


Set average prep time (e.g., "25 minutes")

Delivery Settings:

Set delivery radius in km (e.g., 5km)
Define delivery zones (suburbs served)
Set minimum order value for delivery (e.g., R50)
Toggle delivery on/off (e.g., disable during peak hours)

Visibility Settings:

Featured partner (admin-controlled)
Accept new orders (toggle on/off to pause incoming orders)

4.4 Order Queue (/partner/orders)
Incoming Order Alert:

Sound notification when new order arrives
Desktop notification (if browser permission granted)
SMS alert to partner's mobile

Order List:

Displays all orders with status:

New (just placed, awaiting confirmation)
Confirmed (partner accepted, preparing)
Ready (prepared, awaiting driver pickup)
Picked Up (driver collected)
Delivered (completed)
Cancelled (member or admin cancelled)



Order Card:

Order number
Member name and delivery address
Order type (Delivery or Collection)
Items ordered (expandable list)
Special instructions
Total value
Cashback earned by member
Timestamp (when placed)

Order Actions:

Confirm Order: Partner accepts order, sets prep time

Input: Estimated prep time (e.g., "30 minutes")
System updates status to "Confirmed"
SMS sent to member: "Your order is being prepared"


Mark as Ready: Partner indicates food is ready for pickup

System notifies available drivers in zone
Status updates to "Ready"


Reject Order: Partner cannot fulfill (out of stock, too busy, etc.)

Input: Reason for rejection (dropdown: Out of stock, Closed early, Too busy)
System refunds member
Sends SMS: "Order cancelled by [Partner]. Refund processed."



Auto-Accept Setting:

Toggle: Auto-confirm all orders (skips manual confirmation)
Useful for partners with reliable stock and capacity

4.5 Order History
Past Orders View:

Filter by date range
Filter by status (Delivered, Cancelled)
Export to CSV (for accounting)

Performance Metrics:

Total orders this month
Total revenue this month
Average order value
Acceptance rate (% of orders confirmed vs rejected)
Average prep time
Cashback issued to members

4.6 Invoice Management
Monthly Invoice:

Generated at end of each month
Line items:

Partner's cashback liability (total cashback issued)
System fee (1% of cashback)
Agent commission (1% of cashback)
Net amount due from partner


Payment due date (7 days after invoice date)
Payment instructions (EFT details)

Invoice Download:

PDF format
Includes VAT breakdown (if partner is VAT-registered)

Payment Status:

Unpaid (red)
Paid (green)
Overdue (red, bold)

Suspension Warning:

If invoice overdue by 14 days, partner account suspended
Cannot receive new orders until payment made


5. Driver Features & Application
5.1 Driver Registration
Eligibility:

Must be existing Plus1 member (or register as member first)
Must have valid driver's license
Must have vehicle (car, scooter, bicycle)

Application Process:

Driver submits:

Full name (pre-filled from member profile)
ID number
Driver's license number (upload photo)
Vehicle type (Car, Scooter, Bicycle)
Vehicle registration number
Vehicle color and make (e.g., "White Toyota Corolla")
Operating zone (suburb/area preference)
Bank account details (for payout if needed)



Admin Approval:

Admin reviews documents
Background check (optional, depends on compliance needs)
Approves or rejects
If approved, driver gains access to driver dashboard

Driver Onboarding:

Tutorial: How to accept orders, navigate, confirm delivery
Test delivery (simulated order to practice flow)

5.2 Driver Dashboard (/driver)
Availability Toggle:

Prominent switch: "Available for Deliveries" ON/OFF
When ON:

Driver's location tracked (GPS updates every 5 seconds)
Driver appears in pool for order assignment


When OFF:

Driver not assigned new orders
GPS tracking paused



Active Delivery:

If driver has active order, shows:

Order details (items, partner name, delivery address)
Navigation button (opens Google Maps with route)
"Picked Up" button (confirm collection from partner)
"Delivered" button (confirm drop-off at member)



Earnings Today:

Real-time counter: "Earned R145.50 today"
Breakdown: Number of deliveries completed
Cover progress bar: "R145.50 / R320 funded this month"

Stats Summary:

Deliveries this week
Average delivery fee earned
Acceptance rate (% of offered orders accepted)
Average rating from members

5.3 Order Queue (/driver/orders)
Incoming Delivery Requests:

List of available orders (status = "Ready" at partner)
Each request shows:

Partner name and address
Delivery address
Distance (e.g., "3.2km delivery")
Delivery fee (e.g., "Earn R49")
Driver's share after split (e.g., "You get R45.57")
Estimated time (e.g., "12 min drive")
Pickup deadline (e.g., "Pick up by 2:35 PM")



Batched Delivery Indicator:

System highlights batched orders:

"⭐ BATCH (3 orders, same zone)"
"Total earnings: R135.45"
"Route: 8km loop"
"Estimated profit: R85 after costs"


Driver prioritizes batches (higher profit margin)

Accept/Decline:

Accept: Driver assigned to order

Status updates to "Driver Assigned"
Member notified via SMS
Navigation starts automatically


Decline: Order remains in queue for other drivers

No penalty for declining (but acceptance rate tracked)



5.4 Active Delivery Flow
Step 1: Navigate to Partner

Map shows route from driver's current location to partner
ETA displayed
"Navigate in Google Maps" button (opens native app)

Step 2: Arrive at Partner

Driver arrives at partner location
Partner hands over order
Driver taps "Picked Up" button
System updates status to "En Route"
Member sees driver location on map

Step 3: Navigate to Member

Map shows route from partner to delivery address
Driver's GPS updates member's map in real-time (every 5 seconds)

Step 4: Arrive at Member

Driver reaches delivery address
Hands order to member
Driver taps "Delivered" button
Prompt: "Order delivered successfully?"

Yes → Order marked delivered
Issue → Driver reports problem (Member not available, Wrong address, etc.)



Step 5: Delivery Confirmed

Transaction records created:

Order cashback credited to member's cover wallet
Delivery fee split:

5% → system
2% → agent (partner's recruiting agent)
93% → driver's cover wallet




SMS sent to member: "Order delivered! You earned R18.60 toward cover."
SMS sent to driver: "Delivery complete. R45.57 added to your cover."

5.5 Earnings & Cover Progress
Earnings Dashboard:

Daily, weekly, monthly breakdowns
Total deliveries completed
Average earnings per delivery
Cover wallet balance
"Cash out" button (if driver wants cash instead of cover — optional feature)

Cover Plan Status:

Driver sees own cover plan progress
Same wallet as member role (if driver also shops in-store)
Cover activates when wallet reaches R320

5.6 Driver Ratings
Member Ratings:

After delivery, member can rate driver (1-5 stars)
Optional comment
Low rating triggers admin review

Driver Performance Metrics:

Average rating displayed on driver profile
Acceptance rate (% of offered orders accepted)
On-time rate (% of deliveries within estimated time)
Low performers flagged for retraining or suspension


6. Agent Features & Commission System
6.1 Agent Role
Who Is an Agent?

Person who recruits partners to join Plus1 network
Earns recurring commission on all transactions from their partners
Can operate in both Plus1 Rewards (in-store) and Plus1 Go (online orders)

6.2 Agent Commission Structure
Two Commission Sources:
1. Order Cashback Commission (1%):

When member orders from agent's partner online
Agent earns 1% of the cashback amount
Example:

Order value: R200
Cashback: R20 (10% rate)
Agent earns: R0.20 (1% of R20)



2. Delivery Fee Commission (2%):

When order from agent's partner is delivered
Agent earns 2% of the delivery fee
Example:

Delivery fee: R49
Agent earns: R0.98 (2% of R49)



Total Per Order:

Agent earns R0.20 + R0.98 = R1.18 per order (in this example)

6.3 Agent Dashboard
Partner Management:

List of all partners recruited by agent
Partner status (Active, Suspended, Pending)
Monthly order volume per partner
Commission earned per partner

Earnings Overview:

Total commission this month
Breakdown: Order cashback vs Delivery fees
Top-performing partners (highest commission generators)
Payment history (monthly payouts)

Recruitment Tools:

Shareable signup link (tracks new partners to agent)
QR code for partners to scan and register
Marketing materials download (PDFs, images)

6.4 Agent Payments
Monthly Payout:

Agent commission calculated at end of month
Paid via EFT to agent's bank account
Payment date: 7th of following month
Statement includes all transactions and totals


7. Admin Features & Management
7.1 Admin Dashboard Overview
Key Metrics:

Total members registered (Plus1 Rewards + Plus1 Go)
Active orders today
Total orders this month
Revenue (system fees)
Cover plans activated this month
Drivers active right now

Live Order Monitor:

Real-time feed of all orders
Status: Placed, Confirmed, Preparing, En Route, Delivered
Alerts for stuck orders (e.g., confirmed 2 hours ago, still not ready)

7.2 Member Management (/admin/members)
Member Directory:

Search by name, mobile, email
Filter by cover plan status (Active, Inactive, Suspended)
View member profile:

Personal details
Cover wallet balance
Transaction history (in-store + online)
Orders placed
Reviews written



Actions:

Suspend member (blocks ordering, maintains data)
Reset password (send reset link)
Manually adjust cover wallet (rare, requires reason)
View audit log (all actions on member account)

7.3 Partner Management (/admin/partners)
Partner Directory:

Search by name, location
Filter by status (Active, Pending, Suspended)
View partner profile:

Business details
Cashback rate
Monthly order volume
Total cashback issued
Invoice status (Paid, Unpaid, Overdue)



Actions:

Approve/reject new partner applications
Suspend partner (blocks orders, preserves menu)
Edit cashback rate (requires approval)
Generate manual invoice
View transaction history

7.4 Driver Management (/admin/drivers)
Driver Directory:

Search by name, vehicle type
Filter by status (Active, Inactive, Suspended)
View driver profile:

Personal details
Vehicle info
License photo
Deliveries completed
Average rating
Earnings to date



Actions:

Approve/reject driver applications
Suspend driver (blocks order assignment)
View delivery history
Manually assign order to driver (override automatic assignment)

7.5 Order Management (/admin/orders)
All Orders View:

Filter by status, date range, partner, member
Search by order number

Order Details:

Full order breakdown
Member, partner, driver info
Payment status
Delivery status
Transaction records (cashback + delivery fee splits)

Admin Actions:

Manually mark order as delivered (if stuck)
Cancel order and refund member
Reassign driver (if driver unavailable)
Adjust delivery fee (rare, requires reason)
Resolve disputes

7.6 Agent Management (/admin/agents)
Agent Directory:

Search by name
View agent profile:

Partners recruited
Total commission earned
Payment history



Actions:

Approve new agent registrations
Suspend agent (stops commission accrual)
Manually trigger payout

7.7 Delivery Settings (/admin/delivery-settings)
Fee Formula Configuration:

Base fee (in rands, e.g., R25)
Per-km rate (in rands, e.g., R8)
Max distance (in km, e.g., 10km)
Min order value for delivery (in rands, e.g., R50)

Split Configuration:

System percentage (default: 5%)
Agent percentage (default: 2%)
Driver percentage (calculated: 93%)

Zone Management:

Define delivery zones (suburbs served)
Set zone-specific fees (override formula)
Example: Bellville = R25 flat, Durbanville = R40 flat

7.8 Analytics & Reporting
Order Analytics:

Orders per day/week/month (line chart)
Peak ordering hours (heatmap)
Popular partners (bar chart)
Average order value trend

Cover Analytics:

Cover plans activated this month
Average time to activation (in days)
Cashback issued (in-store vs online)
Member retention rate

Financial Reports:

Revenue (system fees)
Partner invoices (outstanding vs paid)
Agent commission payable
Export to CSV/PDF

7.9 Dispute Resolution
Dispute Types:

Order not delivered
Wrong items delivered
Incorrect cashback amount
Payment issue

Resolution Flow:

Member or partner reports issue
Admin reviews order details, transaction logs, driver notes
Admin decides:

Refund member
Reverse cashback
Credit member's wallet
Suspend driver/partner


Decision logged in audit trail


8. Transaction & Cashback Engine
8.1 Order Cashback Transaction
Trigger: Order status changes to "Delivered"
Input Data:

Order ID
Order subtotal (in cents)
Partner's cashback percentage
Member ID
Agent ID (partner's recruiting agent)

Calculation:

Cashback amount = Order subtotal × Cashback percentage
System fee = Cashback amount × 1%
Agent fee = Cashback amount × 1%
Member credit = Cashback amount - System fee - Agent fee

Output:

Transaction record created (type: "order_cashback")
Member's cover wallet credited with member credit
Agent's commission balance increased by agent fee
System revenue tracked

Example:

Order subtotal: R200.00 (20000 cents)
Cashback rate: 10%
Cashback: R20.00 (2000 cents)
System fee: R0.20 (20 cents)
Agent fee: R0.20 (20 cents)
Member credit: R19.60 (1960 cents)

8.2 Delivery Fee Transaction
Trigger: Order status changes to "Delivered" (same moment as order cashback)
Input Data:

Order ID
Delivery fee (in cents)
Driver ID
Agent ID (partner's recruiting agent)

Calculation:

System fee = Delivery fee × 5%
Agent fee = Delivery fee × 2%
Driver credit = Delivery fee - System fee - Agent fee

Output:

Transaction record created (type: "delivery_fee")
Driver's cover wallet credited with driver credit
Agent's commission balance increased by agent fee
System revenue tracked

Example:

Delivery fee: R49.00 (4900 cents)
System fee: R2.45 (245 cents)
Agent fee: R0.98 (98 cents)
Driver credit: R45.57 (4557 cents)

8.3 Cover Wallet Updates
Real-Time Balance:

Member's cover wallet updated instantly upon transaction creation
Driver's cover wallet updated instantly
Member/driver sees updated balance on dashboard

Activation Check:

After every wallet credit, system checks: wallet_balance >= R320
If true:

Cover plan status = "Active"
SMS sent: "Your health cover is now active!"
Renewal date set to 30 days from activation



8.4 Transaction Audit Trail
Every Transaction Records:

Transaction type (order_cashback, delivery_fee)
Order ID
Member/Driver ID
Partner ID
Agent ID
Amount (total cashback or delivery fee)
System fee
Agent fee
Recipient credit (member or driver)
Timestamp
Status (Completed, Reversed, Pending)

Immutable Log:

Transactions cannot be edited (only reversed with new compensating transaction)
Full audit trail for compliance


9. Delivery Fee Calculation System
9.1 Distance-Based Formula
Default Formula:
Delivery Fee = Base Fee + (Distance in km × Per-km Rate)
Configurable Parameters (Admin):

Base Fee: R25.00
Per-km Rate: R8.00
Max Distance: 10km (orders beyond this rejected)

Example Calculations:

2km: R25 + (2 × R8) = R41.00
5km: R25 + (5 × R8) = R65.00
10km: R25 + (10 × R8) = R105.00

9.2 Google Maps Distance Calculation
Trigger: Member enters delivery address at checkout
Process:

System retrieves partner's coordinates (lat, lng)
System geocodes member's address to coordinates
API call to Google Maps Distance Matrix:

Origin: Partner coordinates
Destination: Member coordinates
Mode: Driving


Response includes:

Distance in meters (converted to km)
Duration in seconds (converted to minutes)


System applies formula to calculate delivery fee
Fee displayed to member before payment

Caching (Optional):

Frequently requested routes cached for 24 hours
Reduces API calls
Updates nightly or on-demand

9.3 Zone-Based Alternative
Admin Defines Zones:

Bellville: R25
Parow: R30
Goodwood: R35
Durbanville: R45
Brackenfell: R40

Member Selects Suburb:

Dropdown at checkout: "Delivery to: [Select Suburb]"
Fee displayed instantly (no API call)
Faster, cheaper, simpler

Hybrid Approach:

Use zone pricing for common suburbs
Use distance calculation for custom addresses outside zones

9.4 Delivery Fee Display
Cart Page:

"Delivery fee calculated at checkout"

Checkout Page:

After address entered: "Delivery: R49.00 (3.2km)"
Breakdown tooltip: "Base R25 + R24 (3km × R8/km)"

Order Confirmation:

"Delivery fee: R49.00"
No further changes after order placed


10. Order Management & Status Flow
10.1 Order Lifecycle
Status Progression:

Placed → Member completes payment, order created
Confirmed → Partner accepts order, sets prep time
Preparing → Partner is making the order
Ready → Food ready, awaiting driver pickup
Driver Assigned → Driver accepted delivery request
Picked Up → Driver collected order from partner
En Route → Driver traveling to delivery address
Delivered → Driver confirmed drop-off, order complete

Alternative Paths:

Cancelled → Member or partner cancels before preparation
Refunded → Issue occurred, member refunded

10.2 Status Change Triggers
Placed → Confirmed:

Trigger: Partner clicks "Confirm Order" button
Actions:

SMS to member: "Your order from [Partner] is confirmed. Ready in 30 min."
Order appears in partner's "Preparing" queue



Confirmed → Ready:

Trigger: Partner clicks "Mark as Ready" button
Actions:

Status updates to "Ready"
System searches for available drivers in zone
Order broadcast to drivers (appears in driver queue)



Ready → Driver Assigned:

Trigger: Driver clicks "Accept" on delivery request
Actions:

Driver assigned to order
SMS to member: "[Driver Name] is picking up your order"
Driver sees navigation to partner



Driver Assigned → Picked Up:

Trigger: Driver arrives at partner, clicks "Picked Up"
Actions:

Status updates to "En Route"
Member's tracking map activates
Driver GPS tracking starts (updates every 5 seconds)



Picked Up → Delivered:

Trigger: Driver arrives at member, clicks "Delivered"
Actions:

Status updates to "Delivered"
Transactions created (order cashback + delivery fee split)
Cover wallets credited
SMS to member: "Order delivered! You earned R18.60."
SMS to driver: "Delivery complete. R45.57 added to your cover."
Order closes, appears in history



10.3 Cancellation Logic
Member Cancels:

Allowed if status = Placed or Confirmed (before Preparing)
Refund issued automatically
Partner notified
No cashback credited
No penalty to member

Partner Cancels:

Partner can reject order if status = Placed
Reason required (Out of stock, Closed early, etc.)
Refund issued to member
SMS to member: "Order cancelled by [Partner]. Refund processed."
Partner's rejection rate tracked (too many rejections = warning)

Driver Cancels:

Driver can unassign if status = Driver Assigned (before Picked Up)
Order returns to "Ready" status
Broadcast to other drivers
Driver's acceptance rate decreases

Admin Cancels:

Admin can cancel at any status
Reason required
Refund issued if payment made
All parties notified

10.4 Collection Orders (No Delivery)
Status Flow:

Placed → Confirmed → Preparing → Ready for Collection → Collected

Ready for Collection:

SMS to member: "Your order is ready. Collect from [Partner Address]."
Member arrives at partner
Shows order number or QR code
Partner hands over order
Member clicks "Mark as Collected" OR partner clicks "Handed Over"
Status → Collected
Cashback credited (order cashback only, no delivery fee)


11. Real-Time Tracking & GPS
11.1 Driver Location Updates
How It Works:

Driver's mobile app captures GPS coordinates every 5 seconds (when order active)
Coordinates sent to Supabase via update query
Supabase Realtime broadcasts change to subscribed clients (member's tracking page)

Data Flow:

Driver's phone GPS → Driver app
Driver app → Supabase (update driver location)
Supabase Realtime → Member's browser (WebSocket)
Member's map updates marker position

Accuracy:

GPS accuracy: 5-10 meters (typical smartphone)
Update frequency: Every 5 seconds (configurable)
Latency: <1 second (Supabase Realtime WebSocket)

11.2 Member Tracking Interface
Map Display:

Google Maps JavaScript API
Three markers:

Partner location (blue pin, static)
Member delivery address (green pin, static)
Driver location (car icon, animates smoothly)



Route Polyline:

Displays expected route (partner → member address)
Updates as driver moves
Shows actual path taken (historical trail)

ETA Calculation:

Based on distance remaining + average speed
Updates every 10 seconds
Example: "Arriving in 8 minutes"

Driver Information Panel:

Driver name
Vehicle type and color
"Call Driver" button (opens phone dialer with driver's number)

11.3 Privacy & Security
Location Data:

Driver location only visible to:

Member receiving delivery
Admin (for monitoring)


Historical location data stored for 7 days (audit purposes)
Anonymized after 7 days

Member Address:

Full address only visible to driver after order accepted
Partner sees suburb only (not exact address)
Address deleted from driver's view after delivery completed


12. Payment & Checkout System
12.1 Payment Methods
Instant EFT (Primary):

Integrated via Ozow or PayFast
Member selects "Pay with Instant EFT"
Redirected to banking portal
Selects bank (FNB, Nedbank, Standard Bank, Absa, Capitec, etc.)
Logs in to bank
Confirms payment
Redirected back to Plus1 Go
Payment confirmed instantly

Cash on Delivery (Optional):

Member selects "Cash on Delivery" at checkout
Order placed (payment pending)
Driver collects cash from member upon delivery
Driver deposits cash with agent or admin
Manual reconciliation (admin marks order as paid)

Card Payment (Future):

Integration with PayFast card processing
Member saves card details (PCI-compliant tokenization)
One-click checkout for repeat orders

12.2 Checkout Flow
Step 1: Cart Review

Member reviews items, subtotal, cashback preview
Selects delivery or collection
Proceeds to checkout

Step 2: Address Entry (If Delivery)

Member selects saved address OR enters new address
System calculates delivery fee
Displays total (subtotal + delivery fee)

Step 3: Special Instructions

Free-text field for notes

Step 4: Payment Method

Radio buttons: Instant EFT, Cash on Delivery (if enabled)
Selects payment method

Step 5: Order Summary

Final review:

Items
Delivery address
Delivery fee
Total due
Cashback to be earned


"Place Order" button

Step 6: Payment (If Instant EFT)

Redirects to Ozow/PayFast
Member completes payment
Returns to Plus1 Go

Step 7: Confirmation

Order confirmation page:

Order number
Estimated delivery time
"Track Order" button


Confirmation SMS sent

12.3 Refund Process
Refund Triggers:

Order cancelled by partner
Order cancelled by member (before preparation)
Delivery failed (wrong address, member unavailable, etc.)
Dispute resolved in member's favor

Refund Method:

If paid via Instant EFT: Refund to same bank account (automatic via Ozow/PayFast)
If Cash on Delivery: Credit to member's cover wallet (equivalent value)

Refund Timeline:

Instant EFT refunds: 1-3 business days (bank processing)
Cover wallet credits: Instant

Notification:

SMS: "Your order has been refunded. R235 will reflect in your account within 3 days."


13. Notification System
13.1 SMS Notifications
Member Notifications:

Order confirmed: "Your order from [Partner] is confirmed. Ready in 30 min."
Driver assigned: "[Driver Name] is picking up your order."
Order out for delivery: "Your order is on the way. Track live: [Link]"
Order delivered: "Order delivered! You earned R18.60 toward cover."
Order cancelled: "Order cancelled. Refund processed."
Cover activated: "Your health cover is now active!"

Partner Notifications:

New order: "New order #12345 from [Member]. R200. Confirm in app."
Payment received: "Payment confirmed for order #12345."
Low stock alert: "[Item] is out of stock. Update your menu."

Driver Notifications:

New delivery available: "Delivery request: R49 earnings. Accept in app."
Order ready for pickup: "Order #12345 ready at [Partner]. Navigate now."
Delivery confirmed: "Delivery complete. R45.57 added to your cover."

Agent Notifications:

New partner registered: "New partner [Name] joined your network."
Monthly payout: "Commission payout: R1,245 deposited to your account."

13.2 In-App Notifications
Notification Bell:

Icon in header (member, partner, driver, admin dashboards)
Badge shows unread count

Notification Types:

Order updates (status changes)
Payment confirmations
Cover milestones (e.g., "Halfway to cover activation!")
Promotional (new partners, special offers)

Actions:

Tap notification to view related page (e.g., order details)
Mark as read
Clear all

13.3 Email Notifications (Optional)
Sent To:

Members (if email provided)
Partners (business email)
Agents (contact email)

Types:

Weekly summary (orders placed, cashback earned)
Monthly statement (partners: invoice, agents: commission)
Cover renewal reminder (7 days before renewal)


14. Cover Plan Integration
14.1 Unified Cover Wallet
Single Wallet Across Platforms:

Member has ONE cover wallet
Cashback from Plus1 Rewards (in-store QR scans) accumulates here
Cashback from Plus1 Go (online orders) accumulates here
Driver delivery earnings accumulate here (if driver is also member)

Wallet Balance:

Displayed on both Plus1 Rewards and Plus1 Go dashboards
Real-time updates
Progress bar: "R218 / R320 funded"

14.2 Cover Activation
Trigger:

Wallet balance reaches R320 (configurable threshold)

Actions:

Cover plan status changes from "Inactive" to "Active"
Activation date recorded
Renewal date set to 30 days from activation
SMS sent: "Congratulations! Your health cover is now active."
Member gains access to cover benefits (via Day1Health or equivalent)

Activation Display:

Member dashboard shows:

"Cover Status: Active ✓"
"Renewal Date: 15 April 2026"
"Days Remaining: 23"



14.3 Cover Renewal (30-Day Cycle)
How It Works:

Cover renews every 30 days
System checks wallet balance at renewal date
If balance ≥ R320:

R320 deducted from wallet
Cover remains "Active"
Next renewal date set to +30 days


If balance < R320:

Cover status changes to "Suspended"
SMS sent: "Your cover is suspended. Add R[shortfall] to reactivate."



Auto-Top-Up (Optional Future Feature):

Member links bank account
Auto-debit R320 at renewal if wallet insufficient
Keeps cover active continuously

14.4 Cover Benefits
What Cover Provides:

Medical plan from Day1Health (or equivalent provider)
Benefits as per policy (e.g., GP visits, chronic medication, hospitalization)
Member calls Day1Health directly for claims
Plus1 only manages funding, not claims

Proof of Cover:

Member downloads digital cover certificate (PDF)
Shows member name, policy number, activation date
Presented to healthcare providers


15. Search & Discovery Features
15.1 Partner Search
Search Bar (/go):

Free-text input
Searches across:

Partner name
Cuisine type (e.g., "Italian")
Product categories (e.g., "Pizza")
Menu item names (e.g., "Margherita")


Auto-suggest results as user types
Recent searches saved (cookie/local storage)

Search Filters:

Suburb (dropdown: Bellville, Parow, etc.)
Category (Restaurant, Grocery, Pharmacy, Bakery)
Open now (toggle)
Minimum cashback % (slider: 0%-15%)
Delivery available (toggle)

Search Results:

Grid or list view toggle
Each result card shows:

Partner logo
Name
Cashback %
Star rating
Open/Closed status
"View Menu" button



15.2 Menu Item Search
Search Within Partner:

Search bar on partner page (/go/partner/[id])
Searches menu items only for that partner
Highlights matching items
Filters categories (e.g., show only "Mains")

15.3 Sorting Options
Directory Sorting:

Highest cashback first (default)
Highest rated first
Closest to me (requires location permission)
Alphabetical (A-Z)
Newest partners first

Menu Sorting:

Partner's preferred order (drag-drop in admin)
Price: Low to High
Price: High to Low
Popularity (most-ordered items)

15.4 Featured Partners
Admin Curates:

Admin selects partners to feature
Featured partners appear in carousel on homepage
Badge: "Featured" or "Recommended"
Criteria: High ratings, new partners, seasonal promotions


16. Review & Rating System
16.1 Partner Reviews
Who Can Review:

Only members who have completed an order from that partner
One review per order
Review unlocked after order status = Delivered

Review Form:

Star rating (1-5 stars, required)
Comment (optional, 500 char max)
Photo upload (optional, e.g., photo of food)
Anonymous toggle (hide member name)

Review Display:

Partner page shows:

Average rating (e.g., 4.3 ★)
Total review count (e.g., "87 reviews")
Recent reviews (5 most recent)
Filter by rating (5-star, 4-star, etc.)



Review Moderation:

Admin can hide inappropriate reviews (profanity, spam)
Partner can respond to reviews (text reply)

16.2 Driver Reviews
Who Can Review:

Only members who received delivery from that driver
One review per delivery

Review Form:

Star rating (1-5 stars, required)
Comment (optional, 300 char max)
Issues (checkboxes: Late, Rude, Wrong address, etc.)

Driver Performance:

Average rating displayed to admin only (not public)
Low ratings (< 3 stars) flagged for review
Persistent low ratings = driver warning or suspension

Driver Incentives:

Drivers with 4.8+ average rating earn bonus (e.g., +5% on next 10 deliveries)


17. Batched Delivery & Route Optimization
17.1 Why Batching Matters
Economics:

Single 5km delivery: Driver earns R45, costs R66 (fuel + wear + time) = Loss R21
Batched 3 deliveries (8km loop): Driver earns R135, costs R110 = Profit R25

Driver Preference:

Drivers naturally choose batches when shown profit comparison
System encourages batching for driver sustainability

17.2 Batch Detection
System Logic:

When order status = "Ready", system searches for:

Other orders with status = "Ready"
Same geographic zone (within 2km radius)
Ready within 10 minutes of each other



Batch Creation:

If 2+ qualifying orders found:

Group as batch
Calculate optimal route (partner 1 → member 1 → partner 2 → member 2)
Calculate total earnings (sum of delivery fees)
Display to drivers as single "Batch" offer



17.3 Batch Display (Driver Queue)
Highlighted Card:

"⭐ BATCH (3 orders, same zone)"
Total earnings: R135.45
Route: 8km loop
Estimated time: 35 minutes
Estimated profit: R85 (after costs)
"Accept Batch" button

Individual Orders:

Still visible below batches
Lower priority (drivers prefer batches)

17.4 Route Optimization
Google Maps Directions API:

System calculates optimal route for batch
Minimizes total distance
Considers:

Pickup order (which partner first)
Dropoff order (which member first)
Traffic conditions (if available)



Driver Navigation:

Driver sees multi-stop route:

Stop 1: Partner A (pickup)
Stop 2: Member X (dropoff)
Stop 3: Partner B (pickup)
Stop 4: Member Y (dropoff)


"Next Stop" button advances to next destination

17.5 Batch Completion
Partial Completion:

Driver can complete deliveries individually
Each "Delivered" button completes one order
Batch remains active until all orders delivered

Batch Earnings:

Driver earns cumulative total (all delivery fees combined)
Transactions created individually per order (each credits driver's wallet separately)


18. API Integrations
18.1 Google Maps APIs
Distance Matrix API:

Purpose: Calculate delivery fee based on distance
Usage: Called at checkout when member enters delivery address
Input: Partner coordinates, member address coordinates
Output: Distance in km, estimated drive time
Cost: $5 per 1,000 requests

Maps JavaScript API:

Purpose: Display interactive maps for order tracking
Usage: Member's order tracking page, driver navigation
Features: Markers, polylines, real-time updates
Cost: $7 per 1,000 map loads

Geocoding API:

Purpose: Convert street address to coordinates
Usage: When member enters new delivery address
Input: "12 Voortrekker Road, Bellville"
Output: Latitude, longitude
Cost: $5 per 1,000 requests

Directions API (Optional):

Purpose: Generate turn-by-turn route
Usage: Batched delivery route optimization
Alternative: Driver uses native Google Maps app (free)

18.2 Payment Gateways
Ozow (Instant EFT):

Purpose: Accept payments via instant bank transfer
Flow:

Member clicks "Pay Now"
Redirected to Ozow portal
Selects bank, logs in, confirms payment
Redirected back to Plus1 Go
Webhook confirms payment


Fee: 2.9% + R2 per transaction
Settlement: Same day (most banks)

PayFast (Alternative):

Purpose: Instant EFT + card payments
Fee: 2.85% per transaction
Features: Subscription billing (for future auto-renewal)

18.3 SMS Gateway
Clickatell:

Purpose: Send transactional SMS notifications
Usage: Order confirmations, delivery updates, cover activation
Cost: R0.10 per SMS (South Africa)
Features: Delivery reports, long message support

BulkSMS (Alternative):

Purpose: Same as Clickatell
Cost: R0.12 per SMS
Benefit: South African-based support

18.4 Supabase Services
PostgreSQL Database:

Purpose: Store all data (members, partners, orders, transactions)
Features: Relational integrity, complex queries, indexes

Supabase Realtime:

Purpose: Real-time GPS tracking, live order updates
How: WebSocket connections, broadcasts database changes
Latency: <1 second

Supabase Auth:

Purpose: User authentication (login, registration, password reset)
Features: Email/password, OTP, session management

Supabase Storage:

Purpose: Store images (partner logos, menu photos, driver licenses)
Features: CDN, image resizing, signed URLs


19. Business Rules & Logic
19.1 Money Handling
All Monetary Values Stored as Integers (Cents):

R385.00 = 38500 (stored)
Display only: Divide by 100, format as R385.00
Why: Prevents floating-point rounding errors in calculations

Cashback Split Must Total Exactly:

Example: R20 cashback

System: R0.20 (20 cents)
Agent: R0.20 (20 cents)
Member: R19.60 (1960 cents)
Total: 20 + 20 + 1960 = 2000 ✓



Delivery Fee Split Must Total Exactly:

Example: R49 delivery

System: R2.45 (245 cents)
Agent: R0.98 (98 cents)
Driver: R45.57 (4557 cents)
Total: 245 + 98 + 4557 = 4900 ✓



19.2 Cart Rules
Single Partner Per Cart:

Member cannot mix items from multiple partners
If adding item from different partner:

Warning: "You have items from [Partner A]. Start new cart?"
Options: Keep current cart OR clear and switch


Prevents order splitting (one partner per order)

Cart Persistence:

Cart saved to user session
Persists across page refreshes
Expires after 24 hours of inactivity
Cleared after successful checkout

19.3 Order Rules
Minimum Order Value:

Partner sets minimum (e.g., R50)
Checkout blocked if subtotal < minimum
Message: "Minimum order R50. Add R[shortfall] more."

Maximum Delivery Distance:

Admin sets max (e.g., 10km)
Orders beyond max distance rejected
Message: "Sorry, this address is outside our delivery zone."

Partner Operating Hours:

Orders only accepted when partner is open
If partner closed:

Menu visible but "Add to Cart" disabled
Message: "This store is currently closed. Opens at [time]."



19.4 Driver Assignment Rules
Driver Must Have Active Cover:

System checks driver's cover plan status before assignment
If Inactive or Suspended:

Driver not shown delivery offers
Prompt: "Activate your cover to receive deliveries."



Driver Availability:

Driver sets availability toggle ON/OFF
When OFF:

Driver not assigned orders
GPS tracking paused



Closest Available Driver:

When order status = "Ready", system finds:

Drivers with availability = ON
Drivers in same zone as partner
Calculates distance from driver's current location to partner
Assigns to closest driver



Driver Acceptance Timeout:

Driver has 60 seconds to accept delivery offer
If no response:

Offer expires
Order sent to next closest driver



19.5 Cashback Rules
Cashback Only Credited on Delivery:

Order status must = "Delivered"
If order cancelled or refunded:

No cashback credited
If already credited, transaction reversed



Cashback Snapshot:

Order records cashback % at time of order placement
Even if partner later changes cashback rate
Protects member from retroactive changes

19.6 Cover Activation Rules
Threshold:

R320 minimum to activate
Configurable by admin

Automatic Activation:

No manual step required
System checks wallet balance after every transaction
If balance ≥ R320 AND status = Inactive:

Status → Active
Notification sent



Renewal:

Every 30 days, R320 deducted
If insufficient balance:

Status → Suspended
Member can top up to reactivate



19.7 Partner Suspension Rules
Suspension Triggers:

Invoice overdue by 14 days
High rejection rate (>30% orders rejected)
Low rating (<3.0 stars)
Admin manual suspension (fraud, policy violation)

Effects of Suspension:

Partner cannot receive new orders
Existing orders remain active (completed normally)
Storefront shows: "Temporarily unavailable"
Removed from directory search results

Reactivation:

Partner pays overdue invoice
Admin reviews and lifts suspension
Storefront becomes visible again


20. Security & Compliance
20.1 Data Privacy (POPIA Compliance)
Personal Information Collected:

Members: Name, mobile, email, address, ID number (optional)
Partners: Business details, owner info, bank account
Drivers: License number, vehicle info, bank account

Consent:

User consents to data collection at registration
Privacy policy link displayed
User can request data export (PDF)
User can request account deletion (anonymizes data)

Data Retention:

Active accounts: Indefinite
Deleted accounts: Transaction history retained (anonymized), personal data purged after 7 years

20.2 Payment Security
PCI Compliance:

Plus1 does NOT store card details
Payment gateway (Ozow/PayFast) handles sensitive data
Only stores transaction reference IDs

Encryption:

All API calls use HTTPS (TLS 1.3)
Database credentials stored in environment variables (never in code)

20.3 Role-Based Access Control
Member:

Can view own profile, orders, cover plan
Cannot view other members' data
Cannot access partner/driver/admin dashboards

Partner:

Can view own menu, orders, invoices
Cannot view other partners' data
Cannot view member personal details (only delivery address for active orders)

Driver:

Can view assigned delivery details
Cannot view member's full profile
Cannot view other drivers' earnings

Agent:

Can view own recruited partners
Can view commission breakdown
Cannot edit partner data

Admin:

Full access to all data
Audit log tracks all admin actions
Requires two-factor authentication (recommended)

20.4 Fraud Prevention
Duplicate Order Detection:

Same member, same partner, identical items within 5 minutes = flagged
Admin reviews before processing

Suspicious Refund Patterns:

Member with >5 refunded orders in 7 days = flagged
Manual review required for next order

Driver Location Spoofing:

System validates GPS accuracy
If location jumps >1km in 5 seconds = flag (possible spoofing)
Driver suspended pending investigation

20.5 Audit Trail
All Critical Actions Logged:

Order placement, confirmation, delivery
Cashback transactions
Wallet credits/debits
Cover activation/suspension
Admin actions (suspensions, manual adjustments)

Log Fields:

Action type
User ID (who performed action)
Target ID (what was affected)
Timestamp
IP address
Before/after values (for edits)

Log Retention:

2 years minimum
Export available to admin (CSV)


END OF DOCUMENT
This specification covers all functional aspects of Plus1 Go. It is designed to be fed into ChatGPT or any AI development tool to generate implementation plans, code, or further technical documentation.
Key Points for Implementation:

Shared authentication and database with Plus1 Rewards
Two-way cashback system (member + driver)
Distance-based delivery fees
Real-time GPS tracking via Supabase Realtime
Batched delivery optimization
Unified cover plan wallet across both platforms