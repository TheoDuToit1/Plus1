# Plus1-Go & Plus1-Rewards Integration Guide

**Purpose:** Combine the Plus1-Go delivery platform frontend with the Plus1-Rewards backend ecosystem  
**Status:** Planning & Architecture  
**Target:** Unified delivery + rewards + health funding platform

---

## Executive Summary

**Plus1-Go** is a mobile-first delivery application (frontend)  
**Plus1-Rewards** is a comprehensive rewards ecosystem (backend)

Integration creates a complete platform where:
- Members order from partners via Plus1-Go
- Each order generates cashback
- Cashback automatically funds health cover plans
- Agents earn commissions on partner recruitment
- Partners pay cashback and receive invoices
- Providers receive member cover plan data

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Plus1-Go Frontend                         │
│  (React + TypeScript + Vite + TailwindCSS)                  │
│  - Restaurant/Partner Browsing                              │
│  - Product Catalog & Shopping Cart                          │
│  - Order Placement                                          │
│  - Delivery Tracking                                        │
│  - Cashback Display                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Supabase Client SDK
                     │ (REST API + Realtime)
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Supabase Backend (PostgreSQL)                   │
│  - 21 Tables                                                │
│  - Authentication (JWT)                                     │
│  - Row-Level Security (RLS)                                 │
│  - Real-time Subscriptions                                  │
│  - Edge Functions (optional)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Order to Cover Plan Funding

```
1. Member Places Order
   ├─ Selects Partner (restaurant)
   ├─ Adds Items to Basket
   └─ Proceeds to Checkout

2. Order Created in Database
   ├─ Create transaction record
   ├─ Set status: 'pending_sync'
   ├─ Calculate cashback split:
   │  ├─ system_percent: 1%
   │  ├─ agent_percent: 1%
   │  └─ member_percent: (cashback_percent - 2)
   └─ Calculate amounts from purchase_amount

3. Delivery Completed
   ├─ Update transaction status: 'completed'
   ├─ Member confirms delivery (PIN)
   └─ Trigger cashback distribution

4. Cashback Distribution
   ├─ Create cover_plan_wallet_entry
   ├─ Route to member_cover_plans by creation_order:
   │  ├─ Plan 1: Fill to target_amount
   │  ├─ Plan 2: Fill to target_amount
   │  └─ Overflow: Store in overflow_balance
   ├─ Update member_cover_plans.funded_amount
   └─ Check if plan reached target (active_from timestamp)

5. Plan Activation (if target reached)
   ├─ Set status: 'active'
   ├─ Set active_from: now()
   ├─ Set active_to: now() + 30 days
   └─ Notify provider for export

6. Monthly Processes
   ├─ Generate partner_invoices
   ├─ Calculate agent_commissions
   ├─ Create provider_exports
   └─ Send notifications
```

---

## Database Integration Points

### 1. Partners (Restaurants)
**Plus1-Go Usage:**
- Display in restaurant list
- Show cashback percentage
- Show delivery fee
- Show ratings and reviews

**Supabase Table:** `partners`
```sql
SELECT id, shop_name, cashback_percent, category, address
FROM partners
WHERE status = 'active'
ORDER BY rating DESC;
```

**Key Fields:**
- `id` - Partner identifier
- `shop_name` - Display name
- `cashback_percent` - Cashback offered (3-40%)
- `category` - Business category
- `address` - Location
- `status` - active/suspended/pending/rejected

---

### 2. Members (Users)
**Plus1-Go Usage:**
- User authentication
- Profile display
- Order history
- Favorite partners

**Supabase Table:** `members`
```sql
SELECT id, full_name, email, phone, qr_code, status
FROM members
WHERE user_id = $1;
```

**Key Fields:**
- `id` - Member identifier
- `user_id` - Link to auth user
- `full_name` - Display name
- `qr_code` - Unique identifier for POS
- `status` - active/suspended/pending

---

