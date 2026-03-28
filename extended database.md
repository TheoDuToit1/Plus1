. CORE SYSTEM PRINCIPLES
1.1 Unified Identity
One user → multiple roles (member, driver, partner owner, agent)
1.2 Financial Integrity
Ledger-based wallet (no direct balance storage)
Every cent tracked via entries
1.3 System-Controlled Logistics

❗ Delivery pricing is NOT controlled by partners
✅ Fully controlled by system logic

2. EXISTING TABLES (UNCHANGED + EXTENDED)
   2.1 USERS (EXTENDED)
   -- Role Expansion
   is_driver BOOLEAN DEFAULT FALSE,
   is_partner_owner BOOLEAN DEFAULT FALSE,

-- Authentication (UPDATED FOR PLUS1-GO)
mobile_number TEXT UNIQUE NOT NULL, -- Primary identifier (10 digits)
pin_hash TEXT NOT NULL, -- 6-digit PIN (hashed with bcrypt)

-- KYC / Verificationkiro-cli settings chat.enableKnowledge true
kyc_status TEXT CHECK (kyc_status IN ('pending','verified','rejected')) DEFAULT 'pending',
face_image_url TEXT,
id_document_url TEXT,

-- Banking (Payouts - for drivers/agents)
bank_name TEXT,
bank_account_number TEXT,
bank_account_holder TEXT,
bank_branch_code TEXT,

-- Device / Activity
device_token TEXT,
last_active_at TIMESTAMP

❗ AUTHENTICATION CHANGES:

- Login: mobile_number + pin_hash (NO email, NO password)
- Registration: full_name + mobile_number + 6-digit PIN
- Unified across Plus1 Rewards and Plus1-Go
- Same credentials work on both platforms
  2.2 MEMBERS (EXTENDED)
  -- Basic Info (from registration)
  full_name TEXT NOT NULL, -- Required at registration
  mobile_number TEXT NOT NULL, -- Required at registration
  qr_code TEXT, -- Auto-generated for in-store use

-- Profile Completion Fields (REQUIRED BEFORE FIRST ORDER)
id_number TEXT, -- ⚠️ REQUIRED to place orders
email TEXT, -- Optional
date_of_birth DATE, -- Optional

-- Payment Method (UBER MODEL - Pay After Delivery)
payment_token TEXT, -- ⚠️ REQUIRED - PayFast tokenization for recurring payments
payment_method_type TEXT CHECK (payment_method_type IN ('card', 'bank_account')),
payment_last_4 TEXT, -- Last 4 digits for display (e.g., "****1234")
payment_authorized BOOLEAN DEFAULT FALSE, -- User authorized recurring payments
payment_authorized_at TIMESTAMP, -- When authorization happened

-- Banking Details (For Refunds & Payouts)
bank_name TEXT, -- For refunds if payment fails
bank_account_number TEXT, -- For refunds if payment fails
bank_account_holder TEXT,
bank_branch_code TEXT,

-- Profile Completion Status
profile_completed BOOLEAN DEFAULT FALSE, -- Auto-calculated trigger

-- Delivery Profile
default_address TEXT,
latitude DECIMAL,
longitude DECIMAL,
saved_addresses JSONB DEFAULT '[]', -- Array of address objects

-- Preferences
preferred_payment_method TEXT,

-- Activity Tracking
total_orders INTEGER DEFAULT 0,
total_spent INTEGER DEFAULT 0, -- In cents
last_order_at TIMESTAMP,
failed_payments INTEGER DEFAULT 0, -- Track payment failures
account_suspended BOOLEAN DEFAULT FALSE, -- Suspend if too many failed payments

❗ REGISTRATION FLOW:

1. User registers with: full_name + mobile_number + 6-digit PIN
2. Creates user + member + default cover plan
3. Generates QR code
4. Auto-login and redirect to dashboard
5. Dashboard shows warning: "Complete your profile to start ordering"

❗ PROFILE COMPLETION FLOW (UBER MODEL):

1. Member lands on dashboard after registration
2. Sees notification banner: "Complete your profile to start ordering"
3. Missing fields: ID Number, Payment Method
4. User clicks "Complete Profile"
5. Fills in ID Number
6. Clicks "Add Payment Method"
7. Redirected to PayFast to authorize recurring payments
8. PayFast returns payment_token
9. Token stored in database
10. profile_completed = TRUE
11. Can now place orders

❗ ORDER & PAYMENT FLOW (UBER MODEL):

1. User places order (NO payment at checkout)
2. Order created with payment_status = 'pending'
3. Partner confirms and prepares order
4. Driver delivers order
5. Driver marks "Delivered"
6. System AUTOMATICALLY charges payment_token via PayFast
7. If payment succeeds:
   - payment_status = 'paid'
   - Create cashback transactions
   - Credit cover wallet
   - Send receipt
