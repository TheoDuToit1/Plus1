Plus1 Rewards
Clear Project Flow Document
Easy guide for members, managers, developers, and partners
Health care for all!

IMPORTANT DATABASE STRUCTURE NOTE (Updated 2026-03-29):
This project has NO central users table. Each role (members, partners, agents, insurers, drivers) is self-contained with its own authentication using cell_phone (for members) or mobile_number (for other roles) and pin_code. Admin users are stored in the members table with role='admin'. All references to "Provider" have been updated to "Insurer" to reflect the correct terminology.

AUTHENTICATION IMPLEMENTATION (Updated 2026-03-29):
- Members authenticate using: members.cell_phone + members.pin_code
- Partners authenticate using: partners.mobile_number + partners.pin_code
- Agents authenticate using: agents.mobile_number + agents.pin_code
- Insurers authenticate using: insurers.mobile_number + insurers.pin_code
- Drivers authenticate using: drivers.mobile_number + drivers.pin_code
- Sessions store role-specific data directly (no user_id references)
- Dashboards fetch fresh data from database on each load (not from stale session data)

1. What Plus1 Rewards is
   Plus1 Rewards is a system that helps people get access to medical cover by shopping at partner stores.
   The idea is simple:
   Members shop at partner stores
   The store gives cashback in rand value
   That cashback goes toward the memberâ€™s cover plan
   Once enough cashback has been earned for the selected cover plan, the cover plan becomes Active
   If enough cashback is not available for the next cycle, the cover plan becomes Suspended until enough cashback is earned again or the member tops up the shortfall
   This is not a normal loyalty points system.
   Plus1 Rewards uses real cashback value, not points.
2. The 6 roles in the system
   There are 6 main roles in Plus1 Rewards:
3. Member
   A person who shops at partner stores and earns cashback toward a cover plan.
4. Partner
   A shop or business that offers cashback to members when they shop (used in both Rewards and Plus1-Go).
5. Agent
   A person who brings partner shops into the system and helps support those shops.
6. Insurer
   The medical cover provider that receives approved cover plan data and supplies the actual cover.
7. Driver
   A delivery driver who fulfills Plus1-Go delivery orders.
8. Admin
   The control centre that manages the full system (stored as a member with role='admin').
8. Cashback model
   The partner shop chooses a cashback percentage between 3% and 40%.
   The split always works like this:
   1% goes to the system
   1% goes to the agent
   The rest goes to the memberâ€™s cover plan
   Example
   If a partner gives 7% cashback:
   1% goes to the system
   1% goes to the agent
   5% goes to the member
9. Who pays for the cashback
   The partner shop gives cashback to members during the month when transactions happen.
   At month end:
   The system totals all cashback issued by that partner
   The partner shop receives an invoice
   The partner shop pays Plus1 Rewards for that monthâ€™s cashback activity
   So the member earns during the month, and the partner pays by invoice at month end.

MEMBER FLOW
5. Member registration
A member registers once on the platform and can then use all approved partner shops in the network.
Member registration details:
Name
Mobile number
6-number PIN
The mobile number and 6-number PIN become the memberâ€™s login details.
No OTP is needed.
After registration:
The member account is created
A unique QR code is created
The default cover plan is assigned
The member can log in using mobile number and PIN
The member can shop using mobile number or QR code

6. Member dashboard
   The member dashboard should show:
   Member name
   Mobile number
   QR code
   Current cover plan
   Cashback progress
   Cover plan status
   Overflow cashback
   Linked dependants or added cover plans
   Top-up option
   Transaction history
   Plus1-Go order history (if using delivery)
   Saved delivery addresses
7. Default cover plan
   Each member starts on a default cover plan.
   For now, the project uses sample placeholder plan names and values.
   These will be updated later with the real plan names.
   Example:
   Default cover plan value: R385
   The memberâ€™s goal is to earn enough cashback to reach that total.
