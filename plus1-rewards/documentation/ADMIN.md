# ADMIN - Complete Feature & Activity Guide

**Role:** Admin (System Administrator)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Manage entire system, approve users, handle billing, resolve disputes, control operations

---

## 1. ADMIN ACCESS & AUTHENTICATION

### 1.1 Admin Account
- Admin users stored in members table with role='admin'
- Login with mobile number and 6-digit PIN
- Full system access
- All permissions enabled

### 1.2 Login Process
- Enter mobile number
- Enter 6-digit PIN
- Access admin dashboard
- View system overview

---

## 2. ADMIN DASHBOARD (OVERVIEW)

### 2.1 Dashboard Home
**View real-time statistics:**
- Total members
- Active members
- Suspended members
- Total partners
- Active partners
- Suspended partners
- Pending partner applications
- Total agents
- Active agents
- Pending agent applications
- Total drivers
- Active drivers
- Pending driver applications
- Total insurers
- Total active cover plans
- Total suspended cover plans
- Total cashback issued (today/month/all time)
- Total partner invoices due
- Total overdue invoices
- Total agent commission due
- Pending approvals count
- Open disputes count
- Recent activity feed

### 2.2 Quick Actions
**Access:**
- Approve pending applications
- View overdue invoices
- Handle disputes
- Generate reports
- Send notifications
- System settings

---

## 3. APPROVALS MANAGEMENT

### 3.1 Partner Approvals
**View pending partner applications:**
- Shop name
- Responsible person
- Contact details
- Business address
- Category
- Cashback percentage requested
- Included/excluded products
- Signed agreement
- Application date
- Linked agent (if any)

**Actions:**
- Review application details
- Verify business information
- Check signed agreement
- Approve application
- Reject application (provide reason)
- Request additional information
- Contact applicant

**After approval:**
- Partner status → Active
- Partner can log in
- Partner can process transactions
- Agent notified (if linked)

### 3.2 Agent Approvals
**View pending agent applications:**
- Full name
- Contact details
- ID number
- Signed agent agreement
- Application date

**Actions:**
- Review application details
- Verify ID document
- Check signed agreement
- Approve application
- Reject application (provide reason)
- Request additional information
- Contact applicant

**After approval:**
- Agent status → Active
- Agent can log in
- Agent can recruit partners
- Agent can earn commission

### 3.3 Driver Approvals
**View pending driver applications:**
- Full name
- Contact details
- Vehicle details
- Driver license number
- License photo
- Application date

**Actions:**
- Review application details
- Verify driver license
- Verify vehicle registration
- Check vehicle insurance
- Conduct background check (if required)
- Approve application
- Reject application (provide reason)
- Request additional information

**After approval:**
- Driver status → Active
- is_verified → true
- Driver can log in
- Driver can accept deliveries

### 3.4 Insurer Approvals
**View pending insurer applications:**
- Provider/insurer company name
- Contact person
- Contact details
- Application date

**Actions:**
- Review application details
- Verify company information
- Approve application
- Reject application (provide reason)
- Set data access permissions

**After approval:**
- Insurer status → Active
- Insurer can log in
- Insurer can view cover plan data

### 3.5 Cover Plan Change Approvals
**View requests:**
- Member name
- Current cover plan
- Requested new plan
- Request reason
- Telephonic conversation notes
- Request date

**Actions:**
- Review request details
- Verify telephonic conversation occurred
- Check member eligibility
- Approve change
- Reject change (provide reason)
- Schedule follow-up call

### 3.6 Dependant Addition Approvals
**View requests:**
- Main member name
- Dependant name
- Dependant ID number
- Relationship
- Requested cover plan
- Telephonic conversation notes
- Request date

**Actions:**
- Review request details
- Verify telephonic conversation occurred
- Verify dependant information
- Approve addition
- Reject addition (provide reason)
- Request additional documentation

---

## 4. MEMBER MANAGEMENT

### 4.1 View All Members
**Display:**
- Member name
- Mobile number
- Email
- QR code
- Status (Active/Suspended/Pending)
- Registration date
- Total cover plans
- Active cover plans
- Total transactions
- Total cashback earned
- Last transaction date

### 4.2 Member Details
**View:**
- Complete profile information
- All cover plans
- Cover plan funding progress
- Transaction history
- Order history (Plus1-Go)
- Top-up history
- Overflow cashback
- Linked dependants
- Payment methods
- Saved addresses
- KYC status
- Account warnings

