# Plus1-Go: Next 5 Tasks (REVISED & DETAILED)
**Date:** March 27, 2026  
**Status:** Ready to Build  
**Estimated Time:** 3-4 days total

---

## Overview: What We're Building

### Task 1: Extend Existing Database
Add new tables and columns for Plus1-Go delivery system

### Task 2: Authentication System (Member Role Only)
Minimal registration (3 fields), login (2 fields), profile completion flow

### Task 3: Member Dashboard
Dashboard with cover progress, profile management, profile completion check

### Task 4: Real Directory Data
Connect directory page to real partners from database with filters

### Task 5: Real Partner Detail Page
Connect partner detail page to real menu items from database

---

## Task 1: Extend Existing Database for Plus1-Go
**Duration:** 2-3 hours  
**Priority:** 🔴 CRITICAL - Foundation for everything

### What Already Exists:
✅ Supabase project: `gcbmlxdxwakkubpldype.supabase.co`  
✅ Core tables: users, members, shops, agents, wallets, transactions  
✅ Plus1 Rewards working with this database

### What I Will Build:

#### 1. Copy Supabase Config to Plus1-Go
**Create `.env.local` in plus1-go folder:**
```env
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Create `plus1-go/src/lib/supabase.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage,
    storageKey: 'plus1.auth.token'
  }
});
```

#### 2. Add NEW Tables (9 tables for delivery system)


**I will create a SQL migration file: `add-plus1-go-tables.sql`**

```sql
-- ============================================
-- PRODUCTS TABLE (Menu items for partners)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- In cents (R10.50 = 1050)
  
  category TEXT,
  image_url TEXT,
  
  is_available BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_products_partner ON products(partner_id);
CREATE INDEX idx_products_available ON products(is_available);

-- ============================================
-- PRODUCT_CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_categories_partner ON product_categories(partner_id);

-- ============================================
-- ORDERS TABLE (Core delivery entity)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  
  member_id UUID REFERENCES members(id),
  partner_id UUID REFERENCES shops(id),
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
  )) DEFAULT 'pending',
  
  -- Amounts in cents
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  
  -- Delivery details
  delivery_type TEXT CHECK (delivery_type IN ('delivery', 'collection')) DEFAULT 'delivery',
  delivery_address TEXT,
  delivery_latitude DECIMAL,
  delivery_longitude DECIMAL,
  special_instructions TEXT,
  
  -- Payment
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_reference TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  confirmed_at TIMESTAMP,
  ready_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Estimated times
  estimated_prep_time INTEGER, -- minutes
  estimated_delivery_time TIMESTAMP
);

CREATE INDEX idx_orders_member ON orders(member_id);
CREATE INDEX idx_orders_partner ON orders(partner_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- ORDER_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  
  product_name TEXT NOT NULL, -- Snapshot at order time
  product_price INTEGER NOT NULL, -- In cents
  quantity INTEGER NOT NULL DEFAULT 1,
  
  modifiers JSONB, -- Store selected modifiers
  
  line_total INTEGER NOT NULL, -- price * quantity
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- DRIVERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) UNIQUE,
  
  status TEXT CHECK (status IN ('offline', 'online', 'busy')) DEFAULT 'offline',
  
  -- Vehicle info
  vehicle_type TEXT,
  vehicle_make TEXT,
  vehicle_color TEXT,
  vehicle_registration TEXT,
  license_number TEXT,
  
  -- Current location
  current_latitude DECIMAL,
  current_longitude DECIMAL,
  last_location_update TIMESTAMP,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  license_photo_url TEXT,
  
  -- Stats
  total_deliveries INTEGER DEFAULT 0,
  average_rating DECIMAL DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_drivers_user ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- ============================================
-- DRIVER_EARNINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS driver_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  driver_id UUID REFERENCES drivers(id),
  order_id UUID REFERENCES orders(id),
  
  -- All amounts in cents
  total_fee INTEGER NOT NULL, -- Total delivery fee
  driver_amount INTEGER NOT NULL, -- 93%
  system_amount INTEGER NOT NULL, -- 5%
  agent_amount INTEGER NOT NULL, -- 2%
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_driver_earnings_driver ON driver_earnings(driver_id);
CREATE INDEX idx_driver_earnings_order ON driver_earnings(order_id);

