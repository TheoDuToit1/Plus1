# Plus1-Go Project Summary

**Project Type:** Delivery & Cashback Rewards Platform  
**Tech Stack:** React 19 + TypeScript + Vite + Supabase + TailwindCSS  
**Status:** Development  
**Purpose:** Delivery layer for Plus1 Rewards ecosystem combining delivery services with cashback rewards and health funding

---

## Project Overview

Plus1-Go is a mobile-first delivery application that integrates with the Plus1 Rewards ecosystem. It enables members to place orders with partner merchants, earn cashback on purchases, and contribute to health cover plans simultaneously.

### Core Value Proposition
Every order triggers two financial flows:
1. **Order Cashback Flow** - Member receives cashback split between system, agent, and member
2. **Delivery Fee Flow** - Distance-based calculation split between driver, system, and agent

---

## Key Roles & Actors

| Role | Function | Earnings |
|------|----------|----------|
| **Member** | Places orders, receives cashback | Cashback % (after 2% split) |
| **Driver** | Delivers orders | 93% of delivery fee |
| **Partner** | Provides products/services | Pays cashback % to platform |
| **Agent** | Recruits partners | 1% of transaction + commissions |
| **System** | Platform operations | 1% of transaction + 5% delivery fee |

---

## Project Structure

```
plus1-go/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── types.ts                # TypeScript interfaces
│   └── components/
│       ├── ProductDetailModal.tsx    # Product detail view
│       └── RestaurantDetail.tsx      # Restaurant/partner detail view
├── public/
│   ├── plus1-go logo.png       # Application logo
│   └── [other assets]
├── pages/                      # Page components (empty)
├── components/                 # Shared components (empty)
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # TailwindCSS config
├── postcss.config.js           # PostCSS config
└── database-schema.sql         # Database schema (empty)
```

---

## Core Data Types

### Category
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
}
```

### Restaurant (Partner)
```typescript
interface Restaurant {
  id: string;
  name: string;
  image: string;
  deliveryFee: string;
  timeRange: string;
  rating: number;
  isTopRated?: boolean;
  isFavorite?: boolean;
}
```

### MenuItem (Product)
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
```

### BasketItem (Cart Item)
```typescript
interface BasketItem extends MenuItem {
  quantity: number;
}
```

### PickUpSpot
```typescript
interface PickUpSpot {
  id: string;
  name: string;
  image: string;
  type: string;
  distance: string;
}
```

---

## UI/UX Features

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Desktop sidebar navigation (hidden on mobile)
- Bottom navigation bar for mobile (fixed position)
- Adaptive typography and spacing

### Navigation Components
- **MobileNav:** Bottom navigation with 5 main tabs
  - Home (house icon)
  - Browse (search icon)
  - Offers (tag icon)
  - Cart (shopping cart with badge)
  - User (profile icon)

- **Desktop Sidebar:** Collapsible navigation with categories
  - Home, Grocery, Convenience, Alcohol, Health, Retail, Pet, Baby, Personal Care, Electronics
  - Offers and authentication links
  - "Add your restaurant" and "Sign up to deliver" CTAs

### Key Sections

1. **Header**
   - Logo and branding
   - Delivery/Pickup toggle
   - Address input with location pin
   - "Deliver now" dropdown
   - Cart icon with item count
   - Login/Sign up buttons

2. **Categories Carousel**
   - Horizontal scrollable category list
   - 18 categories (All, Grocery, Pizza, Sushi, Burgers, Indian, Healthy, Mexican, Wings, Asian, Chinese, Halal, Fast food, Korean, Thai, Seafood, Vegan, Italian)
   - Active category highlighting
   - Navigation arrows

3. **Filters Section**
   - Sticky filter bar below categories
   - Filter options: Offers, Delivery Fee, Under 30 min, Highest rated, Rating, Sort
   - Chevron indicators for expandable filters

