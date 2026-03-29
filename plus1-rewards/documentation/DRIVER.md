# DRIVER - Complete Feature & Activity Guide

**Role:** Driver (Delivery Driver)  
**Platform:** Plus1-Go  
**Purpose:** Fulfill delivery orders, earn delivery fees

---

## 1. REGISTRATION & ONBOARDING

### 1.1 Initial Registration
- Enter full name
- Enter mobile number (becomes login username)
- Create 6-digit PIN (becomes login password)
- Enter contact phone number
- Enter email address
- Enter vehicle details:
  - Vehicle type
  - Vehicle make
  - Vehicle color
  - Vehicle registration number
- Enter driver license number
- Upload driver license photo
- Accept terms and conditions
- Submit registration

### 1.2 Application Review
- Application status: Pending
- Wait for admin approval and verification
- KYC verification process
- Vehicle verification
- License verification
- Receive notification when approved/rejected

### 1.3 Account Activation (After Approval)
- Account status changes to Active
- is_verified set to true
- Receive approval notification
- Can now log in
- Access driver dashboard
- Begin accepting deliveries

---

## 2. LOGIN & AUTHENTICATION

### 2.1 Login Process
- Enter mobile number
- Enter 6-digit PIN
- No OTP required
- Access driver dashboard

### 2.2 Session Management
- Stay logged in
- Log out
- Forgot PIN (contact admin)

---

## 3. DRIVER DASHBOARD (OVERVIEW)

### 3.1 Dashboard Home
**View:**
- Driver name and photo
- Current status (Offline/Online/Busy)
- Vehicle details
- Driver rating (average)
- Total deliveries completed
- Earnings today
- Earnings this week
- Earnings this month
- Pending earnings
- Next payout date
- Active delivery (if any)
- Available delivery requests
- Quick status toggle
- Quick action buttons

### 3.2 Driver Profile
**View:**
- Full name
- Mobile number
- Email
- Phone
- Vehicle type, make, color, registration
- Driver license number
- License photo
- Registration date
- Approval date
- Verification status
- Total deliveries
- Average rating
- Account status

---

## 4. STATUS MANAGEMENT

### 4.1 Driver Status
**Three states:**
1. **Offline** - Not available for deliveries
2. **Online** - Available and waiting for delivery requests
3. **Busy** - Currently on an active delivery

### 4.2 Go Online
**Action:**
- Toggle status to Online
- GPS location activated
- System tracks current location
- Receive delivery requests in radius
- Wait for order assignments

### 4.3 Go Offline
**Action:**
- Toggle status to Offline
- Stop receiving delivery requests
- GPS tracking paused
- Cannot accept new deliveries

### 4.4 Busy Status (Automatic)
**Triggered when:**
- Accept a delivery request
- Status changes to Busy
- Cannot receive new requests
- Returns to Online after delivery complete

---

## 5. DELIVERY REQUESTS

### 5.1 Receive Delivery Request
**Notification includes:**
- Partner name and address
- Delivery address
- Distance to partner
- Distance to delivery address
- Total distance
- Estimated delivery fee
- Estimated earnings (93%)
- Order details preview
- Time limit to accept

### 5.2 Accept Delivery
**Action:**
- Review delivery details
- Tap "Accept"
- Status changes to Busy
- Navigate to partner location
- Receive partner contact details

### 5.3 Decline Delivery
**Action:**
- Tap "Decline"
- Optionally provide reason
- Remain Online
- Continue receiving requests

### 5.4 Request Queue
**View:**
- Multiple pending requests (if available)
- Request details
- Distance and earnings
- Time remaining to accept
- Priority indicators

---

## 6. ACTIVE DELIVERY FLOW

### 6.1 Navigate to Partner
**After accepting:**
- View partner location on map
- Get directions to partner
- Estimated time to arrival
- Partner contact button
- Order details
- Special instructions

### 6.2 Arrive at Partner
**Actions:**
- Mark "Arrived at partner"
- Wait for order preparation
- View order items
- Verify order completeness
- Contact partner if issues

### 6.3 Pick Up Order
**Actions:**
- Verify order items
- Mark "Order picked up"
- Status updates to "Picked Up"
- Navigate to delivery address
- Member notified

### 6.4 Navigate to Member
**During delivery:**
- View delivery address on map
- Get directions to member
- Estimated time to arrival
- Member contact button
- Special delivery instructions
- GPS tracking active (member can see)

### 6.5 Arrive at Delivery Address
**Actions:**
- Mark "Arrived at delivery address"
- Contact member if needed
- Hand over order
- Verify delivery

### 6.6 Complete Delivery
**Actions:**
- Mark "Delivery complete"
- Confirm delivery with member
- Order status updated to Delivered
- Earnings calculated and recorded
- Status returns to Online
- Ready for next delivery

---

## 7. ORDER DETAILS

