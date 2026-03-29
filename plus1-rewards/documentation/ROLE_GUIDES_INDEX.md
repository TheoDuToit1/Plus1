# Plus1 Rewards & Plus1-Go - Complete Role Guides Index

**Project:** Plus1 Rewards + Plus1-Go  
**Documentation Type:** Complete Feature & Activity Guides  
**Last Updated:** 2026-03-29

---

## Overview

This documentation provides comprehensive feature and activity guides for all roles in the Plus1 Rewards and Plus1-Go ecosystem. Each guide details every capability, action, and workflow available to that role.

---

## Role Guides

### 1. [MEMBER.md](./MEMBER.md) - Member/Customer Guide
**Role:** Member (Customer)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Shop at partner stores, earn cashback, fund medical cover plans, order deliveries

**Feature Categories:** 22  
**Total Actions:** 200+

**Key Sections:**
- Registration & onboarding
- Dashboard (Rewards & Plus1-Go)
- In-store shopping & transactions
- Cover plan management
- Multiple cover plans & dependants
- Top-up system
- Plus1-Go ordering & delivery
- Order tracking & history
- Ratings & reviews
- Profile & payment management

---

### 2. [PARTNER.md](./PARTNER.md) - Partner/Shop Owner Guide
**Role:** Partner (Shop/Business Owner)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Offer cashback to members, process transactions, manage products, fulfill orders

**Feature Categories:** 20  
**Total Actions:** 150+

**Key Sections:**
- Registration & approval process
- Dashboard overview
- Transaction processing (in-store)
- Billing & invoices
- Payment & suspension management
- Plus1-Go product management
- Plus1-Go order management
- Store settings & operating hours
- Ratings & reviews
- Reports & analytics

---

### 3. [AGENT.md](./AGENT.md) - Agent/Sales Representative Guide
**Role:** Agent (Sales Representative)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Recruit partners, support partner operations, earn commission

**Feature Categories:** 20  
**Total Actions:** 120+

**Key Sections:**
- Registration & approval process
- Dashboard overview
- Partner recruitment
- Linked partners management
- Partner support activities
- Commission tracking & breakdown
- Payout management
- Partner transaction monitoring
- Partner invoice visibility
- Performance tracking & reports

---

### 4. [DRIVER.md](./DRIVER.md) - Driver/Delivery Driver Guide
**Role:** Driver (Delivery Driver)  
**Platform:** Plus1-Go  
**Purpose:** Fulfill delivery orders, earn delivery fees

**Feature Categories:** 22  
**Total Actions:** 140+

**Key Sections:**
- Registration & verification process
- Dashboard overview
- Status management (Online/Offline/Busy)
- Delivery requests & acceptance
- Active delivery flow
- GPS & location tracking
- Earnings tracking & breakdown
- Payout management
- Delivery history
- Ratings & reviews
- Performance metrics
- Safety features

---

### 5. [INSURER.md](./INSURER.md) - Insurer/Medical Cover Provider Guide
**Role:** Insurer (Medical Cover Provider)  
**Platform:** Plus1 Rewards  
**Purpose:** View approved cover plans, receive member data, manage exports

**Feature Categories:** 20  
**Total Actions:** 100+

**Key Sections:**
- Registration & approval process
- Dashboard overview
- Cover plans management
- Member cover plans (active & suspended)
- Member information & dependants
- Export management & history
- Cover plan approvals
- Reports & analytics
- Compliance & privacy
- Telephonic approval workflow

---

### 6. [ADMIN.md](./ADMIN.md) - Admin/System Administrator Guide
**Role:** Admin (System Administrator)  
**Platforms:** Plus1 Rewards + Plus1-Go  
**Purpose:** Manage entire system, approve users, handle billing, resolve disputes, control operations

**Feature Categories:** 22  
**Total Actions:** 300+

**Key Sections:**
- Dashboard overview with real-time statistics
- Approvals (partners, agents, drivers, insurers, cover plans)
- Member management
- Cover plan monitoring
- Partner management & billing
- Agent management & commission
- Driver management & earnings
- Insurer management & exports
- Transaction management
- Dispute resolution
- Top-up processing
- Plus1-Go order & product management
- Comprehensive reports & analytics
- System settings & configuration
- User management & permissions
- Audit & compliance
- Notifications & communication
- Support & help desk
- System monitoring

---

## Document Structure

Each role guide follows a consistent structure:

1. **Registration & Onboarding** - How to join the platform
2. **Login & Authentication** - Access and security
3. **Dashboard Overview** - Main interface and key information
4. **Core Features** - Primary activities and workflows
5. **Management Tools** - Data management and organization
6. **Financial Features** - Payments, earnings, invoices (where applicable)
7. **Reports & Analytics** - Performance tracking and insights
8. **Notifications** - Alerts and communication
9. **Support & Help** - Assistance and troubleshooting
10. **Account Settings** - Profile and security management
11. **Summary** - Quick reference of all capabilities

