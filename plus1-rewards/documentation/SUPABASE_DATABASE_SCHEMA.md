# Supabase Database Schema - Plus1 Rewards & Plus1 Go

**Project:** plus1 (gcbmlxdxwakkubpldype)  
**Region:** eu-west-1  
**Status:** ACTIVE_HEALTHY  
**Database Version:** PostgreSQL 17.6.1.084  
**Last Updated:** 2026-03-29

---

## 🎯 Core Concept

**NO CENTRAL USERS TABLE** - Each role has its own table with authentication built-in.

---

## 📋 Role Tables (6 Total)

### 1. **members** - Customers who shop and earn cashback
### 2. **partners** - Shops offering cashback (Rewards + Go)
### 3. **agents** - Sales people who recruit partners
### 4. **insurers** - Medical policy providers (renamed from providers)
### 5. **drivers** - Delivery drivers for Plus1-Go
### 6. **admin** - System administrators (stored in members table with role='admin')

---

## Table Structures

### 1. members (Customers)

**Purpose:** Customer profiles with authentication, QR codes, and delivery info

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Member ID |
| role | text | CHECK (role IN ('member','admin')) | 'member' | User role |
| full_name | text | NOT NULL | - | Member full name |
| mobile_number | text | UNIQUE | - | Phone for authentication |
| pin_code | text | CHECK (length = 6) | - | 6-digit PIN |
| pin_hash | text | | NULL | Hashed PIN |
| email | text | UNIQUE | NULL | Email address |
| phone | text | CHECK (length >= 10 AND <= 15) | NULL | Contact phone |
| qr_code | text | UNIQUE, NOT NULL | - | Unique QR code |
| status | text | CHECK (status IN ('active','suspended','pending')) | 'active' | Account status |
| sa_id | text | | NULL | South African ID |
| id_number | text | | NULL | ID number |
| date_of_birth | date | | NULL | Birth date |
| city | text | | 'Cape Town' | City |
| suburb | text | | NULL | Suburb |
| default_address | text | | NULL | Default delivery address |
| latitude | numeric | | NULL | GPS latitude |
| longitude | numeric | | NULL | GPS longitude |
| saved_addresses | jsonb | | '[]' | Array of saved addresses |
| profile_picture_url | text | | NULL | Profile picture URL |
| payment_token | text | | NULL | Payment token |
| payment_method_type | text | | NULL | Payment method |
| payment_last_4 | text | | NULL | Last 4 digits |
| payment_authorized | boolean | | false | Payment authorized |
| payment_authorized_at | timestamp | | NULL | Authorization time |
| bank_name | text | | NULL | Bank name |
| bank_account_number | text | | NULL | Account number |
| bank_account_holder | text | | NULL | Account holder |
| bank_branch_code | text | | NULL | Branch code |
| profile_completed | boolean | | false | Profile complete |
| total_orders | integer | | 0 | Total orders placed |
| total_spent | integer | | 0 | Total amount spent |
| last_order_at | timestamp | | NULL | Last order time |
| failed_payments | integer | | 0 | Failed payment count |
| account_suspended | boolean | | false | Account suspended |
| kyc_status | text | | 'pending' | KYC verification status |
| device_token | text | | NULL | Push notification token |
| created_at | timestamptz | | now() | Creation timestamp |
| updated_at | timestamptz | | now() | Update timestamp |

**Foreign Keys:**
- member_cover_plans.member_id → members.id
- transactions.member_id → members.id
- orders.member_id → members.id
- admin_notifications.member_id → members.id

---

### 2. partners (Shops)