### 7.1 View Order Information
**See:**
- Order number
- Partner name and address
- Member name and phone
- Delivery address
- Order items list
- Order total
- Delivery fee
- Driver earnings (93% of delivery fee)
- Special instructions
- Estimated prep time

### 7.2 Contact Information
**Access:**
- Partner phone number
- Member phone number
- Call partner button
- Call member button
- In-app messaging (if available)

---

## 8. GPS & LOCATION TRACKING

### 8.1 Location Services
**When Online:**
- GPS automatically activated
- Current location tracked
- Location updated in real-time
- Stored in delivery_tracking table
- Member can see driver location during delivery

### 8.2 Location Updates
**Frequency:**
- Continuous while Online or Busy
- Recorded at regular intervals
- Displayed on member's map
- Used for distance calculations

### 8.3 Location Privacy
**When Offline:**
- GPS tracking paused
- Location not shared
- Last known location stored

---

## 9. EARNINGS TRACKING

### 9.1 Earnings Dashboard
**View:**
- Total earnings (all time)
- Earnings today
- Earnings this week
- Earnings this month
- Pending earnings
- Paid earnings
- Average earnings per delivery
- Earnings growth trend

### 9.2 Earnings Calculation
**Per delivery:**
- Total delivery fee = 100%
- Driver receives = 93%
- System receives = 5%
- Agent receives = 2%
- Calculated automatically
- Recorded in driver_earnings table

### 9.3 Earnings Breakdown
**View:**
- Earnings per delivery
- Delivery date and time
- Partner name
- Order number
- Total delivery fee
- Driver amount (93%)
- System amount (5%)
- Agent amount (2%)
- Status (pending/paid)

### 9.4 Earnings by Period
**View:**
- Daily earnings
- Weekly earnings
- Monthly earnings
- Earnings trends
- Peak earning times
- Best performing days

---

## 10. PAYOUT MANAGEMENT

### 10.1 Payout Schedule
**View:**
- Payout frequency (weekly/monthly)
- Next payout date
- Payout threshold (if any)
- Payout method

### 10.2 Pending Payouts
**Track:**
- Current period earnings
- Accumulated amount
- Estimated payout date
- Payout status

### 10.3 Payout History
**View:**
- All past payouts
- Payout date
- Payout amount
- Payout period
- Payment method
- Payment reference
- Paid by (admin name)

### 10.4 Bank Details
**Manage:**
- Add bank account
- Bank name
- Account number
- Account holder name
- Branch code
- Update bank details

---

## 11. DELIVERY HISTORY

### 11.1 View All Deliveries
**Display:**
- Delivery date and time
- Order number
- Partner name
- Member name
- Delivery address
- Distance traveled
- Delivery fee
- Driver earnings
- Delivery status
- Rating received (if any)

### 11.2 Filter Deliveries
**Filter by:**
- Date range
- Partner
- Status (Completed/Cancelled)
- Earnings range

### 11.3 Search Deliveries
**Search by:**
- Order number
- Partner name
- Member name
- Date

### 11.4 Delivery Details
**View:**
- Complete delivery breakdown
- Pickup and delivery addresses
- Distance traveled
- Time taken
- Earnings breakdown
- Order items
- Special instructions
- Timestamps (accepted, picked up, delivered)

---

## 12. RATINGS & REVIEWS

### 12.1 View Ratings
**See:**
- Overall driver rating (1-5 stars)
- Total number of ratings
- Rating breakdown (5 stars, 4 stars, etc.)
- Recent ratings

### 12.2 Review Management
**View each review:**
- Member name (or anonymous)
- Rating (stars)
- Review text
- Review date
- Order number

### 12.3 Rating Statistics
**Track:**
- Average rating over time
- Rating trends
- Most common feedback
- Improvement areas

### 12.4 Rating Impact
**Understand:**
- How ratings affect visibility
- Rating requirements
- Improvement tips
- Best practices

---

## 13. PERFORMANCE METRICS

### 13.1 Delivery Statistics
**View:**
- Total deliveries completed
- Deliveries today
- Deliveries this week
- Deliveries this month
- Average deliveries per day
- Delivery completion rate
- On-time delivery rate

### 13.2 Time Metrics
**Track:**
- Average pickup time
- Average delivery time
- Total time per delivery
- Fastest delivery
- Peak delivery hours

### 13.3 Distance Metrics
**View:**
- Total distance traveled
- Average distance per delivery
- Longest delivery
- Distance efficiency

### 13.4 Performance Score
**See:**
- Overall performance rating
- Rating breakdown
- Completion rate
- On-time rate
- Member satisfaction
- Areas for improvement

---

## 14. NAVIGATION & MAPS

### 14.1 Integrated Maps
**Features:**
- Real-time navigation
- Turn-by-turn directions
- Traffic updates
- Estimated arrival time
- Route optimization
- Alternative routes