4. **Promotional Banners (Bento Layout)**
   - 3-column grid on desktop, responsive on mobile
   - Featured promotions with images and CTAs
   - Examples: "Stock up this payday", "WHOPPER® With Cheese Med Meal for R90", "30% off McCrispy & Spicy"
   - Hover animations with image scaling

5. **Speedy Deliveries Section**
   - Horizontal scrollable restaurant cards
   - Shows: Restaurant image, name, rating, delivery time, delivery fee
   - Favorite heart button (toggleable)
   - "Free Delivery" badge
   - Click to view restaurant details

6. **Today's Offers Section**
   - Similar card layout to Speedy Deliveries
   - Promotional badges (e.g., "Buy 1 get 1 free")
   - Red accent color for offers

### Interactive Features
- **Animations:** Framer Motion for smooth transitions
- **State Management:** Zustand for cart and UI state
- **Hover Effects:** Scale, shadow, and color transitions
- **Active States:** Visual feedback for selected items
- **Responsive Images:** Google Images with referrer policy

---

## Featured Restaurants (Mock Data)

1. **L'Artisan Bistro**
   - Rating: 4.8 ⭐ (Top Rated)
   - Delivery: $0.99 Fee
   - Time: 25–35 min
   - Favorite: Yes

2. **Napoli Wood Fired**
   - Rating: 4.6 ⭐
   - Delivery: Free
   - Time: 15–25 min
   - Favorite: No

3. **Sushi Zen Master**
   - Rating: 4.9 ⭐
   - Delivery: $1.99 Fee
   - Time: 30–40 min
   - Favorite: Yes

4. **Burger Republic**
   - Rating: 4.5 ⭐
   - Delivery: Free
   - Time: 20–30 min
   - Favorite: No

---

## Component Architecture

### App.tsx (Main Component)
- **State Management:**
  - `selectedRestaurant` - Currently viewed restaurant
  - `basket` - Shopping cart items
  - `sidebarOpen` - Desktop sidebar toggle

- **Functions:**
  - `addToBasket()` - Add/increment item in cart
  - `removeFromBasket()` - Decrement/remove item from cart
  - `basketCount` - Total items in cart
  - `basketTotal` - Total cart value

- **Conditional Rendering:**
  - Shows RestaurantDetail when restaurant selected
  - Shows home view otherwise
  - AnimatePresence for smooth transitions

### RestaurantDetail.tsx
- Displays selected restaurant's menu
- Shows product details in modal
- Manages basket operations
- Displays total and item count

### ProductDetailModal.tsx
- Shows individual product details
- Quantity selector
- Add to basket functionality

---

## Styling & Design System