---

## Cross-Role Relationships

### Member ↔ Partner
- Members shop at partners (in-store or Plus1-Go)
- Partners process member transactions
- Members earn cashback from partners
- Members rate and review partners

### Partner ↔ Agent
- Agents recruit partners
- Agents support partners
- Agents earn 1% commission from partner transactions
- Partners can contact agents for support

### Member ↔ Driver
- Members place Plus1-Go orders
- Drivers deliver orders to members
- Members track driver location
- Members rate and review drivers

### Partner ↔ Driver
- Drivers pick up orders from partners
- Partners prepare orders for drivers
- Partners can contact drivers

### Member ↔ Insurer
- Members' cover plans are managed by insurers
- Insurers view member cover plan data
- Insurers receive member exports
- Insurers approve cover plan changes

### Admin ↔ All Roles
- Admin approves all role registrations
- Admin manages all user accounts
- Admin resolves disputes
- Admin processes payments and payouts
- Admin configures system settings
- Admin sends notifications to all roles

---

## Key System Concepts

### Authentication
- NO central users table
- Each role has its own table with authentication
- Login: mobile_number + 6-digit PIN
- Admin stored in members table with role='admin'

### Cashback Model (Plus1 Rewards)
- Partner sets cashback percentage (3-40%)
- Split: 1% system, 1% agent, rest to member
- Member cashback funds cover plans
- Partners pay monthly invoice for cashback issued

### Delivery Fee Model (Plus1-Go)
- Delivery fee split: 93% driver, 5% system, 2% agent
- Separate from cashback on purchase amount
- Driver earnings tracked in driver_earnings table

### Cover Plan Funding
- Members earn cashback from shopping
- Cashback funds cover plans in creation_order
- Plans become Active when target reached
- 30-day active cycle
- Plans become Suspended if insufficient funds
- Members can top-up to reach target

### Approval Workflows
- Partners, agents, drivers, insurers require admin approval
- Cover plan changes require telephonic approval
- Dependant additions require telephonic approval
- Admin reviews and approves/rejects applications

---

## Database Structure

**Role Tables (5):**
- members (includes admin with role='admin')
- partners
- agents
- insurers
- drivers

**Core Tables:**
- cover_plans
- member_cover_plans
- transactions
- cover_plan_wallet_entries
- partner_invoices
- agent_commissions

**Plus1-Go Tables:**
- orders
- order_items
- products
- driver_earnings
- delivery_tracking

**Support Tables:**
- disputes
- top_ups
- audit_logs
- reviews
- admin_notifications

**Total Tables:** 29

---

## Usage Guidelines

### For Developers
- Use these guides to understand complete feature requirements
- Reference when building UI/UX for each role
- Understand data relationships and workflows
- Implement features according to documented capabilities

### For Project Managers
- Use as feature checklists
- Track implementation progress
- Understand scope of each role
- Plan development sprints

### For Designers
- Understand user journeys for each role
- Design interfaces based on documented features
- Create wireframes and mockups
- Ensure all actions are accessible

### For Testers
- Use as test case references
- Verify all documented features work
- Test workflows end-to-end
- Validate role permissions

### For Business Stakeholders
- Understand system capabilities
- Review feature completeness
- Identify gaps or enhancements
- Plan training materials

---

## Related Documentation

- [aa plus1-descritpion.md](./aa%20plus1-descritpion.md) - Main project description and business logic
- [SUPABASE_DATABASE_SCHEMA.md](./SUPABASE_DATABASE_SCHEMA.md) - Complete database schema
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Technical integration guide
- [MEMBER_PARTNER_TESTING_GUIDE.md](./MEMBER_PARTNER_TESTING_GUIDE.md) - Testing workflows

---

## Statistics Summary

| Role | Feature Categories | Total Actions | Complexity |
|------|-------------------|---------------|------------|
| Member | 22 | 200+ | High |
| Partner | 20 | 150+ | High |
| Agent | 20 | 120+ | Medium |
| Driver | 22 | 140+ | Medium |
| Insurer | 20 | 100+ | Medium |
| Admin | 22 | 300+ | Very High |
| **TOTAL** | **126** | **1,010+** | - |

---

## Version History

**v1.0 - 2026-03-29**
- Initial creation of all role guides
- Complete feature documentation
- Cross-role relationship mapping
- Database structure alignment

---

## Contact & Support

For questions about this documentation:
- Review the main project description: `aa plus1-descritpion.md`
- Check the database schema: `SUPABASE_DATABASE_SCHEMA.md`
- Contact the development team
- Refer to the admin guide for system-wide questions

---

**End of Index**
