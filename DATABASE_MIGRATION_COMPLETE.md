# Database Migration Complete! ✅

**Date:** March 27, 2026  
**Project:** Plus1-Go Database Extension  
**Supabase Project:** gcbmlxdxwakkubpldype

---

## What Was Done

### ✅ Extended Existing Tables (4 tables)

#### 1. **users** table
- Added `is_driver` (BOOLEAN) - Driver role flag
- Added `is_partner_owner` (BOOLEAN) - Partner owner flag
- Added `kyc_status` (TEXT) - KYC verification status
- Added `device_token` (TEXT) - Push notification token
- Added `pin_hash` (TEXT) - 6-digit PIN for authentication

#### 2. **members** table (MAJOR UPDATE)
- Added `id_number` (TEXT) - SA ID number (required for orders)
- Added `date_of_birth` (DATE) - Optional
- Added `default_address` (TEXT) - Default delivery address
- Added `latitude`, `longitude` (DECIMAL) - Geolocation
- Added `saved_addresses` (JSONB) - Array of saved addresses
- Added `payment_token` (TEXT) - PayFast token for Uber-style payments
- Added `payment_method_type` (TEXT) - 'card' or 'bank_account'
- Added `payment_last_4` (TEXT) - Last 4 digits for display
- Added `payment_authorized` (BOOLEAN) - Payment authorization status
- Added `payment_authorized_at` (TIMESTAMP) - When authorized
- Added `bank_name`, `bank_account_number`, `bank_account_holder`, `bank_branch_code` (TEXT) - Banking details for refunds
- Added `profile_completed` (BOOLEAN) - Auto-calculated completion status
- Added `total_orders` (INTEGER) - Order count
- Added `total_spent` (INTEGER) - Total spent in cents
- Added `last_order_at` (TIMESTAMP) - Last order date
- Added `failed_payments` (INTEGER) - Failed payment counter
- Added `account_suspended` (BOOLEAN) - Suspension flag

#### 3. **partners** table
- Added `store_description` (TEXT) - Business description
- Added `store_logo_url` (TEXT) - Logo image
- Added `store_banner_url` (TEXT) - Banner image
- Added `latitude`, `longitude` (DECIMAL) - Store location
- Added `is_open` (BOOLEAN) - Open/closed status
- Added `opening_hours` (JSONB) - Operating hours
- Added `delivery_enabled` (BOOLEAN) - Delivery capability
- Added `pickup_enabled` (BOOLEAN) - Pickup capability
- Added `minimum_order_value` (INTEGER) - Min order in cents
- Added `delivery_radius_km` (DECIMAL) - Delivery radius
- Added `rating` (DECIMAL) - Average rating
- Added `total_reviews` (INTEGER) - Review count
- Added `average_prep_time_minutes` (INTEGER) - Avg prep time

#### 4. **transactions** table
- Added `order_id` (UUID) - Reference to orders
- Added `transaction_type` (TEXT) - 'in_store' or 'online_order'
- Added `delivery_fee` (INTEGER) - Delivery fee in cents
- Added `driver_id` (UUID) - Driver reference

---

### ✅ Created New Tables (9 tables)

#### 1. **products** - Menu items for partners
- `id` (UUID) - Primary key
- `partner_id` (UUID) - Partner reference
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `price` (INTEGER) - Price in cents
- `category` (TEXT) - Category
- `image_url` (TEXT) - Product image
- `is_available` (BOOLEAN) - Stock status
- `created_at`, `updated_at` (TIMESTAMP)

#### 2. **product_categories** - Menu organization
- `id` (UUID) - Primary key
- `partner_id` (UUID) - Partner reference
- `name` (TEXT) - Category name
- `display_order` (INTEGER) - Sort order

#### 3. **orders** - Core delivery entity (UBER MODEL)
- `id` (UUID) - Primary key
- `order_number` (TEXT) - Unique order number
- `member_id`, `partner_id`, `driver_id` (UUID) - References
- `status` (TEXT) - Order status (pending → delivered)
- `subtotal`, `delivery_fee`, `total_amount` (INTEGER) - Amounts in cents
- `payment_status` (TEXT) - pending, processing, paid, failed, refunded
- `payment_reference` (TEXT) - PayFast reference
- `payment_attempted_at` (TIMESTAMP) - Payment attempt time
- `payment_retry_count` (INTEGER) - Retry counter
- `delivery_type` (TEXT) - 'delivery' or 'collection'
- `delivery_address`, `delivery_latitude`, `delivery_longitude` - Delivery location
- `special_instructions` (TEXT) - Order notes
- Timestamps: `created_at`, `confirmed_at`, `ready_at`, `picked_up_at`, `delivered_at`, `payment_completed_at`
- `estimated_prep_time`, `estimated_delivery_time`