### 14.2 Partner Location
**View:**
- Partner address on map
- Distance to partner
- Estimated time to arrival
- Partner contact details

### 14.3 Delivery Location
**View:**
- Delivery address on map
- Distance to delivery
- Estimated time to arrival
- Member contact details
- Special instructions

---

## 15. NOTIFICATIONS

### 15.1 Push Notifications
**Receive alerts for:**
- New delivery request
- Delivery request expiring soon
- Order ready for pickup
- Member location updated
- Delivery completed
- Earnings added
- Payout processed
- Rating received
- Account status changes
- Admin messages

### 15.2 Notification Settings
**Manage:**
- Enable/disable notifications
- Choose notification types
- Set quiet hours
- Sound preferences
- Vibration preferences

---

## 16. VEHICLE MANAGEMENT

### 16.1 Vehicle Information
**View:**
- Vehicle type
- Vehicle make
- Vehicle color
- Vehicle registration
- License plate number

### 16.2 Update Vehicle
**Edit:**
- Vehicle type
- Vehicle make
- Vehicle color
- Vehicle registration
- Upload new vehicle photo

### 16.3 Multiple Vehicles (if supported)
**Manage:**
- Add additional vehicles
- Switch active vehicle
- Set default vehicle
- Remove vehicle

---

## 17. SUPPORT & HELP

### 17.1 Driver Help Center
**Access:**
- Driver FAQs
- Delivery process guide
- Navigation help
- Earnings information
- Payout information
- Rating system explained
- Troubleshooting

### 17.2 Contact Support
**Options:**
- Support chat
- Email support
- Phone support
- Emergency hotline
- Report issue

### 17.3 Report Issues
**Report:**
- Order issues
- Member issues
- Partner issues
- Payment issues
- App technical issues
- Safety concerns

### 17.4 Emergency Support
**Access:**
- Emergency contact button
- Safety features
- Incident reporting
- Admin emergency line

---

## 18. ACCOUNT SETTINGS

### 18.1 Profile Management
**Edit:**
- Full name
- Email address
- Contact phone
- Profile photo
- Vehicle details
- License information

**Cannot change:**
- Mobile number (used for login)

### 18.2 Security
**Manage:**
- Change PIN
- View login history
- Manage device tokens
- Enable biometric login (if available)

### 18.3 Account Status
**View:**
- Current status (Active/Suspended/Offline)
- Verification status
- Account warnings
- Compliance status

### 18.4 KYC & Verification
**View:**
- KYC verification status
- License verification status
- Vehicle verification status
- Required documents
- Upload documents
- Verification progress

---

## 19. AVAILABILITY MANAGEMENT

### 19.1 Set Availability
**Manage:**
- Preferred working hours
- Available days
- Break times
- Unavailable periods

### 19.2 Schedule
**View:**
- Upcoming shifts (if scheduled)
- Hours worked today
- Hours worked this week
- Target hours
- Availability calendar

---

## 20. DRIVER STATISTICS

### 20.1 Personal Stats
**View:**
- Total deliveries
- Total earnings
- Total distance traveled
- Average rating
- Completion rate
- On-time rate
- Driver since date
- Best delivery time
- Longest delivery
- Favorite partner

### 20.2 Leaderboard (if enabled)
**See:**
- Driver rankings
- Top earners
- Most deliveries
- Highest rated
- Performance comparisons

---

## 21. SAFETY FEATURES

### 21.1 Safety Tools
**Access:**
- Emergency contact button
- Share trip with contact
- Safety checklist
- Incident reporting
- Safety tips

### 21.2 Safety Guidelines
**View:**
- Delivery safety protocols
- COVID-19 guidelines
- Contactless delivery
- Vehicle safety
- Personal safety

---

## 22. COMPLIANCE & DOCUMENTATION

### 22.1 Required Documents
**Upload/manage:**
- Driver license (front and back)
- Vehicle registration
- Insurance documents
- ID document
- Proof of address
- Background check (if required)

### 22.2 Document Expiry
**Track:**
- License expiry date
- Insurance expiry date
- Registration expiry date
- Renewal reminders
- Update documents

### 22.3 Compliance Status
**View:**
- Document verification status
- Compliance requirements
- Outstanding items
- Renewal dates

---

## SUMMARY OF DRIVER CAPABILITIES

**Registration & Setup:** Register, await verification, complete profile  
**Status Management:** Go online/offline, manage availability  
**Delivery Requests:** Receive, accept/decline delivery requests  
**Active Deliveries:** Navigate, pickup, deliver, complete orders  
**Earnings:** Track earnings, view breakdown, manage payouts  
**Performance:** View ratings, statistics, and performance metrics  
**Navigation:** Use integrated maps, real-time directions  
**Support:** Access help center, report issues, emergency support  
**Notifications:** Receive alerts for requests, earnings, and updates  

**Total Feature Categories:** 22  
**Total Actions Available:** 140+
