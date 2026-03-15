# Member History - Transaction Transparency

## Overview
Personal transaction timeline showing every reward earned/spent with complete audit trail for member trust and accountability.

## Features

### Transaction Timeline
Chronological list of all member transactions with:
- Date & time
- Shop name
- Transaction type (Earn/Spend)
- Amount
- Policy impact
- Sync status

### Summary Statistics
- **Total Earned**: Sum of all earned rewards
- **Total Spent**: Sum of all spent rewards
- **Current Balance**: Earned - Spent
- **Policies Funded**: Count of completed policies

### Filters
- **Type**: All Transactions, Earned Only, Spent Only, Policy Funded
- **Period**: This Month, Last Month, All Time
- **Shop**: All Shops or specific shop

### Transaction Details
Each transaction shows:
- 💰 Earned from Shop / 💸 Spent at Shop
- Date and time
- Amount (±R format)
- Policy funded indicator (✅)
- Sync status (✓ Synced, ⏳ Pending, ↩️ Reverted)

### Export
- CSV download for records
- Includes: Date, Shop, Type, Amount, Policy, Status
- File format: `member-history-YYYY-MM-DD.csv`

## Data Sources
- `transactions` table - All member transactions
- `shops` table - Shop names
- Filtered by `member_id = current_user`

## Member Value
✅ "I can prove my rewards balance to anyone"
✅ "Clear audit trail if disputes arise"
✅ "Export for tax/accounting"
✅ "See exactly how close to next policy"

## Transaction Types

**Earn**: +R amount from shop purchase
- Shows policy progress
- Indicates which policy was funded

**Spend**: -R amount at shop
- Reduces available balance
- Tracked for transparency

**Policy Funded**: ✅ Auto-paid policy
- Shows policy name
- Marks completion

## Sync Status

- **✓ Synced**: Transaction confirmed in database
- **⏳ Pending**: Waiting for sync (offline transaction)
- **↩️ Reverted**: Transaction was reversed

## Access

Navigate to `/member/history` from member dashboard

## Testing Checklist

- [ ] Load member history page
- [ ] Verify summary stats calculate correctly
- [ ] Filter by transaction type (all, earn, spend, policy)
- [ ] Filter by period (this month, last month, all time)
- [ ] Filter by shop
- [ ] Verify transaction timeline displays chronologically
- [ ] Check policy funded indicators show correctly
- [ ] Verify sync status badges display
- [ ] Test CSV export
- [ ] Verify trust message displays

## Files

- `src/pages/MemberHistory.tsx` - Main history component
- `src/App.tsx` - Route added

## Next Pages

- `/member/qr` - Full-screen QR code display
- `/shop/history` - Shop transaction history