### 4.3 Member Actions
**Perform:**
- Suspend member account
- Reactivate member account
- Reset member PIN
- Update member information
- Add manual adjustment to cover plan
- Record top-up payment
- View member activity log
- Send notification to member

### 4.4 Member Search & Filter
**Search by:**
- Name
- Mobile number
- Email
- QR code
- ID number

**Filter by:**
- Status
- Registration date
- Cover plan status
- Transaction activity
- City/suburb

---

## 5. COVER PLAN MONITORING

### 5.1 View All Member Cover Plans
**Display:**
- Member name
- Cover plan name
- Target amount
- Funded amount
- Status (Active/Suspended/In Progress)
- Creation order
- Active from/to dates
- Overflow balance
- Days in current cycle

### 5.2 Cover Plan Details
**View:**
- Complete funding history
- Wallet entries
- Transaction sources
- Top-up history
- Status change history
- Renewal history
- Suspension reasons

### 5.3 Cover Plan Actions
**Perform:**
- Manually activate cover plan
- Manually suspend cover plan
- Record manual adjustment
- Process top-up
- Move to different plan (with approval)
- Add dependant plan (with approval)
- View funding audit trail

### 5.4 Cover Plan Analytics
**View:**
- Total active cover plans
- Total suspended cover plans
- Average funding time
- Funding velocity
- Renewal success rate
- Suspension reasons
- Top-up frequency

---

## 6. PARTNER MANAGEMENT

### 6.1 View All Partners
**Display:**
- Shop name
- Responsible person
- Contact details
- Status (Active/Suspended/Pending/Rejected)
- Cashback percentage
- Category
- Linked agent
- Total transactions
- Total cashback issued
- Current invoice status
- Outstanding balance
- Registration date
- Approval date

### 6.2 Partner Details
**View:**
- Complete business information
- Cashback settings
- Store details (Plus1-Go)
- Product catalog (Plus1-Go)
- Transaction history
- Invoice history
- Payment history
- Linked agent details
- Performance metrics
- Member reviews/ratings

### 6.3 Partner Actions
**Perform:**
- Suspend partner
- Reactivate partner
- Update cashback percentage
- Reset partner PIN
- Update partner information
- Generate invoice
- Mark invoice as paid
- Send payment reminder
- View partner activity log
- Send notification to partner

### 6.4 Partner Search & Filter
**Search by:**
- Shop name
- Responsible person
- Mobile number
- Category

**Filter by:**
- Status
- Cashback percentage
- Category
- Linked agent
- Invoice status
- Transaction volume

---

## 7. PARTNER BILLING & INVOICES

### 7.1 Invoice Generation
**Process:**
1. Select billing period (month)
2. Select partners (all or specific)
3. System calculates total cashback issued
4. Generate invoice line items
5. Create invoice
6. Set due date
7. Send invoice to partner
8. Notify partner

### 7.2 View All Invoices
**Display:**
- Invoice number
- Partner name
- Invoice month
- Total amount
- Due date
- Status (Pending/Paid/Overdue)
- Payment date (if paid)
- Days overdue (if applicable)
- Grace period remaining

### 7.3 Invoice Details
**View:**
- Invoice header
- Partner details
- Invoice line items:
  - Transaction ID
  - Transaction date
  - Purchase amount
  - Cashback amount
- Subtotal
- Total amount due
- Payment instructions
- Payment history

### 7.4 Invoice Actions
**Perform:**
- Generate invoice
- Send invoice
- Resend invoice
- Mark as paid
- Record payment
- Apply payment
- Send payment reminder
- Extend grace period
- Suspend partner for non-payment
- Reverse invoice (if error)

### 7.5 Payment Processing
**Handle:**
- Receive proof of payment
- Verify payment
- Match payment to invoice
- Apply payment
- Update invoice status
- Update partner balance
- Reactivate partner (if suspended)
- Send payment confirmation

### 7.6 Overdue Invoice Management
**Track:**
- Overdue invoices
- Days overdue
- Grace period status
- Payment reminders sent
- Suspension warnings sent
- Partners suspended for non-payment

**Actions:**
- Send payment reminder
- Send final notice
- Suspend partner
- Arrange payment plan
- Waive late fees (if applicable)

---

## 8. AGENT MANAGEMENT

### 8.1 View All Agents
**Display:**
- Agent name
- Contact details
- Status (Active/Suspended/Pending/Rejected)
- Total linked partners
- Active partners
- Total commission earned
- Commission this month
- Pending payout
- Registration date
- Approval date

### 8.2 Agent Details
**View:**
- Complete profile information
- ID number
- Signed agreement
- Linked partners list
- Commission breakdown
- Payout history
- Performance metrics
- Activity log

