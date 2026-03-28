# Update Existing Vercel Project Guide

## Current Situation
- ✅ Plus1-Rewards is already deployed on Vercel
- ✅ Combined build is ready (includes Plus1-Go at `/go`)
- 🎯 Goal: Update existing deployment to include Plus1-Go

---

## Step-by-Step Instructions

### Step 1: Deploy with Vercel CLI

Open your terminal and run:

```bash
vercel --prod
```

### Step 2: Answer the Prompts

#### Prompt 1: "Set up and deploy?"
```
? Set up and deploy "~/Plus1"? [Y/n]
Answer: Y (press Enter)
```

#### Prompt 2: "Which scope?"
```
? Which scope do you want to deploy to?
Answer: Select your account/team
```

#### Prompt 3: "Link to existing project?"
```
? Link to existing project? [y/N]
Answer: y (type 'y' and press Enter)
```

#### Prompt 4: "What's the name of your existing project?"
```
? What's the name of your existing project?
Answer: [Type your existing project name, probably "plus1-rewards"]
```

#### Prompt 5: "Want to override the settings?"
```
? Want to override the settings? [y/N]
Answer: y (type 'y' and press Enter)
```

#### Prompt 6: "Which settings would you like to override?"
```
? Which settings would you like to override?
Answer: Select all:
  [x] Build Command
  [x] Output Directory
  [x] Install Command
  [x] Development Command
```

#### Prompt 7: "Build Command"
```
? Build Command:
Answer: npm run build:all
```

#### Prompt 8: "Output Directory"
```
? Output Directory:
Answer: dist
```

#### Prompt 9: "Install Command"
```
? Install Command:
Answer: npm install --prefix plus1-rewards && npm install --prefix plus1-go
```

#### Prompt 10: "Development Command"
```
? Development Command:
Answer: (leave empty, press Enter)
```

### Step 3: Wait for Deployment

Vercel will now:
1. ✅ Upload your files
2. ✅ Install dependencies
3. ✅ Run `npm run build:all`
4. ✅ Deploy to production

This takes about 2-3 minutes.

---

## Alternative: Update via Vercel Dashboard

If you prefer using the web interface:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on your existing Plus1-Rewards project

### 3. Go to Settings
Click **Settings** tab

### 4. Update Build & Development Settings

Navigate to **Build & Development Settings** and update:

```
Framework Preset: Other

Build Command:
npm run build:all

Output Directory:
dist

Install Command:
npm install --prefix plus1-rewards && npm install --prefix plus1-go

Root Directory:
./
```

Click **Save**

### 5. Update Environment Variables

Navigate to **Environment Variables** and ensure these exist:

```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
VITE_SUPABASE_SERVICE_ROLE=[your-key]
```

Make sure they're enabled for:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Trigger New Deployment

Go to **Deployments** tab and click **Redeploy**

Or push a new commit to your GitHub repository to trigger auto-deploy.

---

## Verify Deployment

After deployment completes, test these URLs:

### Test Plus1-Rewards (Should still work)
```
✅ https://www.plus1rewards.com/
✅ https://www.plus1rewards.com/login
✅ https://www.plus1rewards.com/member/dashboard
```

### Test Plus1-Go (NEW!)
```
✅ https://www.plus1rewards.com/go
✅ https://www.plus1rewards.com/go/dashboard
✅ https://www.plus1rewards.com/go/browse
```

---

## What Changed?

### Before
```
www.plus1rewards.com/
├── index.html (Plus1-Rewards)
└── assets/ (Plus1-Rewards only)
```

### After
```
www.plus1rewards.com/
├── index.html (Plus1-Rewards)
├── assets/ (Plus1-Rewards)
└── go/
    ├── index.html (Plus1-Go)
    └── assets/ (Plus1-Go)
```

---

## Troubleshooting

### Issue: "Project not found"
**Solution:** Make sure you're logged into the correct Vercel account
```bash
vercel logout
vercel login
vercel --prod
```

### Issue: "Build failed"
**Solution:** Check the build logs in Vercel dashboard
- Common issue: Missing environment variables
- Fix: Add them in Settings → Environment Variables

### Issue: "/go routes return 404"
**Solution:** Ensure `vercel.json` is in the root directory
- Check that rewrites are configured correctly
- Redeploy after adding `vercel.json`

### Issue: "Assets not loading on /go"
**Solution:** Check browser console
- Verify Plus1-Go was built with `base: '/go/'`
- Rebuild: `npm run build:all`
- Redeploy: `vercel --prod`

---

## Expected Deployment Output

```
🔍  Inspect: https://vercel.com/[your-account]/[project]/[deployment-id]
✅  Production: https://www.plus1rewards.com [2m]
```

---

## Post-Deployment Checklist

- [ ] Visit `www.plus1rewards.com` → Plus1-Rewards loads
- [ ] Visit `www.plus1rewards.com/go` → Plus1-Go loads
- [ ] Test login on both paths
- [ ] Test registration on both paths
- [ ] Click "Order Online" from Rewards → Goes to /go
- [ ] Click "Rewards" from Go → Goes back to /
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Update Supabase allowed URLs

---

## Need to Rollback?

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click the three dots (•••)
4. Click "Promote to Production"

This instantly reverts to the previous version.

---

## Summary

Your deployment will:
- ✅ Keep Plus1-Rewards at root path `/`
- ✅ Add Plus1-Go at `/go` path
- ✅ Use same domain `www.plus1rewards.com`
- ✅ Share same environment variables
- ✅ Maintain existing functionality

**Ready to deploy?** Run: `vercel --prod`
