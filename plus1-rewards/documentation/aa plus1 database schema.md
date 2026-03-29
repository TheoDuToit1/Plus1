DATABASE PLAN
34. Database approach
The database follows the real structure of the business with NO central users table.
Each role is self-contained with its own authentication.

Key principle: Each role table (members, partners, agents, insurers, drivers) contains:
- Authentication fields (mobile_number, pin_code, pin_hash)
- Role-specific profile data
- Status tracking
- Timestamps

The database clearly stores:
Members (includes admin role)
Partners
Agents
Insurers
Drivers
Cover plans
Member cover plans
Transactions
Cashback allocations
Invoices
Top-ups
Commissions
Disputes
Audit history
Plus1-Go orders and products

35. Main tables

ROLE TABLES (NO central users table - each role is self-contained)

members
Stores member profile details with authentication.
Fields:
id (uuid, primary key)
role (text: 'member' or 'admin')
full_name
mobile_number (unique - used for login)
pin_code (6 digits - used for login)
pin_hash (hashed PIN)
email
qr_code (unique)
status (active/suspended/pending)
sa_id
date_of_birth
city
suburb
default_address
latitude, longitude
saved_addresses (jsonb)
profile_picture_url
payment fields (token, method, last_4, authorized, bank details)
profile_completed
total_orders, total_spent, last_order_at
kyc_status
device_token
created_at, updated_at

partners
Stores partner shop details with authentication.
Fields:
id (uuid, primary key)
role (text: 'partner')
full_name (contact person)
shop_name
mobile_number (unique - used for login)
pin_code (6 digits - used for login)
pin_hash (hashed PIN)
phone
email
status (active/suspended/pending/rejected)
approved_by, approved_at
cashback_percent (3-40%)
responsible_person
category
address
included_products, excluded_products
rejection_reason
signature_url
store_description, store_logo_url, store_banner_url
latitude, longitude
is_open, opening_hours (jsonb)
delivery_enabled, pickup_enabled
minimum_order_value
delivery_radius_km
rating, total_reviews
average_prep_time_minutes
kyc_status
device_token
created_at, updated_at

agents
Stores agent details with authentication.
Fields:
id (uuid, primary key)
role (text: 'agent')
full_name
mobile_number (unique - used for login)
pin_code (6 digits - used for login)
pin_hash (hashed PIN)
phone
email
status (pending/active/suspended/rejected)
approved_by, approved_at
rejection_reason
id_number
agreement_file
kyc_status
device_token
created_at

insurers
Stores insurer details with authentication.
Fields:
id (uuid, primary key)
role (text: 'insurer')
full_name (contact person)
mobile_number (unique - used for login)
pin_code (6 digits - used for login)
pin_hash (hashed PIN)
phone
email
provider_name (unique - insurer company name)
status (pending/active/suspended)
approved_by, approved_at
kyc_status
device_token
created_at

drivers
Stores delivery driver details with authentication.
Fields:
id (uuid, primary key)
role (text: 'driver')
full_name
mobile_number (unique - used for login)
pin_code (6 digits - used for login)
pin_hash (hashed PIN)
phone
email
status (offline/online/busy)
vehicle_type, vehicle_make, vehicle_color, vehicle_registration
license_number, license_photo_url
current_latitude, current_longitude
last_location_update
is_verified
total_deliveries
average_rating
kyc_status
device_token
created_at

partner_agent_links
Links each partner to an agent.
Fields:
id
partner_id (FK â†’ partners.id)
agent_id (FK â†’ agents.id)
linked_at
status

cover_plans
Stores the available cover plans.
Fields:
id
insurer_id (FK â†’ insurers.id)
plan_name
monthly_target_amount
plan_level
status
created_at
For now, plan names can stay as sample placeholders.

member_cover_plans
Stores each cover plan linked to a member.
Fields:
id
member_id
cover_plan_id
creation_order
target_amount
funded_amount
status
active_from
active_to
suspended_at
created_at
This table is one of the most important in the system.
It must support:
Main member cover plan
Upgraded cover plan
Dependant-linked cover
Other linked cover plans

linked_people
Stores dependant or linked person details.
Fields:
id
member_cover_plan_id
linked_type
full_name
id_number
linked_to_main_member_id
status
created_at

transactions
Stores partner transactions with cashback split.
Fields:
id
partner_id (FK â†’ partners.id)
member_id (FK â†’ members.id)
agent_id (FK â†’ agents.id)
driver_id (FK â†’ drivers.id, nullable)
order_id (FK â†’ orders.id, nullable)
purchase_amount
status (completed/pending/reversed/disputed)
transaction_type (in_store/delivery)
cashback_percent (total cashback %)
system_percent (1%)
agent_percent (1%)
member_percent (remainder)
system_amount
agent_amount
member_amount
delivery_fee (nullable)
created_at

