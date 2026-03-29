# Vercel Deployment Fix Guide

## Issues Identified
1. Images not loading on live deployment
2. `/go` path not routing to Plus1-Go project
3. Vercel may be using wrong root directory

## Solution Steps

### Step 1: Verify Vercel Project Settings

Go to your Vercel Dashboard → Project Settings → General

**Root Directory:** `./` (leave empty or set to root)

**Build & Development Settings:**
- Framework Preset: `Other`
- Build Command: `npm run build:all`
- Output Directory: `dist`
- Install Command: `npm install --prefix plus1-rewards && npm install --prefix plus1-go`

### Step 2: Verify Environment Variables

Go to Settings → Environment Variables

Ensure these are set for **Production, Preview, and Development**:
```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
VITE_SUPABASE_SERVICE_ROLE=[your-key]
VITE_APP_URL=https://www.plus1rewards.com
```

### Step 3: Deploy

```bash
# Commit all changes
git add .
git commit -m "Fix Vercel deployment routing and images"
git push origin main

# Or deploy directly
vercel --prod
```

### Step 4: Test After Deployment

1. **Test Plus1-Rewards:**
   - https://www.plus1rewards.com → Should show Plus1-Rewards homepage with images
   - https://www.plus1rewards.com/login → Should show login page

2. **Test Plus1-Go:**
   - https://www.plus1rewards.com/go → Should show Plus1-Go homepage
   - Login from Go redirects to unified member dashboard at /member/dashboard

3. **Test Images:**
   - Open browser DevTools → Network tab
   - Check if images return 200 status (not 404)
   - Images should load from:
     - `/logo.png` for Plus1-Rewards
     - `/go/logo.png` for Plus1-Go

## Troubleshooting

### If `/go` still returns 404:

1. Check Vercel build logs for errors
2. Verify `dist/go/index.html` exists in deployment
3. Check Vercel Functions tab - ensure no serverless functions are interfering

### If images still don't load:

1. Check if images are in `dist/` folder after build
2. Verify image paths in browser DevTools Network tab
3. Ensure images are not being blocked by CSP headers

### If build fails:

1. Check that both projects build individually:
   ```bash
   cd plus1-rewards && npm run build
   cd ../plus1-go && npm run build
   ```

2. Check root package.json scripts are correct

3. Verify Node version (should be 18+)

## Expected File Structure After Build

```
dist/
├── index.html                          (Plus1-Rewards)
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── logo.png                            ✓ Shared images at root
├── plus1-go logo.png                   ✓
├── background hero section.png         ✓
├── day1health-logo.jpg                 ✓
└── go/
    ├── index.html                      (Plus1-Go)
    ├── assets/
    │   ├── index-[hash].css
    │   └── index-[hash].js
    ├── logo.png                        ✓ Copied for /go path
    └── plus1-go logo.png               ✓
```

## Quick Fix Commands

```bash
# Clean and rebuild everything
rm -rf dist plus1-rewards/dist plus1-go/dist
npm run build:all

# Test locally
npx serve dist -p 3000

# Deploy
vercel --prod
```
