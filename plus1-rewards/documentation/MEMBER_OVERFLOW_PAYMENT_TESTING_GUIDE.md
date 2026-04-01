# MEMBER OVERFLOW & PAYMENT LOGIC - COMPLETE TESTING GUIDE

**Project:** Plus1 Rewards  
**Focus:** Member Dashboard, Overflow System, Payment Logic, Cover Plan Funding  
**Last Updated:** March 31, 2026  
**Status:** Complete Testing Documentation

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Overflow Logic - Core Concepts](#overflow-logic-core-concepts)
3. [Automatic Cashback Processing](#automatic-cashback-processing)
4. [The 2x Threshold Rule](#the-2x-threshold-rule)
5. [Popup Sequence Testing](#popup-sequence-testing)
6. [Overflow Management Buttons](#overflow-management-buttons)
7. [Payment & Top-Up Logic](#payment-top-up-logic)
8. [Cover Plan Funding Flow](#cover-plan-funding-flow)
9. [Database Schema & Wallet Entries](#database-schema-wallet-entries)
10. [Complete Testing Scenarios](#complete-testing-scenarios)
11. [Edge Cases & Error Handling](#edge-cases-error-handling)
12. [Verification Checklist](#verification-checklist)

---

## SYSTEM OVERVIEW

### What is Plus1 Rewards?
Plus1 Rewards is a cashback-to-medical-cover platform where:
- Members shop at partner stores
- Partners offer 3-40% cashback
- Cashback is split: 1% system + 1% agent + remainder to member
- Member cashback funds medical cover plans
- Plans become Active when target amount is reached
- Plans renew every 30 days if sufficient funds available

### Key Components
