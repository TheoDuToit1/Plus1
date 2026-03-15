# Admin Suspensions - Risk Control Center

## Overview
Monitor and reactivate suspended shops. Prevents revenue loss and protects member rewards.

## Features

### Suspended Shops Table
Columns: Shop | Invoice | Days Overdue | Members Affected | Penalty | Actions

**Status Indicators:**
- Day count badge (red)
- Members affected badge (blue)
- Penalty amount display

### Recovery Stats
- **Suspended Shops**: Count of suspended shops
- **Revenue Lost**: Total invoice amount from suspended shops
- **Members Waiting**: Total members affected across all suspended shops
- **Avg Days Suspended**: Average suspension duration

### Early Warning System
- Identifies shops Day 4+ overdue (before Day 7 suspension)
- Shows at-risk shops with invoice details
- "Send Reminder" button for each at-risk shop

### Reactivation Controls
- **Reactivate**: Mark invoice as paid + reactivate shop
- **Send Reminder**: Email + PWA push notification
- **Extend Grace Period**: Convert suspension back to generated status

### Actions Per Shop
- **Reactivate** - Full payment + 2% penalty applied
- **Remind** - Send payment reminder to shop
- **Extend** - Give additional grace period (high-value shops)

## Data Sources
- `monthly_invoices.status = 'suspended'` - Suspended invoices
- `shops.status = 'suspended'` - Suspended shops
- `wallets` - Members per shop (affected count)
- `transactions` - Revenue impact

## Suspension Workflow

```
Day 28: Invoice generated
    ↓
Day 31: Due date
    ↓
Day 4: Early warning (send reminder)
    ↓
Day 7: Auto-suspend shop
    ↓
Members: Rewards PAUSED
    ↓
Shop pays: Reactivate instantly
    ↓
Members: Rewards RESUME
```

## Actions Available

### Reactivate Shop
- Updates invoice status to "paid"
- Records paid_date as current timestamp
- Updates shop status to "active"
- Resumes member rewards immediately

### Send Reminder
- Sends email notification to shop
- Sends PWA push notification
- Encourages payment before Day 7 suspension

### Extend Grace Period
- Converts suspension back to "generated" status
- Gives additional time for payment
- Use for high-value shops

## Impact Metrics

**Revenue Lost**: Sum of all suspended invoice amounts

**Members Affected**: Total count of members across all suspended shops

**Days Overdue**: Calculated from due_date to today

**Penalty Amount**: 2% of invoice amount (applied on suspension)

## Prevention Strategy

**Early Warning (Day 4+):**
- Identifies shops before auto-suspension
- Allows proactive intervention
- Send reminders to prevent suspension

**High-Value Shop Recovery:**
- Extend grace period for important shops
- Negotiate payment plans
- Prevent revenue loss

**Reactivation Rate:**
- Target: 85%+ shops reactivated
- Tracks recovery success
- Measures risk management effectiveness

## Access

Navigate to `/admin/suspensions` from admin dashboard

## Testing Checklist

- [ ] Load suspended shops from database
- [ ] Display early warning shops (Day 4+ overdue)
- [ ] Calculate recovery stats correctly
- [ ] Reactivate single shop
- [ ] Send reminder to shop
- [ ] Extend grace period
- [ ] Verify shop status changes to active
- [ ] Verify invoice status changes to paid
- [ ] Test refresh button
- [ ] Verify members affected count

## Files

- `src/pages/AdminSuspensions.tsx` - Main suspensions component
- `src/App.tsx` - Route added

## Next Pages

- `/admin/agents` - Agent payout tracking
- `/admin/dashboard` - Back to main dashboard