#### 4. **order_items** - Items in each order
- `id` (UUID) - Primary key
- `order_id` (UUID) - Order reference
- `product_id` (UUID) - Product reference
- `product_name`, `product_price` (TEXT, INTEGER) - Snapshot at order time
- `quantity` (INTEGER) - Quantity ordered
- `modifiers` (JSONB) - Selected modifiers
- `line_total` (INTEGER) - Line total in cents

#### 5. **drivers** - Driver profiles
- `id` (UUID) - Primary key
- `user_id` (UUID) - User reference
- `status` (TEXT) - 'offline', 'online', 'busy'
- `vehicle_type`, `vehicle_make`, `vehicle_color`, `vehicle_registration` (TEXT)
- `license_number` (TEXT) - Driver's license
- `current_latitude`, `current_longitude` (DECIMAL) - Current location
- `last_location_update` (TIMESTAMP)
- `is_verified` (BOOLEAN) - Verification status
- `license_photo_url` (TEXT) - License photo
- `total_deliveries` (INTEGER) - Delivery count
- `average_rating` (DECIMAL) - Driver rating

#### 6. **driver_earnings** - Delivery fee splits
- `id` (UUID) - Primary key
- `driver_id`, `order_id` (UUID) - References
- `total_fee` (INTEGER) - Total delivery fee
- `driver_amount` (INTEGER) - 93% to driver
- `system_amount` (INTEGER) - 5% to system
- `agent_amount` (INTEGER) - 2% to agent

#### 7. **delivery_tracking** - GPS tracking
- `id` (UUID) - Primary key
- `order_id`, `driver_id` (UUID) - References
- `latitude`, `longitude` (DECIMAL) - GPS coordinates
- `recorded_at` (TIMESTAMP) - Tracking time

#### 8. **delivery_pricing_rules** - Fee calculation
- `id` (UUID) - Primary key
- `base_fee` (INTEGER) - Base fee (R25 = 2500 cents)
- `fee_per_km` (INTEGER) - Per km rate (R8 = 800 cents)
- `min_fee`, `max_fee` (INTEGER) - Fee limits
- `surge_multiplier` (DECIMAL) - Surge pricing
- `zone` (TEXT) - Geographic zone
- `is_active` (BOOLEAN) - Active status

#### 9. **reviews** - Partner & driver ratings
- `id` (UUID) - Primary key
- `member_id`, `partner_id`, `order_id` (UUID) - References
- `rating` (INTEGER) - 1-5 stars
- `comment` (TEXT) - Review text

---

### ✅ Created Database Functions (3 functions)

#### 1. **generate_order_number()**
- Generates unique order numbers
- Format: `ORD-YYYYMMDD-XXXX`
- Example: `ORD-20260327-1234`

#### 2. **check_profile_completion()**
- Automatically calculates `profile_completed` status
- Checks: `id_number` AND `payment_token` AND `payment_authorized`
- Trigger: Runs on INSERT/UPDATE of members table

#### 3. **update_partner_rating()**
- Automatically updates partner rating and review count
- Calculates average rating from reviews table
- Trigger: Runs on INSERT/UPDATE of reviews table

---

### ✅ Added Seed Data

- **Default delivery pricing rule:**
  - Base fee: R25 (2500 cents)
  - Per km: R8 (800 cents)
  - Min fee: R25
  - Max fee: R150
  - Active: true

---

## Database Summary

### Total Tables: 30
- **Existing (extended):** 21 tables
- **New (Plus1-Go):** 9 tables

### Key Features Enabled:

✅ **Uber-style payment model** - Pay after delivery  
✅ **Profile completion tracking** - Auto-calculated  
✅ **GPS tracking** - Real-time driver location  
✅ **Dynamic delivery pricing** - Distance-based fees  
✅ **Review system** - Auto-updating ratings  
✅ **Driver earnings** - Automatic fee splits  
✅ **Order management** - Complete order lifecycle  
✅ **Product catalog** - Partner menus  

---

## Next Steps

### 1. Copy Supabase Config to Plus1-Go
```bash
# Copy .env.local from plus1-rewards to plus1-go
cp plus1-rewards/.env.local plus1-go/.env.local
```

### 2. Create Supabase Client
Create `plus1-go/src/lib/supabase.ts` (same as plus1-rewards)

### 3. Test Connection
```typescript
import { supabase } from './lib/supabase';

// Test query
const { data, error } = await supabase
  .from('partners')
  .select('*')
  .limit(1);

console.log('Connection test:', data, error);
```

### 4. Start Building Features
- Task 2: Authentication system (registration, login)
- Task 3: Member dashboard
- Task 4: Real directory data
- Task 5: Real partner detail page

---

## Database Connection Info

**Project:** gcbmlxdxwakkubpldype  
**URL:** https://gcbmlxdxwakkubpldype.supabase.co  
**Region:** eu-west-1  
**Status:** ACTIVE_HEALTHY  

---

## Migration Complete! 🎉

The database is now ready for Plus1-Go development. All tables, functions, and triggers are in place. You can start building the authentication system and member features!