### 8.3 Agent Actions
**Perform:**
- Suspend agent
- Reactivate agent
- Reset agent PIN
- Update agent information
- View commission details
- Process payout
- Link/unlink partners
- Send notification to agent

### 8.4 Agent Commission Tracking
**View:**
- Commission by agent
- Commission by period
- Commission by partner
- Commission by transaction type
- Pending commission
- Paid commission
- Commission trends

### 8.5 Agent Payout Processing
**Handle:**
1. Review monthly commission
2. Verify bank details
3. Calculate payout amount
4. Generate payout report
5. Process payment
6. Mark as paid
7. Send payout confirmation
8. Update agent records

---

## 9. DRIVER MANAGEMENT

### 9.1 View All Drivers
**Display:**
- Driver name
- Contact details
- Status (Offline/Online/Busy)
- Vehicle details
- Verification status
- Total deliveries
- Average rating
- Earnings this month
- Pending payout
- Registration date
- Approval date

### 9.2 Driver Details
**View:**
- Complete profile information
- Vehicle information
- Driver license details
- Verification documents
- Delivery history
- Earnings breakdown
- Payout history
- Ratings and reviews
- Performance metrics
- Activity log

### 9.3 Driver Actions
**Perform:**
- Verify driver
- Suspend driver
- Reactivate driver
- Reset driver PIN
- Update driver information
- Update vehicle information
- Process payout
- View delivery history
- Send notification to driver

### 9.4 Driver Earnings & Payouts
**Manage:**
- View driver earnings
- Calculate payout amount
- Verify bank details
- Process payout
- Mark as paid
- Send payout confirmation
- Track payout history

---

## 10. INSURER MANAGEMENT

### 10.1 View All Insurers
**Display:**
- Provider/insurer company name
- Contact person
- Contact details
- Status (Active/Suspended/Pending)
- Total cover plans managed
- Total members covered
- Last export date
- Registration date
- Approval date

### 10.2 Insurer Details
**View:**
- Complete profile information
- Cover plans managed
- Member coverage statistics
- Export history
- Data access permissions
- Activity log

### 10.3 Insurer Actions
**Perform:**
- Suspend insurer
- Reactivate insurer
- Reset insurer PIN
- Update insurer information
- Set data access permissions
- Approve export requests
- Send notification to insurer

### 10.4 Insurer Export Management
**Handle:**
- Review export requests
- Approve/reject exports
- Generate export files
- Send export to insurer
- Track export history
- Monitor export errors

---

## 11. TRANSACTION MANAGEMENT

### 11.1 View All Transactions
**Display:**
- Transaction ID
- Transaction date/time
- Partner name
- Member name
- Purchase amount
- Cashback percentage
- Total cashback
- System amount (1%)
- Agent amount (1%)
- Member amount
- Transaction type (in_store/delivery)
- Status (Completed/Pending/Reversed/Disputed)
- Order ID (if delivery)

### 11.2 Transaction Details
**View:**
- Complete transaction breakdown
- Partner details
- Member details
- Agent details (if applicable)
- Driver details (if delivery)
- Order details (if delivery)
- Cashback split
- Cover plan funded
- Wallet entry created
- Dispute information (if any)

### 11.3 Transaction Actions
**Perform:**
- View transaction details
- Reverse transaction
- Adjust transaction
- Resolve dispute
- Add notes
- Export transactions

### 11.4 Transaction Search & Filter
**Search by:**
- Transaction ID
- Partner name
- Member name
- Date

**Filter by:**
- Date range
- Partner
- Member
- Agent
- Transaction type
- Status
- Amount range

---

## 12. DISPUTE MANAGEMENT

### 12.1 View All Disputes
**Display:**
- Dispute ID
- Transaction ID
- Member name
- Partner name
- Dispute type
- Description
- Status (Open/In Progress/Resolved/Closed)
- Filed date
- Assigned to
- Resolution deadline

### 12.2 Dispute Details
**View:**
- Complete dispute information
- Transaction details
- Member statement
- Partner statement
- Evidence submitted
- Communication history
- Resolution notes
- Timeline

### 12.3 Dispute Actions
**Perform:**
- Assign dispute to admin
- Contact member
- Contact partner
- Request evidence
- Review evidence
- Make decision
- Reverse transaction (if needed)
- Adjust cashback (if needed)
- Add resolution notes
- Close dispute
- Reopen dispute