### TailwindCSS Configuration
- Custom breakpoints: `desktop` (1920px)
- Color scheme: Emerald green (#10b981) for primary actions
- Neutral grays for backgrounds and text
- Red (#dc2626) for promotional badges

### Key Classes
- `no-scrollbar` - Hide scrollbars on carousels
- `shadow-premium` - Enhanced shadow for hover states
- `active:scale-95` - Button press feedback
- `group-hover:` - Parent-child hover effects
- `desktop:` - Large screen specific styles

### Responsive Breakpoints
- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `lg:` (1024px+)
- Large Desktop: `desktop:` (1920px+)

---

## Dependencies

### Core
- **react** (^19.2.4) - UI framework
- **react-dom** (^19.2.4) - DOM rendering
- **react-router-dom** (^7.13.2) - Routing
- **typescript** (^5.9.3) - Type safety

### State & Data
- **zustand** (^5.0.11) - State management
- **@supabase/supabase-js** (^2.99.1) - Backend/database

### UI & Animation
- **framer-motion** (^11.15.0) - Animations
- **gsap** (^3.14.2) - Advanced animations
- **lucide-react** (^0.577.0) - Icon library
- **tailwindcss** (^4.2.1) - Utility CSS
- **@tailwindcss/postcss** (^4.2.2) - PostCSS plugin

### Build Tools
- **vite** (^8.0.0) - Build tool
- **@vitejs/plugin-react** (^6.0.0) - React plugin
- **postcss** (^8.5.8) - CSS processing
- **autoprefixer** (^10.4.27) - CSS vendor prefixes

### Development
- **eslint** (^9.39.4) - Code linting

---

## Key Features Implemented

✅ Mobile-responsive design  
✅ Restaurant/partner browsing  
✅ Product catalog with categories  
✅ Shopping cart functionality  
✅ Favorite/wishlist toggle  
✅ Promotional banners  
✅ Filter and sort options  
✅ Smooth animations and transitions  
✅ Rating display  
✅ Delivery fee and time estimates  
✅ Desktop sidebar navigation  
✅ Bottom mobile navigation  

---

## Features Not Yet Implemented

❌ Supabase integration (database connection)  
❌ Authentication (login/signup)  
❌ Real order placement  
❌ Payment processing  
❌ Order tracking  
❌ Cashback calculation and display  
❌ Cover plan integration  
❌ Driver assignment  
❌ Real-time notifications  
❌ User profile management  
❌ Address management  
❌ Order history  
❌ Ratings and reviews  

---

## Integration Points with Plus1 Rewards

### Database Tables to Connect
1. **partners** - Restaurant/merchant data
2. **members** - User accounts and profiles
3. **transactions** - Order records with cashback splits
4. **member_cover_plans** - Health cover plan funding
5. **cover_plan_wallet_entries** - Cashback allocation to plans
6. **agents** - Sales agent tracking
7. **member_partner_connections** - Member-partner relationships

### Business Logic to Implement
1. **Cashback Calculation**
   - Calculate member_percent = cashback_percent - 2
   - Calculate amounts: system_amount, agent_amount, member_amount
   - Store in transactions table

2. **Cover Plan Funding**
   - Route cashback to member_cover_plans by creation_order
   - Track overflow_balance for excess cashback
   - Create wallet entries for audit trail

3. **Delivery Fee Split**
   - Calculate driver earnings (93%)
   - Calculate system fee (5%)
   - Calculate agent commission (2%)

4. **Order Status Flow**
   - pending_sync → pending → completed
   - Handle reversals and disputes

---

## Environment Setup

### Required Environment Variables
```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_GOOGLE_MAPS_API_KEY=[your-google-maps-key]
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Next Steps for Integration

1. **Connect Supabase**
   - Initialize Supabase client
   - Set up authentication
   - Fetch real partner/restaurant data

2. **Implement Order Flow**
   - Create order placement logic
   - Integrate payment processing
   - Track order status

3. **Add Cashback Display**
   - Show cashback percentage on products
   - Display member earnings
   - Show cover plan progress

4. **Implement User Features**
   - User authentication
   - Profile management
   - Order history
   - Favorites/wishlist persistence

5. **Add Real-time Features**
   - Order status updates
   - Driver location tracking
   - Notifications

---

## File Locations

- **Main App:** `plus1-go/src/App.tsx`
- **Types:** `plus1-go/src/types.ts`
- **Components:** `plus1-go/src/components/`
- **Styles:** `plus1-go/src/index.css`
- **Config:** `plus1-go/vite.config.ts`, `plus1-go/tailwind.config.js`
- **Package:** `plus1-go/package.json`

---

## Notes for ChatGPT

- The project is a **delivery/ordering platform** (like Uber Eats, DoorDash)
- It's the **frontend/UI layer** for the Plus1 Rewards ecosystem
- The **backend** is Supabase with 21 tables managing members, partners, transactions, and cover plans
- **Key integration:** Orders should create transactions that fund member cover plans via cashback
- **Design:** Mobile-first, responsive, modern UI with smooth animations
- **State:** Currently uses mock data; needs real Supabase integration
- **Architecture:** React component-based with Zustand for state management