-- ============================================
-- DELIVERY_TRACKING TABLE (GPS tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  order_id UUID REFERENCES orders(id),
  driver_id UUID REFERENCES drivers(id),
  
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  
  recorded_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_tracking_order ON delivery_tracking(order_id);
CREATE INDEX idx_tracking_driver ON delivery_tracking(driver_id);
CREATE INDEX idx_tracking_time ON delivery_tracking(recorded_at DESC);

-- ============================================
-- DELIVERY_PRICING_RULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Pricing formula (amounts in cents)
  base_fee INTEGER NOT NULL DEFAULT 2500, -- R25
  fee_per_km INTEGER NOT NULL DEFAULT 800, -- R8
  
  min_fee INTEGER DEFAULT 2500,
  max_fee INTEGER DEFAULT 15000,
  
  surge_multiplier DECIMAL DEFAULT 1.0,
  
  zone TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  member_id UUID REFERENCES members(id),
  partner_id UUID REFERENCES shops(id),
  order_id UUID REFERENCES orders(id) UNIQUE, -- One review per order
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_reviews_partner ON reviews(partner_id);
CREATE INDEX idx_reviews_member ON reviews(member_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

#### 3. Extend EXISTING Tables with New Columns

**I will create: `extend-existing-tables.sql`**

```sql
-- ============================================
-- EXTEND USERS TABLE (Add driver role)
-- ============================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_driver BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_partner_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS device_token TEXT,
ADD COLUMN IF NOT EXISTS pin_hash TEXT; -- For 6-digit PIN

-- ============================================
-- EXTEND MEMBERS TABLE (Add delivery info)
-- ============================================
ALTER TABLE members
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS default_address TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL,
ADD COLUMN IF NOT EXISTS longitude DECIMAL,
ADD COLUMN IF NOT EXISTS saved_addresses JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
ADD COLUMN IF NOT EXISTS bank_account_holder TEXT,
ADD COLUMN IF NOT EXISTS bank_branch_code TEXT,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_order_at TIMESTAMP;

-- ============================================
-- EXTEND SHOPS TABLE (Add delivery capabilities)
-- ============================================
ALTER TABLE shops
ADD COLUMN IF NOT EXISTS store_description TEXT,
ADD COLUMN IF NOT EXISTS store_logo_url TEXT,
ADD COLUMN IF NOT EXISTS store_banner_url TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL,
ADD COLUMN IF NOT EXISTS longitude DECIMAL,
ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS opening_hours JSONB,
ADD COLUMN IF NOT EXISTS delivery_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS pickup_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS minimum_order_value INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_radius_km DECIMAL DEFAULT 5,
ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_prep_time_minutes INTEGER DEFAULT 30;

-- ============================================
-- EXTEND TRANSACTIONS TABLE (Add order reference)
-- ============================================
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id),
ADD COLUMN IF NOT EXISTS transaction_type TEXT DEFAULT 'in_store',
ADD COLUMN IF NOT EXISTS delivery_fee INTEGER,
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES users(id);
```

#### 4. Create Database Functions

**I will create: `database-functions.sql`**

```sql
-- ============================================
-- FUNCTION: Generate Order Number
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Check Profile Completion
-- ============================================
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completed := (
    NEW.id_number IS NOT NULL AND
    NEW.bank_account_number IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completion
BEFORE INSERT OR UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION check_profile_completion();

-- ============================================
-- FUNCTION: Update Partner Rating
-- ============================================
CREATE OR REPLACE FUNCTION update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE shops
  SET 
    rating = (SELECT AVG(rating) FROM reviews WHERE partner_id = NEW.partner_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE partner_id = NEW.partner_id)
  WHERE id = NEW.partner_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_partner_rating();
```

#### 5. Set Up Row Level Security (RLS)

**I will create: `rls-policies.sql`**

```sql
-- Enable RLS on new tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products: Public read, partners can edit their own
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Partners can insert their own products"
  ON products FOR INSERT
  WITH CHECK (partner_id IN (
    SELECT id FROM shops WHERE user_id = auth.uid()
  ));

CREATE POLICY "Partners can update their own products"
  ON products FOR UPDATE
  USING (partner_id IN (
    SELECT id FROM shops WHERE user_id = auth.uid()
  ));

-- Orders: Members see their own, partners see their orders, drivers see assigned
CREATE POLICY "Members can view their own orders"
  ON orders FOR SELECT
  USING (member_id IN (
    SELECT id FROM members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Partners can view their orders"
  ON orders FOR SELECT
  USING (partner_id IN (
    SELECT id FROM shops WHERE user_id = auth.uid()
  ));

CREATE POLICY "Drivers can view assigned orders"
  ON orders FOR SELECT
  USING (driver_id = auth.uid());

-- Reviews: Public read, members can create for their orders
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Members can create reviews for their orders"
  ON reviews FOR INSERT
  WITH CHECK (member_id IN (
    SELECT id FROM members WHERE user_id = auth.uid()
  ));
```

#### 6. Add Seed Data for Testing

**I will create: `seed-data.sql`**

```sql
-- Insert default delivery pricing rule
INSERT INTO delivery_pricing_rules (base_fee, fee_per_km, min_fee, max_fee, is_active)
VALUES (2500, 800, 2500, 15000, true)
ON CONFLICT DO NOTHING;

-- Insert 3 test partners with menus (if not exist)
-- Partner 1: Pizza Place
INSERT INTO shops (name, cashback_percent, store_description, latitude, longitude, delivery_enabled, minimum_order_value)
VALUES ('Napoli Pizza', 10, 'Authentic wood-fired pizza', -33.9249, 18.4241, true, 5000)
ON CONFLICT DO NOTHING
RETURNING id;

-- Add products for Pizza Place (will use partner_id from above)
-- This will be done programmatically after partner creation
```

### What You Will Do:
1. Confirm I can proceed with adding tables
2. Review the SQL migration files I create
3. Run the migrations (or I'll run them)
4. Test that plus1-go can connect to database
5. Verify new tables exist in Supabase dashboard

### Deliverable:
✅ Plus1-go connected to existing Supabase  
✅ 9 new tables added  
✅ Existing tables extended with new columns  
✅ Database functions created  
✅ RLS policies set up  
✅ Seed data added  
✅ Both platforms share same database

---
