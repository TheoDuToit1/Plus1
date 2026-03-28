
# Plus1 Ecosystem Overview

## 📌 Projects

This system consists of two connected products:

1. **Plus1 Rewards (Core Platform)**
2. **Plus1 Go (Delivery Layer)**

Together, they create a full ecosystem combining rewards, commerce, and logistics.

---

# 🟢 Plus1 Rewards (Core Platform)

## Overview

Plus1 Rewards is a **health-linked cashback system** where members earn rewards from everyday spending.

Instead of traditional loyalty programs, cashback is used to **fund health cover**.

---

## 🔄 How It Works

1. Member shops at a partner business
2. Partner offers cashback (e.g. 10%)
3. Cashback is split:
   - Member → Health wallet
   - Agent → Commission
   - System → Platform fee
4. Member accumulates cashback
5. Once threshold is reached → **Health cover activates**

---

## 💡 Key Concept

> Everyday spending becomes a way to pay for healthcare.

---

## 👥 Roles

### Member

- Shops at partners
- Earns cashback
- Builds health cover

### Partner (Business)

- Offers cashback % to attract customers
- Gets more sales and exposure

### Agent

- Recruits partners
- Earns commission from their activity

### System

- Manages transactions
- Takes small percentage fees

---

# 🚚 Plus1 Go (Delivery Layer)

## Overview

Plus1 Go is the **delivery and ordering system** built inside Plus1 Rewards.

It allows members to order from partners instead of only shopping in-store.

---

## 🔄 How It Works

1. Member places order via app
2. Member enters delivery address
3. System calculates delivery fee (distance-based)
4. Driver accepts the order
5. Driver picks up from partner
6. Driver delivers to member
7. Member provides a **PIN**
8. Driver enters PIN → confirms delivery

---

## 🔐 PIN Confirmation System (CRITICAL)

Cashback and payments are ONLY released after delivery is confirmed via PIN.

### Why this matters:

- Prevents fraud
- Ensures delivery actually happened
- Protects all parties

---

## 💰 Payment & Split Logic

### Order Cashback:

- Member earns majority
- Agent gets small %
- System gets small %

### Delivery Fee:

- System: 5%
- Agent: 2%
- Driver: 93%

---

## 🚗 Driver Role

Drivers are also **members** of the system.

They:

- Accept delivery jobs
- Earn delivery income
- Accumulate funds into their wallet (health cover compatible)

---

# 🔗 How Both Systems Connect

## Without Plus1 Go:

- Members only shop in-store
- Cashback grows slowly

## With Plus1 Go:

- Members order online
- More frequent transactions
- Faster cashback accumulation
- Faster health cover activation

---

# 🧠 Core System Flow

1. Member places order
2. System calculates:
   - Cashback
   - Delivery fee
3. Driver delivers order
4. Member confirms with PIN
5. System releases:
   - Cashback → Member wallet
   - Delivery earnings → Driver
   - Commission → Agent
   - Fee → Platform

---

# 📊 Delivery Fee Model

- Distance-based calculation
- Example formula:
  - Base fee + per km rate
- Stored in system for transparency:
  - Distance (km)
  - Total fee
  - Split amounts

---

# 🗂️ Data Structure (Simplified)

## partners

- id
- name
- location (lat/lng)
- cashback_rate

## member_addresses

- id
- user_id
- address
- lat/lng

## delivery_orders

- id
- partner_id
- driver_id
- pickup_location
- dropoff_location
- distance_km
- delivery_fee
- status

## transactions

- id
- type (order / delivery)
- amount
- splits (system / agent / member / driver)

---

# 🎯 Big Picture

This system combines:

- Loyalty Program (cashback)
- Health Funding Model
- Marketplace (partners)
- Logistics System (delivery)

---

## 🚀 Outcome

- Members spend → earn → stay longer
- Drivers earn → join ecosystem
- Partners grow sales
- Platform scales with every transaction

---

## 🔥 Core Advantage

> A self-reinforcing ecosystem where spending directly contributes to health coverage.

---

# 📌 Summary

- **Plus1 Rewards** = Financial engine (cashback → health cover)
- **Plus1 Go** = Transaction engine (orders → delivery → more cashback)

Together:
→ Drive engagement
→ Increase transaction volume
→ Accelerate health cover activation
→ Create long-term retention

---