### 3. Transactions (Orders)
**Plus1-Go Usage:**
- Create order record
- Track order status
- Calculate and display cashback

**Supabase Table:** `transactions`
```sql
INSERT INTO transactions (
  partner_id, member_id, agent_id,
  purchase_amount, cashback_percent,
  system_percent, agent_percent, member_percent,
  system_amount, agent_amount, member_amount,
  status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_sync');
```

**Key Fields:**
- `partner_id` - Which partner
- `member_id` - Which member
- `agent_id` - Recruiting agent (if applicable)
- `purchase_amount` - Order total
- `cashback_percent` - Partner's cashback rate
- `status` - pending_sync → pending → completed
- `*_amount` - Calculated splits

**Calculation Logic:**
```typescript
const purchase_amount = 100; // R100 order
const cashback_percent = 10; // Partner offers 10%
const system_percent = 1;
const agent_percent = 1;
const member_percent = cashback_percent - system_percent - agent_percent; // 8%

const system_amount = purchase_amount * (system_percent / 100); // R1
const agent_amount = purchase_amount * (agent_percent / 100); // R1
const member_amount = purchase_amount * (member_percent / 100); // R8
```

---

### 4. Member Cover Plans
**Plus1-Go Usage:**
- Display member's active cover plans
- Show funding progress
- Show overflow balance available

**Supabase Table:** `member_cover_plans`
```sql
SELECT id, cover_plan_id, target_amount, funded_amount,
       status, active_from, active_to, overflow_balance
FROM member_cover_plans
WHERE member_id = $1
ORDER BY creation_order ASC;
```

**Key Fields:**
- `member_id` - Which member
- `cover_plan_id` - Which plan
- `creation_order` - Funding priority (1, 2, 3...)
- `target_amount` - Monthly goal
- `funded_amount` - Amount funded so far
- `status` - in_progress/active/suspended/cancelled
- `overflow_balance` - Excess cashback

**Status Transitions:**
```
in_progress → active (when funded_amount >= target_amount)
active → suspended (if funded_amount drops below target)
active → in_progress (after 30-day active period)
```

---

### 5. Cover Plan Wallet Entries
**Plus1-Go Usage:**
- Show transaction history
- Display cashback allocation
- Audit trail

**Supabase Table:** `cover_plan_wallet_entries`
```sql
INSERT INTO cover_plan_wallet_entries (
  member_id, member_cover_plan_id, transaction_id,
  entry_type, amount, balance_after
) VALUES ($1, $2, $3, 'cashback_added', $4, $5);
```

**Entry Types:**
- `cashback_added` - From transaction
- `overflow_moved` - Moved to overflow
- `manual_adjustment` - Admin adjustment
- `reversal` - Transaction reversed
- `top_up` - Member/partner top-up
- `carry_over` - From previous period

---

### 6. Member-Partner Connections
**Plus1-Go Usage:**
- Track which partners member can order from
- Enable/disable partner access

**Supabase Table:** `member_partner_connections`
```sql
SELECT * FROM member_partner_connections
WHERE member_id = $1 AND status = 'active';
```

**Key Fields:**
- `member_id` - Member
- `partner_id` - Partner
- `status` - active/inactive
- `connected_at` - When connected

---

### 7. Agents
**Plus1-Go Usage:**
- Display agent info on partner profile
- Track agent commissions

**Supabase Table:** `agents`
```sql
SELECT id, user_id, status FROM agents WHERE id = $1;
```

**Key Fields:**
- `id` - Agent identifier
- `user_id` - Link to auth user
- `status` - pending/active/suspended/rejected

---

## Implementation Roadmap

### Phase 1: Backend Connection (Week 1-2)
- [ ] Set up Supabase client in Plus1-Go
- [ ] Implement authentication (login/signup)
- [ ] Fetch real partner data from `partners` table
- [ ] Display partners in restaurant list
- [ ] Fetch member profile from `members` table

