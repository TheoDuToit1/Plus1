# Plus1-Go: AI-Assisted Build Plan
**Date:** March 27, 2026  
**Current State:** UI mockups only (directory + partner detail pages)  
**Build Approach:** Human + AI pair programming  
**Timeline:** 3-4 weeks to MVP

---

## What We Have vs What We Need

### ✅ What Exists (Frontend UI Only)
- Directory page with partner cards
- Partner detail page with menu display
- Shopping cart UI (no backend)
- Mobile-responsive design
- Basic routing

### ❌ What's Missing (Everything Else)
**Foundation (0% complete)**
- Database schema (21+ tables)
- Supabase connection
- Authentication system
- User registration/login

**User Dashboards (0% complete)**
- Member dashboard
- Partner dashboard  
- Driver dashboard
- Agent dashboard
- Admin dashboard

**Core Features (0% complete)**
- Real checkout & payment
- Order management
- Live GPS tracking
- Cashback calculation
- Cover plan activation
- SMS notifications
- Reviews & ratings

---

## Build Strategy: 4-Week Sprint

### Week 1: Foundation (Database + Auth)
**Goal:** Users can register, login, and see their dashboard

#### Day 1-2: Database Setup (WITH AI = 4 hours)
**I will create:**
1. Complete Supabase project setup
2. All database tables with proper relationships:
   - users, members, partners, drivers, agents
   - orders, order_items, transactions
   - products, product_categories
   - cover_plan_wallet_entries, member_cover_plans
   - delivery_tracking, driver_earnings
   - reviews, invoices, agent_commissions
3. Row Level Security (RLS) policies
4. Database functions for cashback calculations
5. Seed data for testing

**You do:** Review schema, test database access

#### Day 3-4: Authentication System (WITH AI = 6 hours)
**I will create:**
1. Supabase Auth integration
2. Registration page (`/register`)
   - Mobile number + password
   - Full name, email, suburb
   - Create user + member record
   - Auto-generate QR code
3. Login page (`/login`)
   - Mobile/email + password
   - Session management
4. Auth context provider
5. Protected route wrapper
6. Password reset flow

**You do:** Test registration/login, provide feedback

#### Day 5: Member Dashboard (WITH AI = 4 hours)
**I will create:**
1. Dashboard layout (`/dashboard`)
2. Cover progress widget (fetches real data)
3. Recent orders section
4. QR code display
5. Quick action buttons
6. Profile page (`/profile`)
   - Edit personal info
   - Manage addresses
   - Change password

**You do:** Test dashboard, check data display

**Week 1 Deliverable:** ✅ Users can register, login, see dashboard with real data

---

### Week 2: Member Features (Cart → Checkout → Payment)
**Goal:** Members can place and pay for orders

#### Day 6-7: Shopping Cart Backend (WITH AI = 6 hours)
**I will create:**
1. Connect directory to real partner data from database
2. Connect partner detail page to real menu items
3. Cart state management with Zustand
4. Cart page (`/cart`) with:
   - Real-time cashback calculation
   - Delivery vs Collection toggle
   - Address selector
   - Minimum order validation
5. Cart persistence (localStorage + database)

**You do:** Test adding items, check cashback calculations

#### Day 8-9: Checkout & Payment (WITH AI = 8 hours)
**I will create:**
1. Checkout page (`/checkout`)
2. Google Maps Distance Matrix integration
3. Delivery fee calculation (Base R25 + R8/km)
4. Address validation and geocoding
5. Ozow/PayFast payment integration
6. Payment success/failure handling
7. Order creation in database
8. Order confirmation page

**You do:** Test checkout flow, make test payment

#### Day 10: Order Tracking Setup (WITH AI = 4 hours)
**I will create:**
1. Order tracking page (`/order/[id]`)
2. Status timeline component
3. Google Maps integration for tracking
4. Order details display
5. Order history page (`/orders`)
6. Reorder functionality

**You do:** Test order tracking UI, check order history

**Week 2 Deliverable:** ✅ Members can browse, cart, checkout, pay, and track orders

---

### Week 3: Cashback + Partner + Driver Features
**Goal:** Cashback works, partners can manage orders, drivers can deliver

#### Day 11-12: Cashback Engine (WITH AI = 6 hours)
**I will create:**
1. Transaction calculation logic
   - Order cashback split (1% system, 1% agent, rest member)
   - Delivery fee split (93% driver, 5% system, 2% agent)
2. Wallet funding system
3. Cover plan activation logic (R320 threshold)
4. Cover progress tracking
5. Transaction history display
6. SMS notification integration (Clickatell/BulkSMS)

**You do:** Test cashback calculations, verify wallet updates

#### Day 13-14: Partner Dashboard (WITH AI = 8 hours)
**I will create:**
1. Partner registration flow
2. Partner dashboard (`/partner/dashboard`)
3. Menu management (`/partner/menu`)
   - Add/edit categories
   - Add/edit items with photos
   - Modifier groups (size, add-ons)
   - Stock management
4. Listing management (`/partner/listing`)
   - Business profile
   - Operating hours
   - Delivery settings
5. Order queue (`/partner/orders`)
   - Real-time order notifications
   - Confirm/reject orders
   - Mark as ready
6. Invoice management

**You do:** Test partner features, upload test menu

#### Day 15-16: Driver Dashboard (WITH AI = 8 hours)
**I will create:**
1. Driver registration flow
2. Driver dashboard (`/driver/dashboard`)
3. Availability toggle
4. Order queue (`/driver/orders`)
   - Available deliveries
   - Batched delivery detection
   - Accept/decline
5. Active delivery interface
   - Navigate to partner
   - Picked up button
   - Navigate to member
   - Delivered button
6. Earnings tracking

