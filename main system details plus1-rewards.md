Plus1 Rewards – Master Functional System Document

Purpose:
This document defines how the Plus1 Rewards system works from a functional, user flow, and page perspective.
It is designed to be used as a base knowledge document for ChatGPT or developers to build, extend, and reason about the system.

1. SYSTEM OVERVIEW
1.1 What Plus1 Rewards Is

Plus1 Rewards is a cashback-to-medical-cover platform.

Members shop at partner stores
Partners give cashback (real money, not points)
Cashback funds a member’s cover plan
Once fully funded → cover becomes Active
If not maintained → cover becomes Suspended
1.2 Core Concept

Shopping → Cashback → Cover Plan Funding → Active Medical Cover

1.3 The 5 Roles

Each role has its own dashboard and permissions:

Member – earns cashback toward cover
Partner – issues cashback through transactions
Agent – recruits and supports partners
Provider – receives approved cover plan data
Admin – controls the entire system
2. CORE SYSTEM RULES
2.1 Cashback Rule
Partner sets cashback: 3% – 40%
Split is ALWAYS:
1% → System
1% → Agent
Remaining → Member cover plan
2.2 Cover Plan Activation
A cover plan becomes Active when:
Funded amount ≥ target amount
2.3 30-Day Cycle Rule
Once Active → valid for 30 days
After 30 days:
If fully funded again → stays Active
If not → becomes Suspended
2.4 Funding Order Rule

If a member has multiple cover plans:

Plans are funded in creation order
Oldest fills first
Then next
Then next
2.5 Overflow Rule
Extra cashback beyond target:
Stored as overflow
Used for:
Next cycle
Other plans
Dependants
2.6 Top-Up Rule
Members can manually fund shortfalls:
Full or partial
Done via:
“Do Instant EFT” → opens Admin chat
Requires Admin approval
2.7 Partner Suspension Rule

If partner is suspended:

No transactions allowed

Show error:

“Transaction error, please contact administrator”

2.8 Approval Rule (Critical)

These actions require telephonic approval:

New cover plans
Plan changes
Linked people / dependants
2.9 Authentication Rule
Login = Mobile Number + 6-digit PIN
No OTP
3. MEMBER SYSTEM
3.1 Member Flow Summary
Register
Receive QR code
Get default cover plan
Shop at partners
Earn cashback
Fund cover plan
Cover becomes Active
3.2 Member Pages
1. Registration
Fields:
Name, Mobile, PIN
Actions:
Create account
Generate QR
Assign default cover plan (Suspended)
2. Login
Mobile + PIN
3. Dashboard Home

Shows:

Member info
QR code
Current cover plan
Progress toward funding
Status (Active/Suspended)
Overflow balance
Recent transactions

Key Actions:

Show QR
View plans
Top-up
Contact Admin
4. My Cover Plans

Displays all plans:

Target vs funded
Status
Progress

Actions:

View details
Request change
Top-up
5. Cover Plan Details

Shows:

Full funding history
Status cycle dates
Linked people
6. Transactions
List + detail view
Shows cashback split
7. Linked People / Dependants
Add dependant request
Requires Admin approval
8. Top-Up Page
Shows shortfall
Upload proof
Chat with Admin
9. QR Code Page
Used for transactions
10. Profile
Update info
Change PIN
11. Admin Chat

Used for:

Top-ups
Support
Requests
4. PARTNER SYSTEM
4.1 Partner Flow
Register business
Get approved
Process transactions
Issue cashback
Receive monthly invoice
Pay system
4.2 Partner Pages
1. Registration
Business details
Cashback %
Products included/excluded
2. Dashboard

Shows:

Transactions
Cashback totals
Invoice status
Agent assigned
3. Process Transaction

Input:

Member (QR/mobile)
Purchase amount

System:

Calculates cashback
Splits automatically
Allocates to cover plan
4. Transactions List
View all transactions
5. Billing / Invoices
Monthly invoice
Payment status
Upload proof
6. Shop Profile
Business details
Cashback % (Admin-controlled)
7. Admin Chat
Payment support
Issues
5. AGENT SYSTEM
5.1 Agent Role
Brings partners into system
Supports them
Earns 1% commission
5.2 Agent Pages
Dashboard
Linked shops
Commission
Alerts
My Partner Shops
Shop list
Status
Invoice alerts
Shop Detail
Shop performance
Notes
Commission Page
Monthly earnings
Payout status
Support Tools
Help shops
Resend login details
6. PROVIDER SYSTEM
6.1 Role
Medical provider
Receives approved cover data
6.2 Provider Pages
Dashboard
Active plans
Suspended plans
Active Cover Plans
Member + plan info
Suspended Plans
View inactive plans
Exports
Download plan data
Member View
Member + dependants
7. ADMIN SYSTEM
7.1 Role

Full system control:

Approvals
Billing
Transactions
Disputes
Exports
7.2 Admin Core Sections
Dashboard
System-wide stats
Approvals

Handles:

Partners
Agents
Providers
Cover plans
Linked people
Members
View profiles
Cover plans
Wallet activity
Cover Plans
Funding status
Activation control
Partners
Approve / suspend
Manage cashback
Invoices
Generate
Mark paid
Suspend if unpaid
Agents
Monitor performance
Manage payouts
Providers
Control access
Manage exports
Transactions
View all
Reverse if needed
Disputes
Resolve issues
Adjust records
Top-Ups
Approve payments
Allocate funds
Exports
Send data to provider
Audit Logs
Track all actions
8. CORE SYSTEM LOGIC
8.1 Transaction Flow

When partner submits:

Check partner status
Identify member
Calculate cashback split
Save transaction
Allocate to cover plan
Update invoice
8.2 Cover Plan Funding Logic
Always fund oldest plan first
Continue sequentially
Excess → overflow
8.3 30-Day Renewal Logic

Daily system check:

If funded → renew
If not → suspend
8.4 Top-Up Logic
Admin approves
Funds added
Plan may activate
8.5 Invoice Logic

Monthly:

Sum partner transactions
Generate invoice
Track payment
Suspend if unpaid
8.6 Audit Logic

Track:

Approvals
Changes
Payments
Reversals
9. ACCESS CONTROL SUMMARY
Role	Access
Member	Own data only
Partner	Own shop + transactions
Agent	Linked shops
Provider	Cover plan data
Admin	Full system
10. KEY SYSTEM PRINCIPLES
Real money cashback (not points)
Medical cover driven by activity
Simple status: Active / Suspended
Strict funding order
Admin-controlled approvals
Partner-funded ecosystem
11. FINAL SYSTEM SUMMARY

Plus1 Rewards is a closed-loop ecosystem where:

Members earn cashback through real-world spending
Cashback funds medical cover
Partners finance the system via invoices
Agents grow and support the network
Providers receive structured cover data
Admin ensures control, accuracy, and compliance