### 12.4 Dispute Types
**Handle:**
- Missing cashback
- Wrong transaction amount
- Duplicate transaction
- Unauthorized transaction
- Order not received (Plus1-Go)
- Order incorrect (Plus1-Go)
- Delivery issues
- Payment issues

---

## 13. TOP-UP MANAGEMENT

### 13.1 View Top-Up Requests
**Display:**
- Member name
- Cover plan
- Top-up amount
- Payment method
- Proof of payment
- Reference number
- Request date
- Status (Pending/Approved/Rejected)

### 13.2 Top-Up Processing
**Handle:**
1. Review top-up request
2. Verify proof of payment
3. Verify amount
4. Approve top-up
5. Apply to cover plan
6. Create wallet entry
7. Update cover plan status (if now active)
8. Send confirmation to member

### 13.3 Top-Up Actions
**Perform:**
- Approve top-up
- Reject top-up (provide reason)
- Request additional proof
- Apply to cover plan
- Reverse top-up (if error)
- Send confirmation

---

## 14. PLUS1-GO ORDER MANAGEMENT

### 14.1 View All Orders
**Display:**
- Order number
- Order date/time
- Member name
- Partner name
- Driver name (if assigned)
- Status
- Subtotal
- Delivery fee
- Total amount
- Payment status
- Delivery type

### 14.2 Order Details
**View:**
- Complete order information
- Order items
- Member details
- Partner details
- Driver details
- Delivery address
- Special instructions
- Status history
- Timestamps
- Transaction created
- Cashback issued

### 14.3 Order Actions
**Perform:**
- View order details
- Cancel order
- Refund order
- Reassign driver
- Contact member
- Contact partner
- Contact driver
- Resolve order issues
- Add notes

### 14.4 Order Search & Filter
**Search by:**
- Order number
- Member name
- Partner name
- Driver name

**Filter by:**
- Date range
- Status
- Partner
- Driver
- Delivery type
- Payment status

---

## 15. PRODUCT MANAGEMENT (PLUS1-GO)

### 15.1 View All Products
**Display:**
- Product name
- Partner name
- Category
- Price
- Availability
- Image
- Creation date

### 15.2 Product Moderation
**Actions:**
- Review new products
- Approve products
- Reject products (provide reason)
- Remove inappropriate products
- Update product information
- Manage product categories

---

## 16. REPORTS & ANALYTICS

### 16.1 Financial Reports
**Generate:**
- Total cashback issued
- Cashback by period
- Cashback by partner
- Partner invoice summary
- Outstanding invoices
- Payment collection rate
- Agent commission summary
- Driver earnings summary
- Revenue analysis
- Profit/loss analysis

### 16.2 Member Reports
**Generate:**
- Total members
- New member registrations
- Active members
- Suspended members
- Member growth trends
- Member demographics
- Member engagement
- Cover plan enrollment
- Cover plan activation rate
- Top-up frequency

### 16.3 Partner Reports
**Generate:**
- Total partners
- New partner registrations
- Active partners
- Suspended partners
- Partner by category
- Transaction volume by partner
- Cashback issued by partner
- Invoice payment rate
- Partner performance ranking

### 16.4 Agent Reports
**Generate:**
- Total agents
- Active agents
- Partners recruited by agent
- Commission earned by agent
- Agent performance ranking
- Agent retention rate

### 16.5 Driver Reports
**Generate:**
- Total drivers
- Active drivers
- Deliveries completed
- Earnings by driver
- Driver ratings
- Driver performance metrics

### 16.6 Transaction Reports
**Generate:**
- Total transactions
- Transactions by period
- Transactions by type
- Transaction trends
- Average transaction value
- Peak transaction times

### 16.7 Plus1-Go Reports
**Generate:**
- Total orders
- Order volume trends
- Order value analysis
- Delivery vs pickup ratio
- Order completion rate
- Average delivery time
- Partner performance
- Driver performance

### 16.8 Cover Plan Reports
**Generate:**
- Total cover plans
- Active vs suspended
- Funding progress
- Renewal success rate
- Suspension reasons
- Top-up frequency
- Plan popularity

### 16.9 Export Reports
**Download:**
- CSV format
- Excel format
- PDF format
- Custom date ranges
- Custom fields
- Scheduled reports

---

## 17. SYSTEM SETTINGS

### 17.1 General Settings
**Configure:**
- System name
- Contact information
- Business hours
- Time zone
- Currency
- Language

### 17.2 Cashback Settings
**Configure:**
- Minimum cashback percentage
- Maximum cashback percentage
- System fee percentage (default 1%)
- Agent commission percentage (default 1%)

