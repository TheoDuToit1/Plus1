Plus1 Rewards
Developer-Ready Structured Spec
Page-by-page dashboard structure, actions, and system flow

1. PLATFORM STRUCTURE OVERVIEW
   There are 5 role-based dashboards:
   Member Dashboard
   Partner Dashboard
   Agent Dashboard
   Provider Dashboard
   Admin Dashboard
   Each role must only see the pages and actions allowed for that role.
2. GLOBAL SYSTEM RULES
   2.1 Cashback Rule
   Partner chooses cashback percentage from 3% to 40%.
   Split is always:
   1% to system
   1% to agent
   remaining percentage to member
   2.2 Cover Plan Rule
   A cover plan becomes Active when its required target amount is fully reached.
   2.3 30-Day Rule
   Once active, the cover plan stays active for 30 days.
   At the end of 30 days:
   if full required amount is available again, plan stays Active
   if not, plan becomes Suspended
   2.4 Funding Order Rule
   If a member has multiple cover plans, funding happens in creation date order.
   oldest cover plan fills first
   next cover plan fills second
   next fills third
   2.5 Top-Up Rule
   Outstanding amounts may be paid in:
   full
   partial
   Top-up is done by EFT to Admin, triggered through a dashboard button that opens direct admin chat.
   2.6 Partner Suspension Rule
   If a partner is suspended:
   no new transactions can be processed
   member-facing transaction page must display:
   “Transaction error, please contact administrator”
   2.7 Approval Rule
   The following require telephonic conversation before final approval:
   new cover plans
   moving to another cover plan
   linked dependant or linked person additions
   2.8 Authentication Rule
   Members register with:
   full name
   mobile number
   6-number PIN
   Login uses:
   mobile number
   6-number PIN
   No OTP required.
3. MEMBER DASHBOARD SPEC
   3.1 Member Main Pages
   Registration Page
   Login Page
   Dashboard Home
   My Cover Plans
   Transactions History
   Linked People / Dependants
   Top-Up Page
   Profile / Settings
   QR Code Page
   Support / Admin Chat

3.2 Member Registration Page
Purpose
Create a new member account.
Fields
Full Name
Mobile Number
6-number PIN
Confirm PIN
Accept terms checkbox
Buttons
Register
Go to Login
Actions
Create user record
Create member profile
Create QR code
Create first default cover plan
Set cover plan status to supsended (becuase has to fully tup up to set status to active)
Redirect to dashboard or show success message
Validation
mobile number must be unique
PIN must be 6 digits
required fields cannot be blank

3.3 Member Login Page
Fields
Mobile Number
6-number PIN
Buttons
Login
Register
Forgot PIN / Contact Admin
Actions
authenticate member
redirect to Dashboard Home

3.4 Member Dashboard Home
Purpose
Quick view of member status.
Sections
Welcome block
Current main cover plan card
Cashback progress card
Cover plan status card
Overflow cashback card
Linked cover plans summary
Recent transactions
Notifications / important alerts
Show on page
member name
mobile number
QR code shortcut
current cover plan name
target amount
funded amount
amount still needed
active / suspended status
active until date if active
overflow balance
Buttons
View My Cover Plans
Show QR Code
View Transactions
Do Instant EFT
Contact Admin
Add Linked Person
Request Plan Change

3.5 My Cover Plans Page
Purpose
Show all cover plans linked to a member.
Sections
For each plan show:
plan name
creation order
target amount
funded amount
status
active from
active to
linked person if applicable
progress bar
Buttons per cover plan
View Details
Request Plan Change
Top Up This Plan
Actions
list cover plans in creation date order
first plan gets funded first
later plans only start receiving funding once earlier plans are fully handled according to wallet logic

3.6 Cover Plan Detail Page
Show
plan name
target amount
funded amount
status
last activation date
next cycle check date
linked person details if any
wallet entry history for this plan
Buttons
Do Instant EFT
Request Plan Change
Contact Admin

3.7 Transactions History Page
Show
transaction date
partner name
purchase amount
cashback percent
member cashback amount
status
Filters
date range
partner
status
Buttons
View Transaction Detail
Report Problem

