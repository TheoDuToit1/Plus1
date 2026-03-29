# PARTNER - Complete Feature & Activity Guide

**Role:** Partner (Shop/Business Owner)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Offer cashback to members, process transactions, manage products, fulfill orders

---

## 1. REGISTRATION & ONBOARDING

### 1.1 Initial Registration
- Enter shop/business name
- Enter business address
- Select business category
- Enter responsible person name
- Enter contact mobile number (becomes login username)
- Create 6-digit PIN (becomes login password)
- Enter contact phone number
- Enter email address
- Select cashback percentage (3% to 40%)
- Specify included products/services
- Specify excluded products/services
- Upload signed agreement
- Accept terms and conditions
- Submit registration

### 1.2 Application Review
- Application status: Pending
- Wait for admin approval
- Receive notification when approved/rejected
- If rejected, view rejection reason

### 1.3 Account Activation (After Approval)
- Account status changes to Active
- Receive approval notification
- Can now log in
- Access partner dashboard
- Begin processing transactions

### 1.4 Profile Completion
- Add store description
- Upload store logo
- Upload store banner image
- Set GPS coordinates (latitude/longitude)
- Set opening hours (JSON format)
- Enable/disable delivery
- Enable/disable pickup
- Set minimum order value
- Set delivery radius (km)
- Set average prep time (minutes)

---

## 2. LOGIN & AUTHENTICATION

### 2.1 Login Process
- Enter mobile number
- Enter 6-digit PIN
- No OTP required
- Access partner dashboard

### 2.2 Session Management
- Stay logged in
- Log out
- Forgot PIN (contact admin)

---

## 3. PARTNER DASHBOARD (OVERVIEW)

### 3.1 Dashboard Home
**View:**
- Shop name and logo
- Account status (Active/Suspended/Pending)
- Cashback percentage
- Linked agent name
- Total transactions today
- Total transactions this month
- Total cashback issued today
- Total cashback issued this month
- Current invoice status
- Outstanding balance
- Next invoice due date
- Suspension warning (if applicable)
- Recent transactions list
- Quick action buttons

### 3.2 Business Information
**View:**
- Shop name
- Business address
- Category
- Responsible person
- Contact details
- Registration date
- Approval date
- Approved by (admin name)
- Store description
- Opening hours
- Current status (open/closed)

### 3.3 Cashback Settings
**View:**
- Current cashback percentage (3-40%)
- Cashback split breakdown:
  - System: 1%
  - Agent: 1%
  - Member: (cashback % - 2%)
- Included products
- Excluded products

**Actions:**
- Request cashback percentage change (requires admin approval)
- Update included/excluded products

---

## 4. TRANSACTION PROCESSING (IN-STORE)

### 4.1 Process New Transaction
**Steps:**
1. Member provides mobile number OR shows QR code
2. Enter/scan member identifier
3. System verifies member exists
4. Enter purchase amount
5. System calculates cashback:
   - Total cashback = purchase amount × cashback %
   - System amount = 1%
   - Agent amount = 1%
   - Member amount = remainder
6. Review transaction details
7. Confirm transaction
8. Transaction recorded
9. Member receives cashback
10. Show confirmation to member

### 4.2 Transaction Entry Screen
**Input:**
- Member mobile number OR QR code scan
- Purchase amount
- Transaction notes (optional)

**Display:**
- Member name (after verification)
- Purchase amount
- Cashback percentage
- Total cashback amount
- System fee (1%)
- Agent commission (1%)
- Member cashback
- Confirmation button

### 4.3 Transaction Confirmation
**Show:**
- Transaction ID
- Member name
- Purchase amount
- Cashback issued
- Transaction timestamp
- Success message

---

## 5. TRANSACTION HISTORY

### 5.1 View All Transactions
**Display:**
- Transaction date and time
- Transaction ID
- Member name
- Member mobile number
- Purchase amount
- Cashback percentage
- Total cashback issued
- System amount
- Agent amount
- Member amount
- Transaction status (completed/pending/reversed/disputed)
- Transaction type (in_store/delivery)

### 5.2 Filter Transactions
**Filter by:**
- Date range
- Member
- Transaction status
- Transaction type
- Amount range

### 5.3 Search Transactions
**Search by:**
- Transaction ID
- Member name
- Member mobile number
- Date

### 5.4 Transaction Details
**View:**
- Complete transaction breakdown
- Member details
- Cashback split
- Associated order (if delivery)
- Dispute status (if any)
- Reversal information (if reversed)

### 5.5 Export Transactions
**Export:**
- CSV format
- Excel format
- PDF report
- Date range selection
- Custom fields selection

---

## 6. BILLING & INVOICES

### 6.1 Monthly Invoice
**View:**
- Invoice number
- Invoice month
- Total cashback issued
- Total amount due
- Due date
- Invoice status (pending/paid/overdue)
- Payment date (if paid)
- Grace period remaining
- Late notice status

### 6.2 Invoice Details
**View:**
- Invoice header (partner details)
- Invoice line items:
  - Transaction ID
  - Transaction date
  - Purchase amount
  - Cashback amount
  - Description