### 17.3 Delivery Settings (Plus1-Go)
**Configure:**
- Driver commission percentage (default 93%)
- System fee percentage (default 5%)
- Agent commission percentage (default 2%)
- Default delivery radius
- Minimum order value

### 17.4 Cover Plan Settings
**Configure:**
- Default cover plan
- Active cycle duration (default 30 days)
- Grace period for renewals
- Suspension rules

### 17.5 Invoice Settings
**Configure:**
- Invoice generation schedule
- Invoice due date (days after generation)
- Grace period (days)
- Late payment penalties
- Suspension threshold

### 17.6 Payout Settings
**Configure:**
- Agent payout frequency
- Driver payout frequency
- Payout threshold
- Payout method

### 17.7 Notification Settings
**Configure:**
- Email templates
- SMS templates
- Push notification templates
- Notification triggers
- Notification schedules

---

## 18. USER MANAGEMENT

### 18.1 Admin Users
**Manage:**
- View all admin users
- Add new admin user
- Edit admin user
- Deactivate admin user
- Set admin permissions
- View admin activity log

### 18.2 Admin Permissions
**Configure:**
- Full access
- Read-only access
- Module-specific access
- Action-specific permissions

---

## 19. AUDIT & COMPLIANCE

### 19.1 Audit Logs
**View:**
- All system actions
- User actions
- Admin actions
- Data modifications
- Login history
- Failed login attempts
- Permission changes
- Critical operations

### 19.2 Audit Log Details
**See:**
- Action type
- Actor (user/admin)
- Actor role
- Table affected
- Record ID
- Old value
- New value
- Timestamp
- IP address

### 19.3 Compliance Monitoring
**Track:**
- KYC verification status
- Document expiry dates
- License renewals
- Agreement renewals
- Data protection compliance
- Privacy policy acceptance

---

## 20. NOTIFICATIONS & COMMUNICATION

### 20.1 Send Notifications
**To:**
- Individual member
- Individual partner
- Individual agent
- Individual driver
- Individual insurer
- All members
- All partners
- All agents
- All drivers
- All insurers
- Filtered groups

**Types:**
- Push notification
- Email
- SMS
- In-app message

### 20.2 Notification Templates
**Manage:**
- Create templates
- Edit templates
- Delete templates
- Preview templates
- Test templates

### 20.3 Broadcast Messages
**Send:**
- System updates
- Maintenance notices
- Policy changes
- Promotional announcements
- Important alerts

---

## 21. SUPPORT & HELP DESK

### 21.1 Support Tickets
**View:**
- All support tickets
- Ticket ID
- User name
- User role
- Issue type
- Description
- Status (Open/In Progress/Resolved/Closed)
- Priority
- Assigned to
- Created date

### 21.2 Ticket Management
**Actions:**
- Assign ticket
- Update status
- Add response
- Request information
- Escalate ticket
- Close ticket
- Reopen ticket

### 21.3 Support Categories
**Handle:**
- Technical issues
- Account issues
- Payment issues
- Transaction issues
- Order issues
- General inquiries

---

## 22. SYSTEM MONITORING

### 22.1 System Health
**Monitor:**
- Database status
- API status
- Server status
- Response times
- Error rates
- Uptime

### 22.2 Performance Metrics
**Track:**
- Active users
- Concurrent sessions
- Transaction volume
- Order volume
- API calls
- Database queries

### 22.3 Error Monitoring
**View:**
- System errors
- Application errors
- Database errors
- API errors
- Error frequency
- Error patterns

---

## SUMMARY OF ADMIN CAPABILITIES

**Approvals:** Approve partners, agents, drivers, insurers, cover plan changes  
**Member Management:** View, edit, suspend, reactivate members  
**Partner Management:** View, edit, suspend, reactivate partners, manage billing  
**Agent Management:** View, edit, manage commission and payouts  
**Driver Management:** View, edit, verify, manage earnings and payouts  
**Insurer Management:** View, edit, manage exports  
**Transactions:** View, reverse, adjust, resolve disputes  
**Billing:** Generate invoices, process payments, manage overdue accounts  
**Cover Plans:** Monitor funding, process top-ups, handle approvals  
**Plus1-Go:** Manage orders, products, deliveries  
**Reports:** Generate comprehensive reports across all modules  
**System Settings:** Configure all system parameters  
**Notifications:** Send messages and alerts to all user types  
**Support:** Handle support tickets and user inquiries  
**Audit:** Track all system actions and maintain compliance  

**Total Feature Categories:** 22  
**Total Actions Available:** 300+