cover_plan_wallet_entries
Stores every funding movement into cover plans.
Fields:
id
member_id
member_cover_plan_id
transaction_id
entry_type
amount
balance_after
created_at
Use this for:
Cashback added
Overflow moved
Manual adjustment
Reversal
Top-up
Carry-over

top_ups
Stores member or partner payments made to close shortfalls or settle balances.
Fields:
id
payer_type (member/partner)
payer_id (references role table id)
member_cover_plan_id (FK â†’ member_cover_plans.id, nullable)
amount
payment_method
reference_note
approved_by (FK â†’ members.id where role='admin')
created_at

partner_invoices
Stores monthly partner invoices.
Fields:
id
partner_id
invoice_month
total_amount
due_date
status
paid_at
suspended_at
created_at

invoice_items
Stores invoice line items.
Fields:
id
invoice_id
transaction_id
amount
description

agent_commissions
Stores commission totals.
Fields:
id
agent_id
month
total_amount
payout_status
paid_at
created_at

insurer_exports
Stores exports or insurer batch records.
Fields:
id
insurer_id (FK â†’ insurers.id)
export_month
total_cover_plans
total_value
status
exported_at
created_at

insurer_export_items
Stores each exported cover plan record.
Fields:
id
insurer_export_id (FK â†’ insurer_exports.id)
member_cover_plan_id (FK â†’ member_cover_plans.id)
export_status
note

disputes
Stores complaints or transaction problems.
Fields:
id
transaction_id
member_id
partner_id
dispute_type
description
status
resolution_note
resolved_by
resolved_at
created_at

PLUS1-GO TABLES

orders
Stores Plus1-Go delivery orders.
Fields:
id
order_number (unique)
member_id (FK â†’ members.id)
partner_id (FK â†’ partners.id)
driver_id (FK â†’ drivers.id, nullable)
status (pending/confirmed/preparing/ready/driver_assigned/picked_up/on_the_way/delivered/cancelled)
subtotal, delivery_fee, total_amount (in cents)
payment_status (pending/processing/paid/failed/refunded)
payment_reference
delivery_type (delivery/collection)
delivery_address, delivery_latitude, delivery_longitude
special_instructions
created_at, confirmed_at, delivered_at

order_items
Stores items in each order.
Fields:
id
order_id (FK â†’ orders.id)
product_id (FK â†’ products.id)
product_name, product_price
quantity
modifiers (jsonb)
line_total

products
Stores partner products for Plus1-Go.
Fields:
id
partner_id (FK â†’ partners.id)
name, description
price (in cents)
category
image_url
is_available

driver_earnings
Stores driver delivery earnings.
Fields:
id
driver_id (FK â†’ drivers.id)
order_id (FK â†’ orders.id)
total_fee (delivery fee)
driver_amount (93%)
system_amount (5%)
agent_amount (2%)

delivery_tracking
Stores GPS tracking for deliveries.
Fields:
id
order_id (FK â†’ orders.id)
driver_id (FK â†’ drivers.id)
latitude, longitude
recorded_at

audit_logs
Stores important system actions.
Fields:
id
actor_role (member/partner/agent/insurer/driver)
actor_id (references role table id)
action_type
table_name
record_id
old_value
new_value
created_at

36. Important system rules
    Cashback rule
    Partner chooses cashback from 3% to 40%.
    Split is always:
    1% system
    1% agent
    rest to member
    Funding rule
    Cover plans fill in creation date order.
    Active rule
    A cover plan becomes Active when the required target amount is reached.
    Renewal rule
    After 30 days, the same required amount must be available again for the cover plan to stay Active.
    Suspension rule
    If that amount is not available, the cover plan becomes Suspended until cashback or top-up reaches the target again.
    Partner suspension rule
    If a partner is suspended, transactions stop and the member-facing page must show:
    â€œTransaction error, please contact administrator.â€
    Approval rule
    Any new cover plan, plan move, or linked person addition must have a telephonic conversation before approval.
    Authentication rule
    NO central users table exists. Each role table (members, partners, agents, insurers, drivers) has its own authentication using mobile_number (unique) and pin_code (6 digits).
    Admin role
    Admin users are stored in the members table with role='admin'.
    Delivery fee split rule (Plus1-Go)
    Delivery fee is split: 93% driver, 5% system, 2% agent.
    Order status flow (Plus1-Go)
    Orders progress through: pending â†’ confirmed â†’ preparing â†’ ready â†’ driver_assigned â†’ picked_up â†’ on_the_way â†’ delivered â†’ completed.
    Driver verification rule
    Drivers must be verified (KYC, license, vehicle) before they can accept deliveries.
