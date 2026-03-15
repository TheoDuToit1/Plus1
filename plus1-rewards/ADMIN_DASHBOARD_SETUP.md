# Admin Dashboard Setup

## Overview
Platform owner monitoring page showing real-time system health, revenue, and key metrics.

## Features

### Stats Grid (2x4 Cards)
- **Active Shops**: Count + percentage of operational shops
- **Revenue This Month**: Total from invoices generated
- **Suspended Shops**: Count + percentage of suspended shops
- **Policies Activated**: Total synced transactions
- **Overdue Invoices**: Shops with overdue payments
- **Upcoming Payouts**: Total agent commissions due
- **Total Shops**: Network size
- **Collection Rate**: Percentage of on-time payments

### Alerts
- ⚠️ Overdue shops → Auto-suspend today
- 💰 Upcoming agent payouts
- 🔴 Suspended shops count

### Quick Actions
- 📄 Generate Invoices → `/admin/invoices`
- 🔴 Manage Suspensions → `/admin/suspensions`
- 👥 Agent Payouts → `/admin/agents`
- 📊 Export Day1 Batch → Export feature

### Data Sources
- `shops.status` → Active vs suspended count
- `monthly_invoices` → Revenue + payment status
- `transactions` → Policy activations count
- `agents.total_commission` → Upcoming payouts

## Access

Navigate to `/admin/dashboard`

## Data Refresh

- Automatic on page load
- Manual refresh with "🔄 Refresh Data" button
- Real-time updates via Supabase queries

## Metrics Explained

**Active Shops**: Shops with status = 'active'
**Revenue This Month**: Sum of total_due from current month invoices
**Suspended Shops**: Shops with status = 'suspended'
**Policies Activated**: Count of synced transactions
**Overdue Invoices**: Invoices with status = 'overdue'
**Upcoming Payouts**: Sum of agent total_commission > 0
**Collection Rate**: (Total Shops - Overdue) / Total Shops * 100

## Next Pages

- `/admin/invoices` - Detailed invoice management
- `/admin/suspensions` - Suspension management
- `/admin/agents` - Agent payout tracking

## Files

- `src/pages/AdminDashboard.tsx` - Main dashboard component
- `src/App.tsx` - Route added

## Testing

1. Navigate to `/admin/dashboard`
2. Verify all stats load correctly
3. Check alerts display for overdue/suspended shops
4. Test quick action buttons
5. Test refresh button
