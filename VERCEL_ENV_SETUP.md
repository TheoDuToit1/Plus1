# Fix Vercel Deployment - Add Environment Variables

## Error
```
Environment Variable "VITE_SUPABASE_URL" references Secret "vite_supabase_url", which does not exist.
```

## Solution: Add Environment Variables in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project (plus1-rewards or plus1-ecosystem)
3. Click on **Settings** tab

### Step 2: Navigate to Environment Variables
1. In the left sidebar, click **Environment Variables**
2. You'll see a form to add new variables

### Step 3: Add Required Variables

Add these 3 environment variables:

#### Variable 1: VITE_SUPABASE_URL
```
Key: VITE_SUPABASE_URL
Value: https://gcbmlxdxwakkubpldype.supabase.co
```
- Select: ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Key: VITE_SUPABASE_ANON_KEY
Value: [Your Supabase Anon Key - get from Supabase Dashboard]
```
- Select: ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 3: VITE_SUPABASE_SERVICE_ROLE
```
Key: VITE_SUPABASE_SERVICE_ROLE
Value: [Your Supabase Service Role Key - get from Supabase Dashboard]
```
- Select: ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Step 4: Get Your Supabase Keys

1. Go to: https://app.supabase.com
2. Select your project: `gcbmlxdxwakkubpldype`
3. Click **Settings** (gear icon in sidebar)
4. Click **API** in the left menu
5. Copy the keys:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** → Use for `VITE_SUPABASE_SERVICE_ROLE`

### Step 5: Redeploy

After adding all environment variables:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**
4. Confirm

**Option B: Via Git Push**
```bash
git add .
git commit -m "Add environment variables"
git push
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

---

## Quick Reference

### Environment Variables Needed:
```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_SUPABASE_SERVICE_ROLE=[your-service-role-key]
```

### Where to Add:
- Vercel Dashboard → Project → Settings → Environment Variables

### Environments to Select:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## Alternative: Add via Vercel CLI

If you prefer using the command line:

```bash
# Add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_URL production
# Paste: https://gcbmlxdxwakkubpldype.supabase.co

# Add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your anon key

# Add VITE_SUPABASE_SERVICE_ROLE
vercel env add VITE_SUPABASE_SERVICE_ROLE production
# Paste your service role key

# Redeploy
vercel --prod
```

---

## Troubleshooting

### Issue: "Secret does not exist"
**Solution:** Make sure you're adding the variables as **plain text**, not as secrets. In the Vercel dashboard, just paste the value directly.

### Issue: Variables not loading
**Solution:** 
1. Ensure all 3 environments are checked (Production, Preview, Development)
2. Redeploy after adding variables
3. Clear browser cache and test again

### Issue: Still getting errors
**Solution:**
1. Check variable names are EXACTLY: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_SERVICE_ROLE`
2. No extra spaces in keys or values
3. Values should NOT have quotes around them

---

## After Adding Variables

Your deployment should succeed and you'll see:

```
✅ Build successful
✅ Deployment ready
🌐 https://www.plus1rewards.com
```

Then test:
- Visit: `https://www.plus1rewards.com`
- Visit: `https://www.plus1rewards.com/go`
- Click "Sign In" → Should show login page
- Try logging in → Should work

---

**Status:** Waiting for environment variables to be added  
**Next Step:** Add the 3 environment variables in Vercel Dashboard, then redeploy