3.8 Transaction Detail Page
Show
transaction ID
date and time
partner
purchase amount
cashback %
split values:
system amount
agent amount
member amount
cover plan credited
status
Buttons
Report Problem
Back to Transactions

3.9 Linked People / Dependants Page
Purpose
Manage dependant or linked cover requests.
Show
linked person name
ID number
relationship / link type
linked cover plan
status
Buttons
Add Linked Person
View Details
Contact Admin
Add Linked Person Form
Fields:
full name
ID number
relationship / type
notes
Action
submit request to Admin
flag for telephonic approval process

3.10 Top-Up Page
Purpose
Allow member to top up any shortfall.
Show
current cover plan
target amount
funded amount
shortfall
top-up history
Buttons
Do Instant EFT
Upload Proof of Payment
Contact Admin
Action
open direct chat with Admin
allow proof-of-payment upload
create pending top-up record

3.11 QR Code Page
Show
member QR code
member name
member number
Buttons
Download QR
Show Full Screen QR

3.12 Member Profile / Settings Page
Show
full name
mobile number
PIN change option
Buttons
Save Changes
Change PIN
Contact Admin

3.13 Member Support / Admin Chat Page
Purpose
Direct help channel.
Use cases
top-up support
cover plan questions
transaction problems
linked person requests
general support
Buttons
Start Chat
Upload Proof
Call Request

4. PARTNER DASHBOARD SPEC
   4.1 Partner Main Pages
   Registration Page
   Login Page
   Dashboard Home
   Process Transaction Page
   Transactions List
   Billing / Invoices
   Shop Profile
   Admin Chat / Payment Support

4.2 Partner Registration Page
Fields
business name
address
category
responsible person
mobile number
email
cashback percentage
included products/services
excluded products/services
6 digit PIN

Confirm 6 digit pin
agreement acceptance
Buttons
Register Partner
Go to Login
Actions
create user
create partner profile
set status pending approval
notify Admin

4.3 Partner Login Page
Fields
mobile number or email
6 digit PIN
Buttons
Login
Register
Contact Admin

4.4 Partner Dashboard Home
Sections
shop summary
cashback rate
today’s transactions
monthly totals
invoice status
suspension status
agent assigned
important notices
Show
business name
partner status
cashback %
current month transaction count
current month cashback liability
latest invoice amount
invoice due date
assigned agent
Buttons
Process Transaction
View Transactions
View Invoices
Do Instant EFT
Contact Admin

4.5 Process Transaction Page
Purpose
Capture member purchase and issue cashback.
Fields
member mobile number or QR scan input
purchase amount
Auto-loaded
partner cashback %
split calculation
member matched record
Show before submit
member name
purchase amount
cashback %
system amount
agent amount
member amount
Buttons
Submit Transaction
Clear
Contact Admin
Action
On submit:
check partner status
if suspended, block transaction
if active, save transaction
allocate cashback to member cover plan funding
generate wallet entries
update invoice totals
Suspended partner response
Display:
“Transaction error, please contact administrator”

4.6 Partner Transactions List Page
Show
date
member
purchase amount
cashback %
member amount
status
Filters
date
status
member number
Buttons
View Detail
Report Issue

4.7 Partner Transaction Detail Page
Show
full transaction split
capture time
member
invoice link status
notes if disputed
Buttons
Report Issue
Back

4.8 Billing / Invoices Page
Show
invoice month
invoice total
due date
payment status
paid date
overdue status
Buttons
View Invoice
Download Invoice
Do Instant EFT
Upload Proof of Payment
Contact Admin

4.9 Partner Shop Profile Page
Show
business details
cashback %
included and excluded items
responsible person
linked agent
status
Buttons
Request Detail Change
Contact Admin
Restriction
Partner cannot directly change cashback % without Admin.

4.10 Partner Admin Chat / Payment Support Page
Use cases
invoice help
proof of payment
activation after suspension
transaction problems
Buttons
Start Chat
Upload Proof
Request Call