**Purpose:** Business partners offering cashback on Rewards and Go platforms

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Partner ID |
| role | text | CHECK (role = 'partner') | 'partner' | User role |
| full_name | text | | NULL | Contact person name |
| shop_name | text | NOT NULL | - | Business name |
| mobile_number | text | UNIQUE | - | Phone for authentication |
| pin_code | text | CHECK (length = 6) | - | 6-digit PIN |
| pin_hash | text | | NULL | Hashed PIN |
| phone | text | UNIQUE, CHECK (length >= 10 AND <= 15) | - | Contact phone |
| email | text | UNIQUE | NULL | Email address |
| status | text | CHECK (status IN ('active','suspended','pending','rejected')) | 'pending' | Partner status |
| approved_by | uuid | | NULL | Admin who approved |
| approved_at | timestamptz | | NULL | Approval timestamp |
| cashback_percent | numeric | CHECK (>= 3 AND <= 40) | - | Cashback rate 3-40% |
| responsible_person | text | | NULL | Contact person |
| category | text | | NULL | Business category |
| address | text | | NULL | Business address |
| included_products | text | | NULL | Products in cashback |
| excluded_products | text | | NULL | Products excluded |
| rejection_reason | text | | NULL | Rejection reason |
| signature_url | text | | NULL | Signed agreement URL |
| store_description | text | | NULL | Store description |
| store_logo_url | text | | NULL | Logo URL |
| store_banner_url | text | | NULL | Banner URL |
| latitude | numeric | | NULL | GPS latitude |
| longitude | numeric | | NULL | GPS longitude |
| is_open | boolean | | true | Currently open |
| opening_hours | jsonb | | NULL | Opening hours JSON |
| delivery_enabled | boolean | | true | Delivery available |
| pickup_enabled | boolean | | true | Pickup available |
| minimum_order_value | integer | | 0 | Minimum order |
| delivery_radius_km | numeric | | 5 | Delivery radius |
| rating | numeric | | 0 | Average rating |
| total_reviews | integer | | 0 | Total reviews |
| average_prep_time_minutes | integer | | 30 | Avg prep time |
| kyc_status | text | | 'pending' | KYC status |
| device_token | text | | NULL | Push token |
| created_at | timestamptz | | now() | Creation timestamp |
| updated_at | timestamptz | | now() | Update timestamp |

**Comment:** Cashback split: 1% system, 1% agent, rest to member

**Foreign Keys:**
- transactions.partner_id → partners.id
- orders.partner_id → partners.id
- products.partner_id → partners.id

---

### 3. agents (Sales Agents)

**Purpose:** Sales agents who recruit partners and earn commission

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Agent ID |
| role | text | CHECK (role = 'agent') | 'agent' | User role |
| full_name | text | | NULL | Agent full name |
| mobile_number | text | UNIQUE | - | Phone for authentication |
| pin_code | text | CHECK (length = 6) | - | 6-digit PIN |
| pin_hash | text | | NULL | Hashed PIN |
| phone | text | | NULL | Contact phone |
| email | text | | NULL | Email address |
| status | text | CHECK (status IN ('pending','active','suspended','rejected')) | 'pending' | Agent status |
| approved_by | uuid | | NULL | Admin who approved |
| approved_at | timestamptz | | NULL | Approval timestamp |
| rejection_reason | text | | NULL | Rejection reason |
| id_number | text | | NULL | SA ID or passport |
| agreement_file | text | | NULL | Signed agreement URL |
| kyc_status | text | | 'pending' | KYC status |
| device_token | text | | NULL | Push token |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- transactions.agent_id → agents.id
- partner_agent_links.agent_id → agents.id
- agent_commissions.agent_id → agents.id

---

### 4. insurers (Medical Policy Providers)

**Purpose:** Insurance/health cover providers (renamed from providers)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Insurer ID |
| role | text | CHECK (role = 'insurer') | 'insurer' | User role |
| full_name | text | | NULL | Contact person |
| mobile_number | text | UNIQUE | - | Phone for authentication |
| pin_code | text | CHECK (length = 6) | - | 6-digit PIN |
| pin_hash | text | | NULL | Hashed PIN |
| phone | text | | NULL | Contact phone |
| email | text | | NULL | Email address |
| provider_name | text | UNIQUE, NOT NULL | - | Insurer name |
| status | text | CHECK (status IN ('pending','active','suspended')) | 'pending' | Insurer status |
| approved_by | uuid | | NULL | Admin who approved |
| approved_at | timestamptz | | NULL | Approval timestamp |
| kyc_status | text | | 'pending' | KYC status |
| device_token | text | | NULL | Push token |
| created_at | timestamptz | | now() | Creation timestamp |

