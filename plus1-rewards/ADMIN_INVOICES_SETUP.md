# Admin Invoices - Revenue Control Center

## Overview
Complete invoice management dashboard for tracking shop payments, revenue collection, and Day1 Health payouts.

## Features

### Invoice Table
Columns: Shop | Amount Due | Due Date | Status | Penalty | Actions

**Status Indicators:**
- 📄 Generated - Invoice created
- ⚠️ Overdue - Past due date
- ✓ Paid - Payment received
- 🔴 Suspended - Shop suspended for non-payment

### Filters & Search
- **Status Filter**: All, Generated, Overdue, Paid, Suspended
- **Month Filter**: Current Month, Previous Month
- **Shop Search**: Real-time search by shop name

### Bulk Operations
- **Select Multiple**: Checkbox to select invoices
- **Mark Paid**: Bulk mark selected invoices as paid
- **Individual Actions**: Pay, Add Penalty, Suspend

### Quick Actions
- 📄 Generate All Invoices - Runs automatically Day 28
- 📊 Export CSV - Download for accounting
- 🔄 Refresh - Manual data refresh

### Stats Cards
- **Total Due**: Sum of all invoice amounts
- **Total Paid**: Sum of paid invoices
- **Overdue**: Count of overdue invoices
- **Day1 Payout (90%)**: 90% of paid invoices for policy provider

### Automation Status
- Shows next invoice generation date (Day 28)
- Displays invoice generation progress

## Data Sources
- `monthly_invoices` - Invoice details, status, amounts
- `shops` - Shop names and IDs

## Invoice Workflow

```
Day 28 00:01
    ↓
Generate all invoices
    ↓
Status: "generated"
    ↓
Day 31 (Due Date)
    ↓
If unpaid → Status: "overdue"
    ↓
Day 7 unpaid → Auto-suspend shop
    ↓
Shop pays EFT → Status: "paid"
    ↓
Day 5 next month → Pay agents (1%)
    ↓
Day 10 next month → Pay Day1 Health (90%)
```

## Actions Available

### Mark as Paid
- Updates status to "paid"
- Records paid_date as current timestamp
- Single or bulk operation

### Add Penalty
- Adds 2% penalty to overdue invoices
- Updates penalty_amount field
- Increases total due

### Suspend Shop
- Updates invoice status to "suspended"
- Updates shop status to "suspended"
- Prevents further transactions

## Revenue Calculations

**Total Due**: Sum of all invoice total_due amounts

**Total Paid**: Sum of invoices with status = "paid"

**Day1 Payout**: Total Paid × 0.90 (90% to policy provider)

**Agent Payout**: Total Paid × 0.01 (1% to agents)

**Platform Revenue**: Total Paid × 0.01 (1% to platform)

## CSV Export

Exports filtered invoices with columns:
- Shop name
- Amount Due (R format)
- Due Date
- Status
- Penalty Amount

File format: `invoices-YYYY-MM-DD.csv`

## Access

Navigate to `/admin/invoices` from admin dashboard

## Testing Checklist

- [ ] Load invoices from database
- [ ] Filter by status (all, generated, overdue, paid, suspended)
- [ ] Filter by month (current, previous)
- [ ] Search by shop name
- [ ] Select single invoice
- [ ] Select multiple invoices
- [ ] Mark single invoice as paid
- [ ] Mark multiple invoices as paid
- [ ] Add penalty to overdue invoice
- [ ] Suspend shop from overdue invoice
- [ ] Export CSV
- [ ] Verify stats calculations
- [ ] Test refresh button

## Files

- `src/pages/AdminInvoices.tsx` - Main invoices component
- `src/App.tsx` - Route added

## Next Pages

- `/admin/suspensions` - Suspension management
- `/admin/agents` - Agent payout tracking
