# Supabase Database Schema - Plus1 Rewards

**Project:** plus1 (gcbmlxdxwakkubpldype)  
**Region:** eu-west-1  
**Status:** ACTIVE_HEALTHY  
**Database Version:** PostgreSQL 17.6.1.084

---

## Table of Contents
1. [Core User Tables](#core-user-tables)
2. [Partner & Agent Tables](#partner--agent-tables)
3. [Transaction & Financial Tables](#transaction--financial-tables)
4. [Cover Plan Tables](#cover-plan-tables)
5. [Provider & Export Tables](#provider--export-tables)
6. [Dispute & Audit Tables](#dispute--audit-tables)
7. [Connection Tables](#connection-tables)

---

## Core User Tables

### 1. **users**
Central authentication table for all roles: member, partner, agent, provider, admin

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Unique user identifier |
| role | text | NOT NULL, CHECK (role IN ['member','partner','agent','provider','admin']) | - | User role type |
| full_name | text | NOT NULL, CHECK (length >= 2 AND <= 100) | - | User full name |
| mobile_number | text | UNIQUE, CHECK (length >= 10 AND <= 15) | NULL | Phone number |
| pin_code | text | CHECK (length = 6) | NULL | 6-digit PIN for authentication |
| status | text | CHECK (status IN ['active','suspended','pending']) | 'active' | Account status |
| email | text | UNIQUE, CHECK (valid email format) | NULL | Email address |
| created_at | timestamptz | | now() | Account creation timestamp |

**Foreign Keys:** None (root table)

---

### 2. **members**
Member profiles with QR codes and status tracking

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Member ID |
| phone | text | CHECK (length >= 10 AND <= 15) | NULL | Phone number |
| qr_code | text | UNIQUE, NOT NULL | - | Unique QR code for member |
| email | text | UNIQUE | NULL | Email address |
| user_id | uuid | FOREIGN KEY → users.id | NULL | Link to user account |
| full_name | text | NOT NULL | - | Member full name |
| status | text | CHECK (status IN ['active','suspended','pending']) | 'active' | Member account status |
| sa_id | text | | NULL | South African ID number |
| city | text | | 'Cape Town' | City (defaults to Cape Town) |
| suburb | text | | NULL | Suburb within city |
| profile_picture_url | text | | NULL | URL to member profile picture |
| created_at | timestamptz | | now() | Account creation timestamp |
| updated_at | timestamptz | | now() | Last update timestamp |

**Foreign Keys:**
- disputes.member_id → members.id
- member_cover_plans.member_id → members.id
- admin_notifications.member_id → members.id
- member_partner_connections.member_id → members.id
- transactions.member_id → members.id
- cover_plan_wallet_entries.member_id → members.id

---

## Partner & Agent Tables

### 3. **partners**
Business partners offering cashback to members

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Partner ID |
| phone | text | UNIQUE, CHECK (length >= 10 AND <= 15) | - | Partner phone |
| email | text | UNIQUE, CHECK (valid email) | NULL | Partner email |
| shop_name | text | NOT NULL | - | Business name |
| status | text | CHECK (status IN ['active','suspended','pending','rejected']) | 'pending' | Partner status |
| user_id | uuid | FOREIGN KEY → users.id | NULL | Link to user account |
| approved_by | uuid | FOREIGN KEY → users.id | NULL | Admin who approved |
| approved_at | timestamptz | | NULL | Approval timestamp |
| cashback_percent | numeric | CHECK (>= 3 AND <= 40) | - | Cashback rate: 3-40% |
| responsible_person | text | | NULL | Contact person name |
| category | text | | NULL | Business category |
| address | text | | NULL | Business address |
| included_products | text | | NULL | Products included in cashback |
| excluded_products | text | | NULL | Products excluded from cashback |
| rejection_reason | text | | NULL | Reason if rejected |
| signature_url | text | | NULL | URL to signed agreement |
| created_at | timestamptz | | now() | Creation timestamp |
| updated_at | timestamptz | | now() | Last update timestamp |

**Comment:** Cashback split: 1% system, 1% agent, rest to member

**Foreign Keys:**
- partner_agent_links.partner_id → partners.id
- transactions.partner_id → partners.id
- member_partner_connections.partner_id → partners.id
- partner_invoices.partner_id → partners.id
- disputes.partner_id → partners.id

---

### 4. **agents**
Sales agents who recruit partners and earn commission

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Agent ID |
| user_id | uuid | FOREIGN KEY → users.id | NULL | Link to user account |
| status | text | CHECK (status IN ['pending','active','suspended','rejected']) | 'pending' | Agent status |
| approved_by | uuid | FOREIGN KEY → users.id | NULL | Admin who approved |
| approved_at | timestamptz | | NULL | Approval timestamp |
| rejection_reason | text | | NULL | Reason if rejected |
| id_number | text | | NULL | SA ID or passport number |
| agreement_file | text | | NULL | URL to signed agreement |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- transactions.agent_id → agents.id
- partner_agent_links.agent_id → agents.id
- agent_commissions.agent_id → agents.id

---

### 5. **partner_agent_links**
Links partners to their recruiting agents

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Link ID |
| partner_id | uuid | NOT NULL, FOREIGN KEY → partners.id | - | Partner reference |
| agent_id | uuid | NOT NULL, FOREIGN KEY → agents.id | - | Agent reference |
| status | text | CHECK (status IN ['active','inactive']) | 'active' | Link status |
| linked_at | timestamptz | | now() | When linked |

---

## Transaction & Financial Tables

### 6. **transactions**
Partner transactions with cashback split tracking (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Transaction ID |
| partner_id | uuid | FOREIGN KEY → partners.id | NULL | Partner reference |
| member_id | uuid | FOREIGN KEY → members.id | NULL | Member reference |
| agent_id | uuid | FOREIGN KEY → agents.id | NULL | Agent reference |
| purchase_amount | numeric | CHECK (> 0) | - | Purchase amount |
| status | text | CHECK (status IN ['completed','pending','reversed','disputed']) | 'pending_sync' | Transaction status |
| cashback_percent | numeric | | NULL | Total cashback % offered |
| system_percent | numeric | | 1 | Platform fee (always 1%) |
| agent_percent | numeric | | 1 | Agent commission (always 1%) |
| member_percent | numeric | | NULL | Member cashback (cashback_percent - 2) |
| system_amount | numeric | | NULL | System fee amount |
| agent_amount | numeric | | NULL | Agent commission amount |
| member_amount | numeric | | NULL | Member cashback amount |
| created_at | timestamptz | | now() | Transaction timestamp |

**Foreign Keys:**
- cover_plan_wallet_entries.transaction_id → transactions.id
- disputes.transaction_id → transactions.id

---

### 7. **agent_commissions**
Monthly commission breakdown for agents (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Commission ID |
| agent_id | uuid | NOT NULL, FOREIGN KEY → agents.id | - | Agent reference |
| month | text | NOT NULL | - | Month (YYYY-MM format) |
| total_amount | numeric | CHECK (>= 0) | - | Total commission amount |
| payout_status | text | CHECK (status IN ['pending','paid']) | 'pending' | Payout status |
| paid_at | timestamptz | | NULL | Payment timestamp |
| created_at | timestamptz | | now() | Creation timestamp |

---

### 8. **top_ups**
Member and partner top-up payments to close shortfalls (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Top-up ID |
| payer_type | text | CHECK (payer_type IN ['member','partner']) | - | Who is paying |
| payer_id | uuid | NOT NULL | - | Payer reference |
| member_cover_plan_id | uuid | FOREIGN KEY → member_cover_plans.id | NULL | Cover plan reference |
| amount | numeric | CHECK (> 0) | - | Top-up amount |
| payment_method | text | CHECK (method IN ['eft','card','cash','other']) | NULL | Payment method |
| reference_note | text | | NULL | Payment reference |
| approved_by | uuid | | NULL | Approver reference |
| created_at | timestamptz | | now() | Creation timestamp |

---

### 9. **partner_invoices**
Monthly invoices for partners (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Invoice ID |
| partner_id | uuid | NOT NULL, FOREIGN KEY → partners.id | - | Partner reference |
| invoice_month | text | NOT NULL | - | Invoice month (YYYY-MM) |
| total_amount | numeric | CHECK (>= 0) | - | Total invoice amount |
| due_date | date | NOT NULL | - | Payment due date |
| status | text | CHECK (status IN ['generated','sent','overdue','paid','suspended']) | 'generated' | Invoice status |
| paid_at | timestamptz | | NULL | Payment timestamp |
| suspended_at | timestamptz | | NULL | Suspension timestamp |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- invoice_items.invoice_id → partner_invoices.id

---

### 10. **invoice_items**
Line items for partner invoices (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Item ID |
| invoice_id | uuid | NOT NULL, FOREIGN KEY → partner_invoices.id | - | Invoice reference |
| transaction_id | uuid | FOREIGN KEY → transactions.id | NULL | Transaction reference |
| amount | numeric | NOT NULL | - | Line item amount |
| description | text | | NULL | Item description |

---

## Cover Plan Tables

### 11. **cover_plans**
Insurance/health cover plans offered by providers (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Plan ID |
| provider_id | uuid | FOREIGN KEY → providers.id | NULL | Provider reference |
| plan_name | text | UNIQUE, NOT NULL | - | Plan name |
| monthly_target_amount | numeric | CHECK (> 0) | - | Monthly funding target |
| plan_level | integer | | NULL | Plan tier/level |
| status | text | CHECK (status IN ['active','inactive']) | 'active' | Plan status |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- member_cover_plans.cover_plan_id → cover_plans.id

---

### 12. **member_cover_plans**
Core table tracking each cover plan linked to a member with creation order (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Member plan ID |
| member_id | uuid | NOT NULL, FOREIGN KEY → members.id | - | Member reference |
| cover_plan_id | uuid | NOT NULL, FOREIGN KEY → cover_plans.id | - | Plan reference |
| creation_order | integer | NOT NULL | - | Funding priority: 1 fills first, then 2, then 3 |
| target_amount | numeric | CHECK (> 0) | - | Target funding amount |
| funded_amount | numeric | CHECK (>= 0) | 0 | Amount funded so far |
| status | text | CHECK (status IN ['in_progress','active','suspended','cancelled']) | 'in_progress' | Plan status |
| active_from | timestamptz | | NULL | When plan became active (reached target) |
| active_to | timestamptz | | NULL | When 30-day active period ends |
| suspended_at | timestamptz | | NULL | Suspension timestamp |
| overflow_balance | numeric | CHECK (>= 0) | 0 | Cashback remaining after plan deduction |
| created_at | timestamptz | | now() | Creation timestamp |
| updated_at | timestamptz | | now() | Last update timestamp |

**Comment:** Overflow balance used for upgrades, dependants, sponsorships

**Foreign Keys:**
- provider_export_items.member_cover_plan_id → member_cover_plans.id
- linked_people.member_cover_plan_id → member_cover_plans.id
- cover_plan_wallet_entries.member_cover_plan_id → member_cover_plans.id
- top_ups.member_cover_plan_id → member_cover_plans.id

---

### 13. **cover_plan_wallet_entries**
Detailed audit trail of every funding movement into cover plans (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Entry ID |
| member_id | uuid | NOT NULL, FOREIGN KEY → members.id | - | Member reference |
| member_cover_plan_id | uuid | FOREIGN KEY → member_cover_plans.id | NULL | Plan reference |
| transaction_id | uuid | FOREIGN KEY → transactions.id | NULL | Transaction reference |
| entry_type | text | CHECK (type IN ['cashback_added','overflow_moved','manual_adjustment','reversal','top_up','carry_over']) | - | Type of entry |
| amount | numeric | NOT NULL | - | Entry amount |
| balance_after | numeric | CHECK (>= 0) | - | Balance after entry |
| created_at | timestamptz | | now() | Entry timestamp |

---

### 14. **linked_people**
Dependants and linked persons for member cover plans

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Linked person ID |
| member_cover_plan_id | uuid | NOT NULL, FOREIGN KEY → member_cover_plans.id | - | Plan reference |
| linked_type | text | CHECK (type IN ['dependant','spouse','child','other']) | - | Relationship type |
| full_name | text | NOT NULL | - | Person's full name |
| id_number | text | NOT NULL | - | ID number |
| linked_to_main_member_id | uuid | NOT NULL | - | Main member reference |
| status | text | CHECK (status IN ['pending','approved','rejected']) | 'pending' | Approval status |
| created_at | timestamptz | | now() | Creation timestamp |

---

## Provider & Export Tables

### 15. **providers**
Insurance/health providers (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Provider ID |
| user_id | uuid | FOREIGN KEY → users.id | NULL | User account reference |
| provider_name | text | UNIQUE, NOT NULL | - | Provider name |
| status | text | CHECK (status IN ['pending','active','suspended']) | 'pending' | Provider status |
| approved_by | uuid | | NULL | Approver reference |
| approved_at | timestamptz | | NULL | Approval timestamp |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- provider_exports.provider_id → providers.id
- cover_plans.provider_id → providers.id

---

### 16. **provider_exports**
Provider export batch records (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Export ID |
| provider_id | uuid | NOT NULL, FOREIGN KEY → providers.id | - | Provider reference |
| export_month | text | NOT NULL | - | Export month (YYYY-MM) |
| total_cover_plans | integer | | 0 | Number of plans exported |
| total_value | numeric | | 0 | Total value exported |
| status | text | CHECK (status IN ['pending','completed','failed']) | 'pending' | Export status |
| exported_at | timestamptz | | NULL | Export completion timestamp |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- provider_export_items.provider_export_id → provider_exports.id

---

### 17. **provider_export_items**
Individual cover plan records in provider exports (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Item ID |
| provider_export_id | uuid | NOT NULL, FOREIGN KEY → provider_exports.id | - | Export reference |
| member_cover_plan_id | uuid | NOT NULL, FOREIGN KEY → member_cover_plans.id | - | Plan reference |
| export_status | text | CHECK (status IN ['pending','exported','failed']) | 'pending' | Item export status |
| note | text | | NULL | Export notes |

---

## Dispute & Audit Tables

### 18. **disputes**
Transaction disputes and complaints (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Dispute ID |
| transaction_id | uuid | FOREIGN KEY → transactions.id | NULL | Transaction reference |
| member_id | uuid | FOREIGN KEY → members.id | NULL | Member reference |
| partner_id | uuid | FOREIGN KEY → partners.id | NULL | Partner reference |
| dispute_type | text | CHECK (type IN ['missing_cashback','wrong_amount','unauthorized','other']) | - | Dispute type |
| description | text | NOT NULL | - | Dispute description |
| status | text | CHECK (status IN ['open','investigating','resolved','rejected']) | 'open' | Dispute status |
| resolution_note | text | | NULL | Resolution details |
| resolved_by | uuid | | NULL | Resolver reference |
| resolved_at | timestamptz | | NULL | Resolution timestamp |
| created_at | timestamptz | | now() | Creation timestamp |

---

### 19. **audit_logs**
System-wide audit trail of important actions (RLS Enabled)

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Log ID |
| user_id | uuid | FOREIGN KEY → users.id | NULL | User who performed action |
| action_type | text | NOT NULL | - | Type of action |
| table_name | text | NOT NULL | - | Table affected |
| record_id | uuid | | NULL | Record ID affected |
| old_value | jsonb | | NULL | Previous value |
| new_value | jsonb | | NULL | New value |
| created_at | timestamptz | | now() | Action timestamp |

---

## Connection Tables

### 20. **member_partner_connections**
Tracks which members are connected to which partners

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Connection ID |
| member_id | uuid | NOT NULL, FOREIGN KEY → members.id | - | Member reference |
| partner_id | uuid | NOT NULL, FOREIGN KEY → partners.id | - | Partner reference |
| status | text | CHECK (status IN ['active','inactive']) | 'active' | Connection status |
| connected_at | timestamptz | | now() | Connection timestamp |

**Comment:** active: can make purchases | inactive: connection disabled

---

### 21. **admin_notifications**
Stores notifications for admin dashboard about member actions requiring attention

| Column | Type | Constraints | Default | Comment |
|--------|------|-----------|---------|---------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Notification ID |
| type | text | NOT NULL | - | Notification type |
| member_id | uuid | FOREIGN KEY → members.id | NULL | Member reference |
| member_name | text | | NULL | Member name (denormalized) |
| member_phone | text | | NULL | Member phone (denormalized) |
| message | text | NOT NULL | - | Notification message |
| priority | text | CHECK (priority IN ['low','medium','high']) | 'medium' | Priority level |
| read | boolean | | false | Read status |
| metadata | jsonb | | NULL | Additional metadata |
| created_at | timestamptz | | now() | Creation timestamp |

---

## Summary Statistics

- **Total Tables:** 21
- **Tables with RLS Enabled:** 11
- **Total Columns:** 200+
- **Primary Keys:** All tables have UUID primary keys
- **Foreign Key Relationships:** 30+

## Key Design Patterns

1. **Cashback Split:** System (1%) + Agent (1%) + Member (remainder)
2. **Delivery Fee Split:** Driver (93%) + System (5%) + Agent (2%)
3. **Cover Plan Funding:** Sequential funding by creation_order with overflow balance tracking
4. **Audit Trail:** Comprehensive logging via audit_logs and wallet_entries
5. **Status Tracking:** Consistent status enums across entities (pending, active, suspended, etc.)
6. **Timestamps:** All tables include created_at and most include updated_at for audit purposes