**Foreign Keys:**
- cover_plans.insurer_id → insurers.id
- insurer_exports.insurer_id → insurers.id

---

### 5. drivers (Delivery Drivers)

**Purpose:** Delivery drivers for Plus1-Go orders

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Driver ID |
| role | text | CHECK (role = 'driver') | 'driver' | User role |
| full_name | text | | NULL | Driver full name |
| mobile_number | text | UNIQUE | - | Phone for authentication |
| pin_code | text | CHECK (length = 6) | - | 6-digit PIN |
| pin_hash | text | | NULL | Hashed PIN |
| phone | text | | NULL | Contact phone |
| email | text | | NULL | Email address |
| status | text | CHECK (status IN ('offline','online','busy')) | 'offline' | Driver status |
| vehicle_type | text | | NULL | Vehicle type |
| vehicle_make | text | | NULL | Vehicle make |
| vehicle_color | text | | NULL | Vehicle color |
| vehicle_registration | text | | NULL | Registration number |
| license_number | text | | NULL | Driver license |
| license_photo_url | text | | NULL | License photo URL |
| current_latitude | numeric | | NULL | Current GPS lat |
| current_longitude | numeric | | NULL | Current GPS long |
| last_location_update | timestamp | | NULL | Last location update |
| is_verified | boolean | | false | Driver verified |
| total_deliveries | integer | | 0 | Total deliveries |
| average_rating | numeric | | 0 | Average rating |
| kyc_status | text | | 'pending' | KYC status |
| device_token | text | | NULL | Push token |
| created_at | timestamp | | now() | Creation timestamp |

**Foreign Keys:**
- orders.driver_id → drivers.id
- driver_earnings.driver_id → drivers.id
- delivery_tracking.driver_id → drivers.id

---

## Transaction & Financial Tables

### 6. transactions

**Purpose:** Partner transactions with cashback split tracking

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PRIMARY KEY | uuid_generate_v4() | Transaction ID |
| partner_id | uuid | FK → partners.id | NULL | Partner reference |
| member_id | uuid | FK → members.id | NULL | Member reference |
| agent_id | uuid | FK → agents.id | NULL | Agent reference |
| driver_id | uuid | FK → drivers.id | NULL | Driver reference |
| order_id | uuid | FK → orders.id | NULL | Order reference |
| purchase_amount | numeric | CHECK (> 0) | - | Purchase amount |
| status | text | CHECK (status IN ('completed','pending','reversed','disputed')) | 'pending_sync' | Transaction status |
| transaction_type | text | | 'in_store' | Type: in_store/delivery |
| cashback_percent | numeric | | NULL | Total cashback % |
| system_percent | numeric | | 1 | Platform fee (1%) |
| agent_percent | numeric | | 1 | Agent commission (1%) |
| member_percent | numeric | | NULL | Member cashback |
| system_amount | numeric | | NULL | System fee amount |
| agent_amount | numeric | | NULL | Agent commission |
| member_amount | numeric | | NULL | Member cashback |
| delivery_fee | integer | | NULL | Delivery fee |
| created_at | timestamptz | | now() | Transaction time |

**RLS Enabled:** Yes

---

## Cover Plan Tables

### 7. cover_plans

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Plan ID |
| insurer_id | uuid | FK → insurers.id |
| plan_name | text | Plan name (unique) |
| monthly_target_amount | numeric | Monthly funding target |
| plan_level | integer | Plan tier |
| status | text | active/inactive |
| created_at | timestamptz | Creation time |

### 8. member_cover_plans