8. How members earn cashback
   When a member shops at a partner store:
   The member gives their mobile number or shows their QR code
   The partner enters the transaction
   Cashback is calculated
   Cashback is added toward the memberâ€™s cover plan
   The member can see updated progress in the dashboard
   Example
   If the member spends R1,000 at a shop giving 5% cashback:
   Total cashback = R50
   1% goes to system
   1% goes to agent
   3% goes to the member cover plan
9. When a cover plan becomes Active
   A cover plan becomes Active when the required cashback total for that plan is reached.
   Example
   If the plan total is R385:
   When the member reaches R385, the cover plan becomes Active
10. 30-day active cycle
    Once a cover plan becomes Active:
    It stays Active for 30 days
    After 30 days, the system checks whether the required full amount is available again for that same cover plan
    If enough cashback is available:
    The cover plan stays Active
    If enough cashback is not available:
    The cover plan moves to Suspended
    The member then needs to:
    Shop more until enough cashback is earned again, or
    Use top-up to reach the required total
    Once the required amount is reached again, the cover plan becomes Active again.
11. Suspended cover plans
    If a member does not have enough cashback for the next 30-day cycle:
    The cover plan becomes Suspended
    It stays suspended until the required amount is reached again
    This gives the member a simple status flow:
    Active
    Suspended
    Active again once enough cashback or top-up is received
12. Top-up option
    A member can top up any shortfall on a cover plan.
    This can be done:
    By EFT directly to Admin
    Through a â€œDo Instant EFTâ€ button in the member dashboard
    That button opens a direct chat with Admin
    Top-ups can be:
    Full
    Partial
    This means if the member is short, they do not always need to wait for shopping alone to reach the full amount.
13. Overflow cashback
    If a member keeps shopping after a cover plan has already reached its required total, the extra cashback becomes overflow cashback.
    Overflow cashback can help with:
    The next 30-day cycle
    Higher cover plans
    Added dependants
    Additional cover plans
14. Multiple cover plans
    A member can have more than one cover plan linked to their account.
    Examples include:
    Their own main cover plan
    Added dependant cover
    Extra cover plans for other linked people
    Important rule:
    Multiple cover plans are filled in the order of creation date.
    That means:
    First created cover plan fills first
    Second created cover plan fills second
    Third created cover plan fills third
    This keeps the funding order simple and clear.
15. Dependants and linked people
    Dependants or other linked people are not treated as fully separate self-managed users in the same way as the main member.
    For these linked cover plans, the system needs:
    Full names
    ID numbers
    Link to the main member
    Communication should preferably happen through the main member by telephone.
    For:
    New cover plans
    Moving to a different cover plan
    Approving linked people
    There must be a telephonic conversation before approval.

PARTNER FLOW
16. Partner registration
A partner is a business or shop that joins Plus1 Rewards and offers cashback to members.
Partner registration should include:
Business name
Address
Category
Responsible person
Contact details
Cashback percentage
Included products or services
Excluded products or services
Agreement acceptance
The cashback percentage can be from 3% to 40%.
After registration, the partner waits for Admin approval.

17. Partner dashboard
    The partner dashboard should show:
    Shop details
    Cashback percentage
    Agent linked to that partner
    Transactions processed
    Monthly totals
    Invoice status
    Suspension status
    â€œDo Instant EFTâ€ button
    Admin chat access
18. Partner transaction flow
    When a member shops:
    The member gives mobile number or QR code
    The partner enters the transaction
    Cashback is calculated and allocated
    The member cover plan progress updates
19. What happens if a partner is suspended
    If a partner shop is suspended:
    The member-facing landing page must show:
    â€œTransaction error, please contact administratorâ€
    No transactions can be processed
    Members cannot earn cashback from that partner while suspended
    This is important because suspension must stop live use immediately.
20. Partner billing cycle
    The partner issues cashback during the month.
    At month end:
    Admin or system generates the invoice
    The partner pays the invoice to Plus1 Rewards
    Suggested cycle:
    Invoice generated near month end
    Payment due by month end or set due date
    Grace period applies
    Late notice is sent
    Suspension happens if payment is not made
21. Partner top-up and payment support
    The partner dashboard should also have a â€œDo Instant EFTâ€ button.
    This button should:
    Open direct chat with Admin
    Help the partner confirm or arrange fast payment
    Assist with outstanding balances when needed