5. AGENT DASHBOARD SPEC
   5.1 Agent Main Pages
   Registration Page
   Login Page
   Dashboard Home
   My Partner Shops
   Partner Shop Detail
   Commission Page
   Support Tools
   Profile

5.2 Agent Registration Page
Fields
full name
mobile number
email
ID number
agreement upload
6 digit PIN
Buttons
Register
Go to Login
Action
create user
create agent record
set pending approval

5.3 Agent Dashboard Home
Sections
profile summary
linked partner count
monthly commission
payout status
shop alerts
overdue invoice notices for linked shops
Buttons
View My Shops
View Commission
Support Shop
Contact Admin

5.4 My Partner Shops Page
Show
business name
status
cashback %
invoice status
monthly activity
contact person
Filters
active / suspended
invoice overdue
new shops
Buttons
View Shop Detail
Resend Shop Login Details
Contact Shop
Contact Admin

5.5 Partner Shop Detail Page for Agent
Show
business details
linked since date
current status
monthly transactions
invoice status
support notes
Buttons
Resend Login Details
Contact Shop
Add Support Note
Contact Admin
Restrictions
Agent cannot:
issue refunds
change cashback rates

5.6 Commission Page
Show
current month commission
prior months
payout threshold status
paid / pending status
payout history
Buttons
View Breakdown
Contact Admin

5.7 Commission Breakdown Page
Show
partner name
transaction totals
agent share earned
month total

5.8 Support Tools Page
Purpose
Help agents support partner shops.
Tools
resend shop login details
view invoice status
view shop profile
add support notes
contact shop
contact admin

5.9 Agent Profile Page
Show
full name
contact details
ID number
status
Buttons
Update Contact Details
Contact Admin

6. PROVIDER DASHBOARD SPEC
   6.1 Provider Main Pages
   Login Page
   Dashboard Home
   Active Cover Plans
   Suspended Cover Plans
   Export History
   Member / Linked Person View
   Profile

6.2 Provider Dashboard Home
Sections
active cover plan summary
suspended cover plan summary
export summary
pending approvals visible to provider if allowed
system notices
Buttons
View Active Cover Plans
View Suspended Cover Plans
View Exports

6.3 Active Cover Plans Page
Show
member name
member ID if allowed
cover plan name
status
active from
active to
linked person count
provider processing status
Filters
date
plan
status
Buttons
View Detail
Export View if allowed

6.4 Suspended Cover Plans Page
Show
member name
cover plan
suspended date
reason summary if visible
Buttons
View Detail

6.5 Cover Plan Detail Page for Provider
Show
member details
cover plan details
active dates
funding confirmation status
linked people approved
notes
Restriction
Provider should mostly view and process, not freely edit business-critical records unless permitted by Admin.

6.6 Export History Page
Show
export month
total cover plans
total value
exported at
status
Buttons
View Export
Download Export if allowed

6.7 Member / Linked Person View
Show
member name
main contact
linked people
ID numbers
relationship/link type
cover plan linked

7. ADMIN DASHBOARD SPEC
   7.1 Admin Main Pages
   Dashboard Home
   Approvals
   Members
   Member Cover Plans
   Partners
   Partner Billing / Invoices
   Agents
   Agent Commission
   Providers
   Transactions
   Disputes
   Top-Ups
   Exports
   Audit Logs
   Settings / Config

7.2 Admin Dashboard Home
Sections
total members
total active members
total partners
total active partners
total agents
total active cover plans
total suspended cover plans
cashback issued total
current month invoice total
overdue partner invoices
current month agent commission
pending approvals
open disputes
top-up pending approvals
export status
Buttons
Open Approvals
View Transactions
View Invoices
View Disputes
Create Export
Review Top-Ups

7.3 Approvals Page
Tabs
Partner Approvals
Agent Approvals
Provider Access Approvals
Cover Plan Change Requests
Linked Person Requests
Per-record show
applicant name
type
date submitted
status
notes
required documents
Buttons
Approve
Reject
Request More Info
Mark Call Required
Mark Call Completed
Important
Cover plan changes and linked person requests must support telephonic approval flow.