- Subtotal
- Total amount due
- Payment instructions
- Admin bank details

### 6.3 Invoice History
**View:**
- All past invoices
- Invoice month
- Total amount
- Due date
- Payment date
- Status
- Download invoice (PDF)

### 6.4 Payment Status
**Track:**
- Current outstanding balance
- Overdue invoices
- Payment history
- Grace period countdown
- Suspension warning

---

## 7. PAYMENT & TOP-UP

### 7.1 Make Payment
**Options:**
- EFT to admin bank account
- Upload proof of payment
- Reference: Invoice number

### 7.2 Instant EFT Button
**Action:**
- Click "Do Instant EFT" button
- Opens direct chat with admin
- Arrange instant payment
- Confirm payment details
- Admin verifies and applies payment

### 7.3 Payment Confirmation
**Receive:**
- Payment confirmation notification
- Invoice marked as paid
- Account status updated
- Suspension lifted (if applicable)

### 7.4 Payment History
**View:**
- All payments made
- Payment date
- Amount paid
- Payment method
- Reference number
- Invoice number
- Approved by (admin)

---

## 8. SUSPENSION & REACTIVATION

### 8.1 Suspension Warning
**Receive notifications:**
- Invoice overdue warning
- Grace period ending
- Suspension imminent
- Days until suspension

### 8.2 Suspended Status
**When suspended:**
- Cannot process transactions
- Member-facing page shows: "Transaction error, please contact administrator"
- Dashboard shows suspension notice
- View suspension reason
- View outstanding balance
- Access to payment options

### 8.3 Reactivation
**Process:**
- Pay outstanding balance
- Upload proof of payment OR use Instant EFT
- Admin verifies payment
- Account reactivated
- Can process transactions again
- Receive reactivation notification

---

## 9. PLUS1-GO PRODUCT MANAGEMENT

### 9.1 Enable Delivery Services
**Settings:**
- Enable/disable delivery
- Enable/disable pickup
- Set minimum order value
- Set delivery radius (km)
- Set average prep time (minutes)
- Update opening hours

### 9.2 Product Catalog
**View:**
- All products
- Product name
- Description
- Price (in cents)
- Category
- Image
- Availability status
- Total products count

### 9.3 Add New Product
**Input:**
- Product name
- Description
- Price (in cents)
- Category
- Upload product image
- Set availability (available/unavailable)
- Add modifiers (optional)
- Save product

### 9.4 Edit Product
**Update:**
- Product name
- Description
- Price
- Category
- Image
- Availability
- Modifiers

### 9.5 Delete Product
**Action:**
- Select product
- Confirm deletion
- Product removed from catalog

### 9.6 Product Categories
**Manage:**
- View all categories
- Add new category
- Edit category
- Assign products to categories

### 9.7 Product Availability
**Quick actions:**
- Mark product as available
- Mark product as unavailable
- Bulk availability updates

---

## 10. PLUS1-GO ORDER MANAGEMENT

### 10.1 Incoming Orders
**Receive notifications:**
- New order alert
- Order details preview
- Accept/Reject options

### 10.2 Order Details
**View:**
- Order number
- Member name
- Member phone
- Delivery address (if delivery)
- Order items with quantities
- Special instructions
- Subtotal
- Delivery fee
- Total amount
- Payment status
- Delivery type (delivery/collection)

### 10.3 Order Actions
**Available actions:**
- Accept order
- Reject order (with reason)
- Mark as preparing
- Mark as ready
- View order history
- Contact member
- Contact driver (if assigned)

### 10.4 Order Status Flow
**Update order through stages:**
1. Pending → Accept/Reject
2. Confirmed → Start preparing
3. Preparing → Mark as ready
4. Ready → Wait for driver pickup
5. Driver Assigned → Driver on the way
6. Picked Up → Driver has order
7. On The Way → Driver delivering
8. Delivered → Order complete

### 10.5 Active Orders
**View:**
- All current orders
- Order status
- Time since order placed
- Estimated prep time remaining
- Driver status (if assigned)
- Quick status update buttons

### 10.6 Order History
**View:**
- All completed orders
- Order date and time
- Member name
- Order total
- Delivery fee
- Cashback issued
- Order status
- Filter by date range
- Search by order number

---

## 11. STORE SETTINGS

### 11.1 Store Information
**Edit:**
- Store description
- Store logo
- Store banner
- Business address
- GPS coordinates
- Contact details

### 11.2 Operating Hours
**Set:**
- Opening hours per day
- Closed days
- Special hours (holidays)
- Currently open/closed toggle

### 11.3 Delivery Settings
**Configure:**
- Delivery enabled (yes/no)
- Pickup enabled (yes/no)
- Minimum order value
- Delivery radius (km)
- Delivery fee (if custom)
- Average prep time

### 11.4 Store Status
**Manage:**
- Open store
- Close store temporarily
- View current status
- Schedule closures

---

## 12. RATINGS & REVIEWS