8. If payment fails:
   - Retry 3 times over 24 hours
   - If still fails: account_suspended = TRUE
   - Send notification: "Payment failed, update payment method"

❗ PROFILE COMPLETION TRIGGER:
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completed := (
    NEW.id_number IS NOT NULL AND
    NEW.payment_token IS NOT NULL AND
    NEW.payment_authorized = TRUE
  );
  RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completion
BEFORE INSERT OR UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION check_profile_completion();

❗ PAYMENT FAILURE HANDLING:
CREATE OR REPLACE FUNCTION handle_payment_failure()
RETURNS TRIGGER AS
$$

BEGIN
  -- Increment failed payment counter
  UPDATE members
  SET failed_payments = failed_payments + 1
  WHERE id = NEW.member_id;

  -- Suspend account if 3+ failed payments
  UPDATE members
  SET account_suspended = TRUE
  WHERE id = NEW.member_id
  AND failed_payments >= 3;

  RETURN NEW;
END;

$$
LANGUAGE plpgsql;

❗ KEY DIFFERENCES FROM TRADITIONAL CHECKOUT:
- NO payment at checkout (seamless like Uber)
- Payment happens AFTER delivery automatically
- Requires PayFast tokenization/subscription feature
- User authorizes recurring payments once
- System charges automatically after each delivery
- Better UX but more complex implementation
2.3 PARTNERS (EXTENDED – CORRECTED)
-- Store Info
store_description TEXT,
store_logo_url TEXT,
store_banner_url TEXT,

-- Location
latitude DECIMAL,
longitude DECIMAL,

-- Operations
is_open BOOLEAN DEFAULT TRUE,
opening_hours JSONB,

-- Capabilities (NOT pricing)
delivery_enabled BOOLEAN DEFAULT TRUE,
pickup_enabled BOOLEAN DEFAULT TRUE,

-- Performance
rating DECIMAL DEFAULT 0,
total_reviews INTEGER DEFAULT 0,
average_prep_time_minutes INTEGER,

-- Compliance
business_registration_number TEXT,
tax_number TEXT

❗ REMOVED CONCEPT (IMPORTANT):

No base_delivery_fee
No fee_per_km
No partner pricing control
2.4 TRANSACTIONS (EXTENDED)
order_id UUID REFERENCES orders(id),

transaction_type TEXT CHECK (transaction_type IN (
  'in_store',
  'online_order'
)),

delivery_fee DECIMAL,
driver_id UUID REFERENCES users(id)
2.5 COVER_PLAN_WALLET_ENTRIES (EXTENDED)
order_id UUID REFERENCES orders(id),

source TEXT CHECK (source IN (
  'pos',
  'delivery',
  'topup',
  'admin'
))
2.6 AGENT_COMMISSIONS (EXTENDED)
order_id UUID REFERENCES orders(id),

commission_type TEXT CHECK (commission_type IN (
  'cashback',
  'delivery'
))
2.7 MEMBER_PARTNER_CONNECTIONS (EXTENDED)
is_favorite BOOLEAN DEFAULT FALSE,
last_order_at TIMESTAMP
3. NEW TABLES (PLUS1 GO + DELIVERY SYSTEM)
3.1 PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),

  name TEXT,
  description TEXT,
  price DECIMAL,

  category TEXT,
  image_url TEXT,

  is_available BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT now()
);
3.2 PRODUCT_CATEGORIES
CREATE TABLE product_categories (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),

  name TEXT,
  display_order INTEGER
);
3.3 ORDERS (CORE DELIVERY ENTITY)
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- e.g., "ORD-20260327-1234"

  member_id UUID REFERENCES members(id),
  partner_id UUID REFERENCES partners(id),
  driver_id UUID REFERENCES users(id),

  status TEXT CHECK (status IN (
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'driver_assigned',
    'picked_up',
    'on_the_way',
    'delivered',
    'cancelled'
  )),

  -- Amounts (in cents)
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0, -- SYSTEM CALCULATED (LOCKED)
  total_amount INTEGER NOT NULL,

  -- Payment (UBER MODEL - Charged AFTER delivery)
  payment_status TEXT CHECK (payment_status IN (
    'pending',      -- Order placed, not yet charged
    'processing',   -- Charging payment method
    'paid',         -- Successfully charged
    'failed',       -- Payment failed
    'refunded'      -- Refunded to customer
  )) DEFAULT 'pending',
  payment_reference TEXT, -- PayFast transaction reference
  payment_attempted_at TIMESTAMP, -- When we tried to charge
  payment_retry_count INTEGER DEFAULT 0, -- Number of retry attempts

  -- Delivery details
  delivery_type TEXT CHECK (delivery_type IN ('delivery', 'collection')) DEFAULT 'delivery',
  delivery_address TEXT,
  delivery_latitude DECIMAL,
  delivery_longitude DECIMAL,
  special_instructions TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  confirmed_at TIMESTAMP,
  ready_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  delivered_at TIMESTAMP,
  payment_completed_at TIMESTAMP, -- When payment succeeded

  -- Estimated times
  estimated_prep_time INTEGER, -- minutes
  estimated_delivery_time TIMESTAMP
);