7.4 Members Page
Show
member name
mobile number
registration date
status
total cover plans
total cashback earned
overflow balance
Filters
status
registration date
member number
Buttons
View Member
Suspend if needed
Contact Member
Add Note

7.5 Member Detail Page
Show
profile details
QR code
linked cover plans
wallet summary
top-up history
linked people
support notes
transaction summary
Buttons
View Transactions
View Cover Plans
Add Manual Adjustment
Record Top-Up
Contact Member
Add Note

7.6 Member Cover Plans Page
Show
member
cover plan name
creation order
target amount
funded amount
status
active dates
linked person
approval status
Filters
status
plan
approval pending
Buttons
View Detail
Approve Plan Change
Suspend
Re-Activate
Add Manual Funding Entry
Add Note

7.7 Cover Plan Detail Page for Admin
Show
full funding history
wallet entries
cycle dates
linked people
top-ups
notes
approval history
Buttons
Approve Change
Suspend
Re-Activate
Add Manual Adjustment
Move Overflow if allowed
Add Note

7.8 Partners Page
Show
business name
cashback %
assigned agent
status
transaction count
current invoice amount
overdue flag
Buttons
View Partner
Approve
Suspend
Re-Activate
Change Assigned Agent
Contact Partner

7.9 Partner Detail Page for Admin
Show
full business details
cashback %
status
invoice history
transaction history
linked agent
support notes
included/excluded items
Buttons
Approve
Suspend
Re-Activate
Edit Details
Change Cashback %
Change Agent
Add Note
Contact Partner

7.10 Partner Billing / Invoices Page
Show
partner
invoice month
amount
due date
payment status
overdue days
suspension status
Buttons
View Invoice
Generate Invoice
Mark Paid
Mark Overdue
Suspend Partner
Upload Invoice
Send Reminder

7.11 Invoice Detail Page
Show
invoice header
partner details
line items
transaction list
totals
notes
proof of payment files if uploaded
Buttons
Mark Paid
Send Reminder
Suspend Partner
Add Note

7.12 Agents Page
Show
agent name
contact
linked partner count
monthly commission
status
Buttons
View Agent
Approve
Suspend
Re-Activate
Contact Agent

7.13 Agent Detail Page
Show
agent profile
linked partners
commission history
payout history
notes
Buttons
Approve
Suspend
Re-Activate
Add Note
Contact Agent

7.14 Agent Commission Page
Show
agent
month
total commission
payout threshold met
payout status
Buttons
View Breakdown
Mark Paid
Hold Payout
Add Note

7.15 Providers Page
Show
provider user
access level
status
last login
export visibility
Buttons
Approve Access
Suspend Access
View Provider
Contact Provider

7.16 Provider Detail Page
Show
provider profile
exports visible
activity log
notes
Buttons
Approve Access
Suspend Access
Create Export
Add Note

7.17 Transactions Page
Show
transaction ID
date
member
partner
agent
purchase amount
cashback %
split values
status
Filters
date range
member
partner
status
disputed
invoice linked
Buttons
View Detail
Reverse Transaction
Mark Disputed
Add Note

7.18 Transaction Detail Page for Admin
Show
full split
invoice link
cover plan wallet effect
dispute status
notes
audit trail
Buttons
Reverse Transaction
Reissue if supported
Mark Resolved
Add Manual Adjustment
Add Note

7.19 Disputes Page
Show
dispute ID
member
partner
transaction
type
status
created date
Buttons
View Dispute
Mark In Review
Resolve
Reject
Add Note

7.20 Dispute Detail Page
Show
full complaint
linked transaction
member note
partner note
admin notes
resolution history
Buttons
Resolve
Reject
Reverse Transaction
Add Manual Adjustment
Add Note

7.21 Top-Ups Page
Show
payer type
payer name
linked cover plan if applicable
amount
proof of payment
approval status
Buttons
View Top-Up
Approve
Reject
Add to Cover Plan
Add Note

7.22 Exports Page
Show
export month
provider
total cover plans
total value
status
created date
Buttons
Create Export
View Export
Mark Exported
Download File
Add Note