**You do:** Test driver flow, simulate deliveries

**Week 3 Deliverable:** ✅ Cashback works, partners manage orders, drivers can deliver

---

### Week 4: Real-Time Tracking + Admin + Polish
**Goal:** Live GPS tracking, admin controls, system ready for launch

#### Day 17-18: Live GPS Tracking (WITH AI = 8 hours)
**I will create:**
1. Driver location capture (every 5 seconds)
2. Supabase Realtime integration
3. Live map updates on member tracking page
4. Driver location marker animation
5. ETA calculation
6. Route polyline display
7. Driver info card with call button

**You do:** Test live tracking with real GPS data

#### Day 19-20: Admin Dashboard (WITH AI = 8 hours)
**I will create:**
1. Admin dashboard (`/admin/dashboard`)
   - Key metrics
   - Live order monitor
   - System alerts
2. User management
   - Members, partners, drivers, agents
   - Approve/reject applications
   - Suspend/reactivate
3. Order management
   - All orders view
   - Manual actions
   - Dispute resolution
4. System settings
   - Delivery fee formula
   - Fee splits
   - Delivery zones
5. Basic analytics

**You do:** Test admin controls, verify permissions

#### Day 21: Agent Dashboard (WITH AI = 4 hours)
**I will create:**
1. Agent dashboard (`/agent/dashboard`)
2. Partner management
3. Commission tracking
4. Recruitment tools
5. Payout history

**You do:** Test agent features

#### Day 22-23: Reviews, Notifications & Polish (WITH AI = 6 hours)
**I will create:**
1. Review & rating system
2. SMS notifications for all events
3. Email notifications (optional)
4. Error handling improvements
5. Loading states
6. Empty states
7. Mobile optimization
8. Bug fixes

**You do:** Full system testing, provide feedback

#### Day 24: Testing & Deployment (WITH AI = 4 hours)
**I will help:**
1. End-to-end testing
2. Fix critical bugs
3. Deploy to Vercel
4. Set up environment variables
5. Configure custom domain
6. Set up monitoring

**You do:** Final acceptance testing

**Week 4 Deliverable:** ✅ Complete system ready for launch

---

## Daily Work Pattern

### Morning Session (3-4 hours)
1. You describe what you need
2. I build the feature
3. You test and provide feedback
4. I fix issues immediately

### Afternoon Session (2-3 hours)
1. Continue building next feature
2. Integration testing
3. Polish and refinement

### Evening (1 hour)
1. Review progress
2. Plan next day
3. Document any issues

---

## Feature Breakdown by Priority

### 🔴 CRITICAL (Week 1-2)
- Database schema ✓
- Authentication ✓
- Member dashboard ✓
- Shopping cart ✓
- Checkout & payment ✓
- Order creation ✓

### 🟠 HIGH (Week 2-3)
- Order tracking ✓
- Cashback engine ✓
- Partner dashboard ✓
- Driver dashboard ✓
- Order management ✓

### 🟡 MEDIUM (Week 3-4)
- Live GPS tracking ✓
- Admin dashboard ✓
- Agent dashboard ✓
- SMS notifications ✓

### 🟢 NICE-TO-HAVE (Post-MVP)
- Advanced analytics
- Batch delivery optimization
- Push notifications
- In-app chat
- Loyalty programs

---

## What I Need From You

### To Start (Day 1)
1. Supabase account credentials (or create new project together)
2. Google Maps API key
3. Ozow/PayFast API credentials (or we use test mode)
4. SMS gateway credentials (or we mock it initially)

### During Build
1. Quick feedback on features (same day)
2. Test each feature as it's built
3. Provide real business data (partner info, products, etc.)
4. Make decisions on business logic questions

### For Launch
1. Domain name
2. Vercel account (or hosting preference)
3. Production API keys
4. Initial partner onboarding plan

---

## Risk Mitigation

### If We Fall Behind
**Priority 1 (Must Have):**
- Auth, cart, checkout, payment, basic order tracking
- Partner order queue
- Driver delivery flow
- Basic cashback

**Priority 2 (Can Wait):**
- Live GPS (use static map initially)
- Advanced admin features
- Agent dashboard
- Analytics

### If We Move Faster
**Bonus Features:**
- Push notifications
- Advanced analytics
- Batch delivery optimization
- Automated testing
- Performance optimization

---

## Success Metrics

### Week 1 Success
✅ 10 test users registered
✅ All can login and see dashboard
✅ Database queries working

### Week 2 Success
✅ 5 test orders placed
✅ Payments processed successfully
✅ Orders visible in partner queue

### Week 3 Success
✅ Cashback calculated correctly
✅ 1 cover plan activated
✅ 3 test deliveries completed

### Week 4 Success
✅ Live GPS tracking working
✅ Admin can manage all entities
✅ System deployed to production

---

## Post-MVP Roadmap (Weeks 5-8)

### Week 5: Optimization
- Performance tuning
- Database query optimization
- Image optimization
- Caching strategy

### Week 6: Advanced Features
- Batch delivery optimization
- Route planning
- Advanced analytics
- Automated reports

### Week 7: Mobile App (Optional)
- React Native app
- Push notifications
- Offline mode
- App store submission

### Week 8: Scale Preparation
- Load testing
- Security audit
- Backup strategy
- Monitoring & alerts

---

## Let's Start!

### Immediate Next Steps:
1. **You:** Confirm you want to proceed with this plan
2. **Me:** Create Supabase project and database schema
3. **You:** Review and approve schema
4. **Me:** Build authentication system
5. **You:** Test registration/login

### First Milestone: End of Day 5
- Users can register, login, and see their dashboard
- Real data flowing from database
- Foundation solid for building features

**Ready to start? Let's build this! 🚀**