### 12.1 View Ratings
**See:**
- Overall store rating (1-5 stars)
- Total number of reviews
- Rating breakdown (5 stars, 4 stars, etc.)
- Recent reviews

### 12.2 Review Management
**View each review:**
- Member name (or anonymous)
- Rating (stars)
- Review text
- Review date
- Order number

**Actions:**
- Respond to reviews
- Flag inappropriate reviews
- Thank customers

### 12.3 Rating Statistics
**Track:**
- Average rating over time
- Rating trends
- Most common feedback
- Improvement areas

---

## 13. AGENT RELATIONSHIP

### 13.1 View Linked Agent
**See:**
- Agent name
- Agent contact details
- Agent commission rate (1%)
- Date linked
- Agent status

### 13.2 Agent Support
**Access:**
- Contact agent
- Request agent assistance
- View agent support history

### 13.3 Agent Commission Tracking
**View:**
- Total commission paid to agent
- Monthly commission breakdown
- Commission per transaction

---

## 14. REPORTS & ANALYTICS

### 14.1 Sales Reports
**View:**
- Daily sales
- Weekly sales
- Monthly sales
- Sales trends
- Peak hours
- Best-selling products (Plus1-Go)

### 14.2 Cashback Reports
**View:**
- Total cashback issued
- Cashback by period
- Cashback trends
- Member cashback breakdown

### 14.3 Transaction Reports
**View:**
- Transaction count
- Average transaction value
- Transaction types (in-store vs delivery)
- Transaction status breakdown

### 14.4 Order Reports (Plus1-Go)
**View:**
- Total orders
- Order value
- Delivery vs pickup ratio
- Order completion rate
- Average prep time
- Order cancellation rate

### 14.5 Financial Reports
**View:**
- Revenue summary
- Outstanding invoices
- Payment history
- Cashback liability
- Profit analysis

---

## 15. NOTIFICATIONS

### 15.1 Push Notifications
**Receive alerts for:**
- New order (Plus1-Go)
- Order status updates
- Invoice generated
- Invoice due soon
- Invoice overdue
- Payment received
- Suspension warning
- Account reactivated
- New member transaction
- Dispute filed
- Admin messages

### 15.2 Notification Settings
**Manage:**
- Enable/disable notifications
- Choose notification types
- Set quiet hours
- Email notifications
- SMS notifications

---

## 16. SUPPORT & HELP

### 16.1 Contact Admin
**Options:**
- "Do Instant EFT" button (payment support)
- General support chat
- Report technical issue
- Request callback
- Email support

### 16.2 Help Center
**Access:**
- Partner FAQs
- Transaction processing guide
- Billing information
- Plus1-Go setup guide
- Product management guide
- Troubleshooting

### 16.3 Dispute Management
**Handle:**
- View disputes filed against transactions
- Respond to disputes
- Provide evidence
- Track dispute resolution
- View dispute history

---

## 17. ACCOUNT SETTINGS

### 17.1 Profile Management
**Edit:**
- Responsible person name
- Contact mobile number (cannot change - used for login)
- Contact phone
- Email address
- Business details

### 17.2 Security
**Manage:**
- Change PIN
- View login history
- Manage device tokens
- Enable biometric login (if available)

### 17.3 Account Status
**View:**
- Current status (Active/Suspended/Pending)
- Suspension reason (if applicable)
- Account warnings
- Compliance status

### 17.4 KYC Status
**View:**
- KYC verification status
- Required documents
- Upload documents
- Verification progress

---

## 18. MEMBER CONNECTIONS

### 18.1 View Member Activity
**See:**
- Members who shop at your store
- Frequent customers
- Member transaction history
- Member preferences

### 18.2 Member Engagement
**Track:**
- New members
- Returning members
- Member retention rate
- Average member spend

---

## 19. PROMOTIONAL FEATURES

### 19.1 Special Offers
**Create:**
- Limited-time cashback increases
- Product discounts
- Free delivery promotions
- Buy 1 Get 1 offers

### 19.2 Featured Listings
**Manage:**
- Featured product placement
- Promotional banners
- Special badges

---

## 20. COMPLIANCE & DOCUMENTATION

### 20.1 Agreements
**Access:**
- View signed partnership agreement
- Download agreement copy
- View terms and conditions
- View cashback terms

### 20.2 Required Documents
**Upload/manage:**
- Business registration
- Tax documents
- Bank details
- Signed agreements
- Compliance certificates

---

## SUMMARY OF PARTNER CAPABILITIES

**Registration & Setup:** Register, await approval, complete profile, set up store  
**Transaction Processing:** Process in-store transactions, issue cashback, view history  
**Billing:** View invoices, make payments, track outstanding balance  
**Plus1-Go:** Manage products, process orders, update availability  
**Store Management:** Set hours, manage settings, control open/closed status  
**Reports:** View sales, cashback, transactions, and financial reports  
**Support:** Contact admin, handle disputes, access help center  
**Notifications:** Receive alerts for orders, payments, and account status  

**Total Feature Categories:** 20  
**Total Actions Available:** 150+