7.23 Export Detail Page
Show
included cover plans
totals
statuses
failed items
notes
Buttons
Rebuild Export
Mark Exported
Remove Bad Record
Add Note

7.24 Audit Logs Page
Show
date/time
user
action
table
record
old value summary
new value summary
Filters
user
action type
table
date

7.25 Settings / Config Page
Sections
cashback rule display
invoice timing settings
status label settings
export settings
system notices
support contact details
Restriction
Only senior admin should access this.

8. CORE DATABASE BEHAVIOUR FOR DEVELOPERS
   8.1 Required Tables
   Core tables should include:
   users
   members
   partners
   agents
   partner_agent_links
   providers
   cover_plans
   member_cover_plans
   linked_people
   transactions
   cover_plan_wallet_entries
   top_ups
   partner_invoices
   invoice_items
   agent_commissions
   provider_exports
   provider_export_items
   disputes
   audit_logs

8.2 Transaction Processing Logic
When partner submits a transaction:
check partner status
if suspended, block transaction
find member by mobile number or QR
load partner cashback %
calculate split:
system 1%
agent 1%
member remainder
create transaction record
allocate member amount to earliest cover plan by creation order
create wallet entry
update invoice totals
update dashboards

8.3 Cover Plan Allocation Logic
When member cashback is added:
sort member cover plans by creation date ascending
apply funding to first eligible cover plan
if first is satisfied according to wallet rules, continue to next
remaining extra goes to overflow or next funding path
You may later want a dedicated funding engine service for this, because this is the heart of the platform. Tiny bug here, big chaos everywhere 🌊

8.4 30-Day Renewal Logic
Daily scheduled job should:
find cover plans whose active_to date is reached
check if required target amount is available again
if yes:
renew active_from
renew active_to for next 30 days
keep status active
if no:
set status suspended

8.5 Top-Up Logic
When Admin approves a top-up:
create top-up record if not already there
create wallet entry
add amount to linked cover plan
recalculate funded amount
if target reached:
activate or re-activate cover plan

8.6 Invoice Logic
Monthly invoice job should:
collect all completed transactions for each partner in invoice month
total liability
create invoice
create invoice items
set due date
show on partner dashboard
allow admin to mark overdue / suspend if unpaid

8.7 Audit Logic
Every important admin action should create an audit log entry:
approval
rejection
suspension
re-activation
transaction reversal
manual adjustment
top-up approval
export creation
invoice mark paid

9. PAGE ACCESS MATRIX
   Member can access
   own dashboard
   own cover plans
   own transactions
   own linked people requests
   own top-ups
   admin chat
   Partner can access
   own shop dashboard
   own transactions
   own invoices
   own profile
   admin chat
   Agent can access
   own dashboard
   linked partner shops
   commission pages
   support tools
   Provider can access
   provider dashboard
   active cover plan views
   suspended cover plan views
   export history
   Admin can access
   full system management pages
10. BUTTON ACTION SUMMARY
    Common action buttons by role
    Member
    Register
    Login
    Show QR Code
    View Transactions
    Do Instant EFT
    Upload Proof of Payment
    Add Linked Person
    Request Plan Change
    Contact Admin
    Partner
    Register Partner
    Process Transaction
    View Invoices
    Do Instant EFT
    Upload Proof of Payment
    Report Issue
    Contact Admin
    Agent
    Register
    View My Shops
    View Commission
    Resend Shop Login Details
    Contact Shop
    Contact Admin
    Provider
    Login
    View Active Cover Plans
    View Exports
    Admin
    Approve
    Reject
    Suspend
    Re-Activate
    Mark Paid
    Reverse Transaction
    Add Manual Adjustment
    Create Export
    Resolve Dispute
    Approve Top-Up
    Add Note
11. THINGS I RECOMMEND NEXT
    The next best step is to turn this into 3 build layers:
    Layer 1
    Database schema and permissions
    Layer 2
    Dashboard UI pages for each role
    Layer 3
    Automation logic:
    cashback split
    cover plan funding
    30-day checks
    invoice generation
    suspension and re-activation
    exports
    That way your developer is not trying to cook the whole feast in one pan and set the curtains on fire.