AGENT FLOW
22. Agent role
An agent helps grow the network by bringing in partner shops and helping those shops operate properly.
The agent earns 1% from partner transactions linked to shops they manage.

23. What agents can do
    Agents can:
    Recruit partner shops
    Help shops with setup
    Support shops with daily usage
    Help with member questions
    Keep shop information updated
    View linked shop data
    View invoice status
    Resend shop login details
    Support communication with shops
24. What agents cannot do
    Agents cannot:
    Issue refunds
    Change cashback rates
    Those actions must stay under Admin control.
25. Agent dashboard
    The agent dashboard should show:
    Agent profile
    Linked partner shops
    Cashback activity
    Commission earned
    Payout progress
    Invoice visibility for linked shops
    Shop support tools
26. Agent payout
    Agent commission is earned from linked partner transactions.
    The system should track:
    Monthly commission earned
    Payout threshold
    Payout date
    Payout history

INSURER FLOW
27. Insurer role
The insurer is the medical cover company.
The insurer must be able to:
Log into the dashboard
View approved and active cover plan data
Receive export data when needed
So the insurer is not only receiving files.
The insurer also has dashboard access.

28. Insurer dashboard
    The insurer dashboard should show:
    Active cover plans
    Suspended cover plans where relevant
    Member details needed for cover processing
    Linked dependant details where approved
    Export history
    Status updates
29. Cover plan changes and approvals
    For any:
    New cover plan
    Move to another cover plan
    Linked dependant or linked person addition
    There should be a telephonic conversation before approval.
    This is important for clean communication and correct insurer processing.

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

ADMIN FLOW
30. Admin role
The Admin is the control centre of Plus1 Rewards.
Admin manages the whole system across:
Members
Partners
Agents
Insurers
Drivers
Transactions
Billing
Disputes
Exports
Approvals
Admin should not feel like a random back office section.
It should follow the real business flow of the project.
So the Admin structure should be built around:
Approvals
Member and cover plan monitoring
Partner billing
Agent commission
Insurer export
Disputes and audit

31. Admin section layout
    A. Approvals
    Admin approves:
    Partners
    Agents
    Insurer users
    Drivers
    Special cover plan requests
    Linked dependant or linked person requests where needed
    B. Members and cover plans
    Admin monitors:
    Member registration
    Cashback progress
    Active cover plans
    Suspended cover plans
    Overflow cashback
    Top-ups
    Linked dependants
    Added cover plans
    Plan change requests
    C. Partners and billing
    Admin manages:
    Partner approvals
    Cashback settings
    Invoice generation
    Payment status
    Grace periods
    Suspensions
    Re-activation after payment
    D. Agent commission
    Admin monitors:
    Which shops are linked to which agent
    Commission earned
    Monthly payout status
    Agent performance
    E. Insurer export and insurer dashboard control
    Admin manages:
    Which cover plans are ready
    Which records are approved
    What is visible to the insurer
    Export history
    Errors or missing data
    F. Disputes and audit
    Admin handles:
    Missing cashback
    Wrong transactions
    Reversals
    Manual adjustments
    Notes
    Full history tracking
    User action logs
32. Admin dashboard overview
    The Admin dashboard should give a quick full view of the business.
    It should show:
    Total members
    Total active members
    Total partners
    Total active partners
    Total agents
    Total drivers
    Total active cover plans
    Total suspended cover plans
    Total cashback issued
    Total partner invoices due
    Total overdue invoices
    Total agent commission due
    Top-up activity
    Pending approvals
    Insurer export status
    Open disputes
33. Admin actions that must exist
    Admin should be able to:
    Approve or reject partner applications
    Approve or reject agent applications
    Approve or reject driver applications
    Approve insurer access
    Suspend and re-activate partners
    View member funding progress
    View cover plan status
    Record top-up payments
    View and manage linked cover plans
    Generate invoices
    Mark invoices paid
    Handle disputes
    Reverse transactions where allowed
    Add manual adjustments
    Track audit history
    Manage insurer export or visibility

