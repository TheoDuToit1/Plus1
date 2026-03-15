# Policy Plans Setup

## Problem
The Member Policy Selector page is getting a 400 error when trying to load policy plans from Supabase.

## Solution
Run the SQL setup script to create the `policy_plans` table and add Day1 Health plan data.

## Steps

1. Go to https://app.supabase.com
2. Select **plus1-rewards** project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the contents of `SETUP_POLICY_PLANS.sql`
5. Click **Run**

## What This Does
- Creates `policy_plans` table with columns for family, plan type, and pricing
- Enables RLS (Row Level Security)
- Creates policy allowing authenticated users to read plans
- Inserts 4 Day1 Health plan families:
  - **Day-to-Day**: R385 (single), R674 (couple), +R193/child
  - **Hospital**: R390 (single), R780 (couple), +R156/child
  - **Comprehensive**: R665 (single), R1,330 (couple), +R266/child
  - **Senior**: R425 (single), R850 (couple) - no children

## After Setup
The Member Policy Selector page should now:
- Load all 4 plan families
- Allow members to select coverage type (Single/Couple)
- Allow members to select number of children (0-4)
- Calculate and display monthly target amount
- Save the selected policy to the member's account