**Purpose:** Tracks each cover plan linked to a member with creation order

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Member plan ID |
| member_id | uuid | FK → members.id |
| cover_plan_id | uuid | FK → cover_plans.id |
| creation_order | integer | Funding priority (1 fills first) |
| target_amount | numeric | Target funding amount |
| funded_amount | numeric | Amount funded so far |
| overflow_balance | numeric | Cashback after plan deduction |
| status | text | in_progress/active/suspended/cancelled |
| active_from | timestamptz | When plan became active |
| active_to | timestamptz | When 30-day period ends |
| suspended_at | timestamptz | Suspension time |
| created_at | timestamptz | Creation time |

### 9. cover_plan_wallet_entries

**Purpose:** Detailed audit trail of every funding movement

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Entry ID |
| member_id | uuid | FK → members.id |
| member_cover_plan_id | uuid | FK → member_cover_plans.id |
| transaction_id | uuid | FK → transactions.id |
| entry_type | text | cashback_added/overflow_moved/manual_adjustment/reversal/top_up/carry_over |
| amount | numeric | Entry amount |
| balance_after | numeric | Balance after entry |
| created_at | timestamptz | Entry time |

---

## Plus1-Go Tables

### 10. orders

**Purpose:** Plus1-Go delivery orders

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Order ID |
| order_number | text | Unique order number |
| member_id | uuid | FK → members.id |
| partner_id | uuid | FK → partners.id |
| driver_id | uuid | FK → drivers.id |
| status | text | pending/confirmed/preparing/ready/driver_assigned/picked_up/on_the_way/delivered/cancelled |
| subtotal | integer | Subtotal (cents) |
| delivery_fee | integer | Delivery fee (cents) |
| total_amount | integer | Total (cents) |
| payment_status | text | pending/processing/paid/failed/refunded |
| payment_reference | text | Payment reference |
| delivery_type | text | delivery/collection |
| delivery_address | text | Delivery address |
| delivery_latitude | numeric | GPS lat |
| delivery_longitude | numeric | GPS long |
| special_instructions | text | Special instructions |
| created_at | timestamp | Order time |
| confirmed_at | timestamp | Confirmation time |
| delivered_at | timestamp | Delivery time |

### 11. order_items

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Item ID |
| order_id | uuid | FK → orders.id |
| product_id | uuid | FK → products.id |
| product_name | text | Product name |
| product_price | integer | Price (cents) |
| quantity | integer | Quantity |
| modifiers | jsonb | Product modifiers |
| line_total | integer | Line total (cents) |

### 12. products

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Product ID |
| partner_id | uuid | FK → partners.id |
| name | text | Product name |
| description | text | Description |
| price | integer | Price (cents) |
| category | text | Category |
| image_url | text | Image URL |
| is_available | boolean | Available |

### 13. drivers (see above)

### 14. driver_earnings

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Earning ID |
| driver_id | uuid | FK → drivers.id |
| order_id | uuid | FK → orders.id |
| total_fee | integer | Total delivery fee |
| driver_amount | integer | Driver amount (93%) |
| system_amount | integer | System fee (5%) |
| agent_amount | integer | Agent commission (2%) |

### 15. delivery_tracking

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Tracking ID |
| order_id | uuid | FK → orders.id |
| driver_id | uuid | FK → drivers.id |
| latitude | numeric | GPS lat |
| longitude | numeric | GPS long |
| recorded_at | timestamp | Record time |

---

## Summary

- **Total Tables:** 30+
- **Role Tables:** 5 (members, partners, agents, insurers, drivers)
- **Admin Role:** Stored in members table with role='admin'
- **NO Central Users Table**
- **Authentication:** Each role table has mobile_number, pin_code, pin_hash
- **Primary Keys:** All tables use UUID
- **RLS Enabled:** Selected tables for security

## Key Design Patterns

1. **No Central Users Table** - Each role is self-contained
2. **Cashback Split:** System (1%) + Agent (1%) + Member (remainder)
3. **Delivery Fee Split:** Driver (93%) + System (5%) + Agent (2%)
4. **Cover Plan Funding:** Sequential by creation_order with overflow tracking
5. **Authentication:** mobile_number + pin_code per role table
6. **Timestamps:** All tables include created_at, most include updated_at