❗ PAYMENT FLOW:
1. Order created → payment_status = 'pending'
2. Order delivered → Trigger automatic payment
3. System charges payment_token → payment_status = 'processing'
4. If success → payment_status = 'paid', create transactions
5. If failed → payment_status = 'failed', retry later
3.4 ORDER_ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),

  quantity INTEGER,
  price DECIMAL
);
3.5 DRIVERS
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),

  status TEXT CHECK (status IN ('offline','online','busy')),

  vehicle_type TEXT,
  license_number TEXT,

  current_latitude DECIMAL,
  current_longitude DECIMAL,

  is_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT now()
);
3.6 DRIVER_EARNINGS
CREATE TABLE driver_earnings (
  id UUID PRIMARY KEY,

  driver_id UUID REFERENCES drivers(id),
  order_id UUID REFERENCES orders(id),

  total_fee DECIMAL,
  driver_amount DECIMAL,
  system_amount DECIMAL,
  agent_amount DECIMAL,

  created_at TIMESTAMP DEFAULT now()
);
3.7 DELIVERY_TRACKING (REAL-TIME GPS)
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY,

  order_id UUID REFERENCES orders(id),
  driver_id UUID REFERENCES drivers(id),

  latitude DECIMAL,
  longitude DECIMAL,

  recorded_at TIMESTAMP DEFAULT now()
);
3.8 REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY,

  member_id UUID REFERENCES members(id),
  partner_id UUID REFERENCES partners(id),
  order_id UUID REFERENCES orders(id),

  rating INTEGER,
  comment TEXT,

  created_at TIMESTAMP DEFAULT now()
);
3.9 PAYOUTS
CREATE TABLE payouts (
  id UUID PRIMARY KEY,

  user_id UUID REFERENCES users(id),

  amount DECIMAL,
  status TEXT CHECK (status IN ('pending','paid','failed')),

  created_at TIMESTAMP DEFAULT now()
);
4. DELIVERY PRICING (SYSTEM-CONTROLLED)
4.1 DELIVERY_PRICING_RULES
CREATE TABLE delivery_pricing_rules (
  id UUID PRIMARY KEY,

  base_fee DECIMAL,
  fee_per_km DECIMAL,

  min_fee DECIMAL,
  max_fee DECIMAL,

  surge_multiplier DECIMAL DEFAULT 1,

  zone TEXT,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT now()
);
4.2 DELIVERY_ZONES (OPTIONAL ADVANCED)
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  name TEXT,

  min_lat DECIMAL,
  max_lat DECIMAL,
  min_lng DECIMAL,
  max_lng DECIMAL
);
5. CORE SYSTEM FLOWS
5.1 ORDER → PAYMENT → CASHBACK → COVER PLAN (UBER MODEL)
Order Created (payment_status = 'pending')
   ↓
Partner Confirms
   ↓
Driver Delivers
   ↓
Order Marked "Delivered"
   ↓
🔄 AUTOMATIC PAYMENT TRIGGER
   ↓
Charge payment_token via PayFast
   ↓
Payment Success? 
   ├─ YES → payment_status = 'paid'
   │    ↓
   │    Transaction Created
   │    ↓
   │    Cashback Calculated
   │    ↓
   │    Wallet Entry Created
   │    ↓
   │    Cover Plan Funded
   │    ↓
   │    Activation Check
   │
   └─ NO → payment_status = 'failed'
        ↓
        Retry 3 times over 24 hours
        ↓
        Still failed? → Suspend account
5.2 DELIVERY FLOW
Order placed
   ↓
Partner accepts
   ↓
Driver assigned
   ↓
Picked up
   ↓
Delivered
5.3 DELIVERY FEE CALCULATION (SYSTEM LOGIC)
Delivery Fee =
(base_fee + distance * fee_per_km)
× surge_multiplier

Then:

Clamp between min_fee and max_fee
Store in orders.delivery_fee
5.4 DELIVERY EARNINGS SPLIT
Delivery Fee
   ↓
Driver: 93%
System: 5%
Agent: 2%
6. FINAL SYSTEM RESULT

This database now supports:

✅ Rewards System
Cashback
Cover plans
Wallet ledger
✅ Delivery System (Uber-like)
Orders
Drivers
Tracking
Dynamic pricing
✅ Financial Engine
Transactions
Commissions
Payouts
✅ Healthcare Funding
Cover plans
Activation cycles
Provider exports
7. FINAL NOTE

This is now a production-grade unified architecture

You have:

One database
One wallet system
One transaction engine
Multiple revenue streams
$$