### Phase 2: Order Management (Week 3-4)
- [ ] Implement order placement logic
- [ ] Create transaction records
- [ ] Calculate cashback splits
- [ ] Update transaction status on delivery
- [ ] Display order history

### Phase 3: Cashback & Cover Plans (Week 5-6)
- [ ] Fetch member cover plans
- [ ] Display cover plan progress
- [ ] Implement cashback allocation logic
- [ ] Create wallet entries
- [ ] Show overflow balance

### Phase 4: Real-time Features (Week 7-8)
- [ ] Set up Supabase realtime subscriptions
- [ ] Live order status updates
- [ ] Driver location tracking
- [ ] Push notifications
- [ ] Live cover plan updates

### Phase 5: Advanced Features (Week 9+)
- [ ] Payment processing integration
- [ ] Ratings and reviews
- [ ] Favorites/wishlist persistence
- [ ] Address management
- [ ] Referral tracking

---

## Key Implementation Details

### Authentication Flow
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: user.password,
});

// Get member profile
const { data: member } = await supabase
  .from('members')
  .select('*')
  .eq('user_id', data.user.id)
  .single();
```

### Fetching Partners
```typescript
const { data: partners } = await supabase
  .from('partners')
  .select('id, shop_name, cashback_percent, category, address, rating')
  .eq('status', 'active')
  .order('rating', { ascending: false });
```

### Creating an Order
```typescript
const { data: transaction } = await supabase
  .from('transactions')
  .insert({
    partner_id: selectedPartner.id,
    member_id: currentMember.id,
    agent_id: agent?.id || null,
    purchase_amount: basketTotal,
    cashback_percent: selectedPartner.cashback_percent,
    system_percent: 1,
    agent_percent: 1,
    member_percent: selectedPartner.cashback_percent - 2,
    system_amount: basketTotal * 0.01,
    agent_amount: basketTotal * 0.01,
    member_amount: basketTotal * (selectedPartner.cashback_percent - 2) / 100,
    status: 'pending_sync',
  })
  .select()
  .single();
```

### Allocating Cashback to Cover Plans
```typescript
// Get member's cover plans in order
const { data: plans } = await supabase
  .from('member_cover_plans')
  .select('*')
  .eq('member_id', memberId)
  .eq('status', 'in_progress')
  .order('creation_order', { ascending: true });

let remainingCashback = memberAmount;

for (const plan of plans) {
  const needed = plan.target_amount - plan.funded_amount;
  const toAllocate = Math.min(remainingCashback, needed);
  
  // Update plan
  await supabase
    .from('member_cover_plans')
    .update({
      funded_amount: plan.funded_amount + toAllocate,
      status: plan.funded_amount + toAllocate >= plan.target_amount ? 'active' : 'in_progress',
      active_from: plan.funded_amount + toAllocate >= plan.target_amount ? new Date() : null,
    })
    .eq('id', plan.id);
  
  // Create wallet entry
  await supabase
    .from('cover_plan_wallet_entries')
    .insert({
      member_id: memberId,
      member_cover_plan_id: plan.id,
      transaction_id: transactionId,
      entry_type: 'cashback_added',
      amount: toAllocate,
      balance_after: plan.funded_amount + toAllocate,
    });
  
  remainingCashback -= toAllocate;
  
  if (remainingCashback <= 0) break;
}

// Store overflow
if (remainingCashback > 0) {
  const lastPlan = plans[plans.length - 1];
  await supabase
    .from('member_cover_plans')
    .update({
      overflow_balance: lastPlan.overflow_balance + remainingCashback,
    })
    .eq('id', lastPlan.id);
}
```

### Real-time Subscriptions
```typescript
// Subscribe to transaction updates
const subscription = supabase
  .channel(`transaction:${transactionId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'transactions',
      filter: `id=eq.${transactionId}`,
    },
    (payload) => {
      console.log('Transaction updated:', payload.new);
      setOrderStatus(payload.new.status);
    }
  )
  .subscribe();

// Subscribe to cover plan updates
const planSubscription = supabase
  .channel(`member_cover_plans:${memberId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'member_cover_plans',
      filter: `member_id=eq.${memberId}`,
    },
    (payload) => {
      console.log('Cover plan updated:', payload.new);
      setCoverPlans(prev => 
        prev.map(p => p.id === payload.new.id ? payload.new : p)
      );
    }
  )
  .subscribe();