37. Items still needing final detail later
    These do not block the project, but still need final detail later:
    Final real cover plan names
    Final invoice dates and grace period timing
    Exact wording for insurer export statuses
    Full telephonic approval workflow steps
    Refund and reversal rules under Admin
    Final partner billing notice templates
    Final member-facing wording for statuses and errors
    Plus1-Go delivery fee structure and driver payout timing
38. My understanding in one short summary
    Plus1 Rewards is a cashback-to-cover-plan platform where members shop at partner stores, cashback builds toward medical cover, partners pay the cashback cost by invoice at month end, agents support and earn commission, the insurer can log in and view approved cover plan data, drivers fulfill Plus1-Go deliveries, and Admin controls approvals, billing, disputes, exports, and the full system flow. The system has NO central users table - each role (members, partners, agents, insurers, drivers) is self-contained with its own authentication.
39. A few things I still think should be added later
    These are not misunderstandings now. They are just areas I think deserve their own written section in the next version:
    Telephonic approval process
    This should get its own simple workflow, especially for new cover plans, plan moves, and linked people.
    Partner suspension and re-activation flow
    This should be written as a step-by-step mini process so nobody gets confused.
    Top-up process
    This should be written separately for members and partners, including proof of payment and admin confirmation.
    Insurer dashboard permissions
    It would help to define exactly what the insurer can see and what they cannot edit.
    Plus1-Go delivery workflow
    This should detail the complete flow from order placement to driver assignment to delivery completion.
    Driver onboarding and verification
    This should explain the KYC process, vehicle verification, and approval workflow for drivers.
    If you want, the next step should be turning this into a developer-ready structured spec with page-by-page dashboard sections and button actions.


DRIVER FLOW (PLUS1-GO)
29a. Driver role
Drivers fulfill delivery orders for Plus1-Go.
Drivers earn 93% of the delivery fee for each completed delivery.
The remaining 7% is split: 5% to system, 2% to agent.

29b. Driver registration
Driver registration should include:
Full name
Mobile number
6-digit PIN
Vehicle details (type, make, color, registration)
Driver license number
License photo upload
After registration, the driver waits for Admin approval and verification.

29c. Driver dashboard
The driver dashboard should show:
Driver profile and vehicle details
Current status (offline/online/busy)
Available delivery requests
Active deliveries
Delivery history
Earnings summary
Total deliveries completed
Average rating
GPS location tracking

29d. Driver delivery flow
When a delivery order is placed:
Available drivers in the delivery radius are notified
Driver accepts the delivery request
Driver status changes to "busy"
Driver picks up order from partner
Driver delivers to member address
Driver marks delivery as complete
Driver earnings are calculated and recorded
Driver status returns to "online"

29e. Driver earnings
Driver earnings are calculated per delivery:
Total delivery fee = 100%
Driver receives = 93%
System receives = 5%
Agent receives = 2%
Earnings are tracked in driver_earnings table.

PLUS1-GO FLOW
29f. What is Plus1-Go
Plus1-Go is the delivery layer of the Plus1 Rewards ecosystem.
It allows members to:
Order products from partner shops
Get delivery to their address
Earn cashback on purchases (same as in-store)
Build toward cover plans through delivery orders

29g. Plus1-Go order flow
Member browses partner shops on Plus1-Go app
Member adds products to cart
Member selects delivery or collection
Member enters delivery address (if delivery)
Member places order and pays
Partner receives order notification
Partner confirms and prepares order
System assigns driver (if delivery)
Driver picks up order
Driver delivers to member
Order marked as delivered
Transaction created with cashback split
Member cover plan funded with cashback

29h. Plus1-Go transaction structure
Each Plus1-Go order creates:
1. Order record (orders table)
2. Order items (order_items table)
3. Transaction record with cashback (transactions table)
4. Driver earnings record (driver_earnings table)
5. Cover plan wallet entry (cover_plan_wallet_entries table)

The transaction includes:
Purchase amount (order subtotal)
Delivery fee
Cashback split (1% system, 1% agent, rest to member)
Transaction type = "delivery"

29i. Partner role in Plus1-Go
Partners can enable delivery and/or pickup:
delivery_enabled = true/false
pickup_enabled = true/false
Partners set:
Minimum order value
Delivery radius (km)
Average prep time
Opening hours
Partners add products to their catalog with:
Product name, description, price
Category
Image
Availability status
