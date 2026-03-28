# Plus1-Go Test Flow - Quick Reference Guide

**Quick navigation for the complete A-Z test flow**

---

## 📋 Test Flow Overview

### Complete Journey: Member Registration → Food Delivery → Cover Activation

**Total Duration:** ~45 minutes for full flow  
**Dashboards Tested:** Member, Partner, Driver, Agent, Admin  
**Database Tables:** 21 tables across Plus1-Go + Plus1-Rewards

---

## 🎯 Quick Test Sequence

### 1. MEMBER REGISTRATION (5 min)
- Register with name, phone, 6-digit PIN
- Auto-create cover plan (R385 target)
- Generate QR code
- **Result:** Member account + default cover plan created

### 2. PROFILE COMPLETION (3 min)
- Add ID number
- Add bank details
- Add delivery address
- **Result:** Profile complete, can now order

### 3. BROWSE & ORDER (10 min)
- Browse partners (Napoli Pizza)
- Add items to cart (R265 subtotal)
- Proceed to checkout
- Calculate delivery fee (R51)
- Pay via Instant EFT
- **Result:** Order placed, total R316

### 4. PARTNER CONFIRMS (2 min)
- Partner receives order notification
- Confirms order (30 min prep time)
- Marks as ready
- **Result:** Order ready for pickup

### 5. DRIVER DELIVERY (15 min)
- Driver accepts delivery (earns R47.43)
- Picks up from partner
- GPS tracking active
- Delivers to member
- **Result:** Order delivered

### 6. CASHBACK ALLOCATION (Instant)
- Member earns R21.20 cashback
- Allocated to cover plan
- Cover progress: R21.20 / R385 (5.5%)
- **Result:** Cover plan funded

### 7. DASHBOARDS UPDATE (Instant)
- Member: Cover progress updated
- Partner: Invoice updated (+R26.50)
- Driver: Earnings updated (+R47.43)
- Agent: Commission updated (+R3.67)
- Admin: All metrics updated
- **Result:** All dashboards synchronized

---

## 💰 Financial Breakdown

### Order Cashback (R265 × 10%)
- Total cashback: R26.50
- System (1%): R2.65
- Agent (1%): R2.65
- **Member (8%): R21.20** ✅

### Delivery Fee (R51)
- Total fee: R51.00
- **Driver (93%): R47.43** ✅
- System (5%): R2.55
- Agent (2%): R1.02

### Cover Plan Impact
- Previous balance: R0
- Cashback added: R21.20
- **New balance: R21.20 / R385 (5.5%)**
- Orders needed to activate: ~17 more

---

## 🔄 Status Flow

### Order Status Progression
```
Placed → Confirmed → Preparing → Ready → 
Driver Assigned → Picked Up → En Route → Delivered
```

### Cover Plan Status
```
in_progress (R0-R384) → 
active (R385+, 30 days) → 
suspended (if not renewed) → 
active (after renewal/top-up)
```

---

## 📊 Key Database Tables

### Core Tables
1. **users** - Authentication (all roles)
2. **members** - Member profiles
3. **partners** - Restaurant/shop data
4. **orders** - Order records
5. **transactions** - Cashback transactions
6. **member_cover_plans** - Cover plan tracking
7. **cover_plan_wallet_entries** - Funding audit trail

### Supporting Tables
- order_items - Order line items
- drivers - Driver profiles
- driver_earnings - Delivery fee splits
- agents - Agent profiles
- agent_commissions - Monthly commissions
- partner_invoices - Monthly invoices
- disputes - Transaction disputes
- top_ups - Manual payments
- audit_logs - System audit trail

---

## ✅ Critical Checkpoints

### After Registration
- [ ] User created in `users` table
- [ ] Member created in `members` table
- [ ] QR code generated
- [ ] Default cover plan created
- [ ] Profile completion flag = FALSE

### After Profile Completion
- [ ] ID number saved
- [ ] Bank details saved
- [ ] Profile completion flag = TRUE
- [ ] Can proceed to checkout

### After Order Placement
- [ ] Order created with status 'pending'
- [ ] Payment status 'paid'
- [ ] Order items created
- [ ] Confirmation SMS sent

### After Delivery
- [ ] Order status 'delivered'
- [ ] Transaction created (status 'completed')
- [ ] Cashback allocated to cover plan
- [ ] Wallet entry created
- [ ] Driver earnings recorded
- [ ] All dashboards updated

### After Cover Activation (R385 reached)
- [ ] Cover plan status 'active'
- [ ] active_from timestamp set
- [ ] active_to = active_from + 30 days
- [ ] SMS sent to member
- [ ] Provider export ready

---

## 🧪 Test Accounts

### Member
```
Name: John Doe
Phone: 0821234567
PIN: 123456
Email: john.doe@example.com
```

### Partner
```
Name: Napoli Pizza
Cashback: 10%
Status: Active
```

### Driver
```
Name: Mike Smith
Phone: 0827654321
Vehicle: White Toyota Corolla
```

### Agent
```
Name: Sarah Johnson
Partners: 3
Commission: 1% + 2%
```

---

## 🔍 Quick Verification Queries

### Check Member Registration
```sql
SELECT * FROM members WHERE phone = '0821234567';
```

### Check Order Status
```sql
SELECT order_number, status, total_amount 
FROM orders 
WHERE order_number = 'ORD-20260327-1234';
```

### Check Cover Plan Balance
```sql
SELECT funded_amount, target_amount, status 
FROM member_cover_plans 
WHERE member_id = [member-id];
```

### Check Cashback Allocation
```sql
SELECT entry_type, amount, balance_after 
FROM cover_plan_wallet_entries 
WHERE member_id = [member-id] 
ORDER BY created_at DESC;
```

---

## 🚨 Common Issues & Solutions

### Issue: Profile completion blocked
**Solution:** Ensure ID number AND bank details are filled

### Issue: Checkout blocked
**Solution:** Check profile_completed flag is TRUE

### Issue: Driver not receiving orders
**Solution:** Check availability toggle is ON

### Issue: Cashback not allocated
**Solution:** Verify order status is 'delivered', not 'pending'

### Issue: GPS tracking not working
**Solution:** Check driver location permissions enabled

---

## 📱 Dashboard URLs

- Member: `/dashboard`
- Partner: `/partner/orders`
- Driver: `/driver`
- Agent: `/agent/dashboard`
- Admin: `/admin/dashboard`

---

## 🎓 Test Scenarios

### Basic Flow (30 min)
1. Register → Profile → Order → Delivery → Cashback

### Multiple Orders (60 min)
1. Place 5 orders
2. Track cover plan progression
3. Verify sequential funding

### Cover Activation (90 min)
1. Place 18 orders (reach R385)
2. Verify cover activates
3. Test renewal after 30 days

### Cross-Platform (20 min)
1. Register on Plus1-Go
2. Login to Plus1-Rewards
3. Verify unified wallet

### Edge Cases (45 min)
1. Order cancellation
2. Partner rejection
3. Driver unavailable
4. Payment failure
5. Dispute resolution

---

## 📈 Success Metrics

- ✅ Order completion rate: 100%
- ✅ Cashback accuracy: 100%
- ✅ Real-time updates: < 1 second
- ✅ Page load time: < 2 seconds
- ✅ Database queries: < 500ms
- ✅ GPS update frequency: 5 seconds
- ✅ Notification delivery: < 5 seconds

---

## 📚 Full Documentation

For complete step-by-step testing instructions, see:
**`COMPLETE_TEST_FLOW_A_TO_Z.md`**

---

**Quick Reference Version:** 1.0  
**Last Updated:** March 27, 2026