```

---

## UI Components to Create/Modify

### New Components Needed

1. **OrderPlacementFlow**
   - Address selection
   - Payment method
   - Delivery time selection
   - Order confirmation

2. **CashbackDisplay**
   - Show cashback percentage
   - Show member earnings
   - Show allocation to cover plans

3. **CoverPlanProgress**
   - Progress bar for each plan
   - Funding status
   - Days remaining (if active)
   - Overflow balance display

4. **OrderTracking**
   - Order status timeline
   - Driver location (map)
   - Estimated delivery time
   - Delivery confirmation (PIN)

5. **UserProfile**
   - Member info
   - Cover plans overview
   - Order history
   - Favorites

6. **PartnerDetail**
   - Partner info
   - Menu items
   - Ratings and reviews
   - Cashback details

### Modified Components

1. **App.tsx**
   - Add Supabase initialization
   - Add authentication check
   - Add real-time subscriptions

2. **RestaurantDetail.tsx**
   - Fetch real menu items
   - Show real cashback percentage
   - Create transaction on order

3. **MobileNav**
   - Add user profile link
   - Add order history link

---

## Security Considerations

### Row-Level Security (RLS)
- Enable RLS on all tables
- Members can only see their own data
- Partners can only see their own data
- Agents can only see their recruited partners

### Authentication
- Use Supabase JWT tokens
- Validate token on every request
- Implement refresh token rotation
- Secure PIN storage (hashed)

### Data Validation
- Validate all inputs on client
- Validate all inputs on server (Edge Functions)
- Prevent SQL injection (use parameterized queries)
- Validate cashback calculations

### API Keys
- Use anon key for client-side (limited permissions)
- Use service role key for server-side only
- Rotate keys regularly
- Monitor API usage

---

## Testing Strategy

### Unit Tests
- Cashback calculation logic
- Cover plan allocation logic
- Status transition logic

### Integration Tests
- Order creation flow
- Cashback distribution
- Cover plan updates
- Real-time subscriptions

### E2E Tests
- Complete order flow
- Member registration
- Partner onboarding
- Cover plan activation

---

## Deployment Checklist

- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Authentication enabled
- [ ] RLS policies configured
- [ ] Edge Functions deployed (if used)
- [ ] Database backups configured
- [ ] Monitoring and logging set up
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained

---

## Monitoring & Analytics

### Key Metrics to Track
- Order volume and value
- Cashback distribution
- Cover plan activation rate
- Member retention
- Partner satisfaction
- System performance

### Logging
- All transactions logged
- All errors logged
- All user actions logged (audit trail)
- Performance metrics logged

### Alerts
- Failed transactions
- Unusual cashback amounts
- System errors
- Performance degradation

---

## Future Enhancements

1. **AI/ML Features**
   - Personalized recommendations
   - Fraud detection
   - Demand forecasting

2. **Advanced Analytics**
   - Member spending patterns
   - Partner performance
   - Cashback ROI analysis

3. **Gamification**
   - Loyalty badges
   - Referral rewards
   - Leaderboards

4. **Expansion**
   - International support
   - Multiple currencies
   - Additional payment methods

5. **Integration**
   - Third-party delivery services
   - Accounting software
   - CRM systems

---

## Support & Documentation

- **API Documentation:** Supabase docs
- **Frontend Guide:** Plus1-Go README
- **Backend Guide:** Plus1-Rewards documentation
- **Integration Issues:** See troubleshooting section

---

## Contact & Questions

For integration questions or issues, refer to:
- Supabase documentation: https://supabase.com/docs
- Plus1-Rewards backend team
- Plus1-Go frontend team

