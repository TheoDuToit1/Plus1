# Deployment Fixes - Complete Summary

## Issues Fixed

### 1. ✅ Environment Variables Error
**Problem:** Vercel deployment failed with "Secret 'vite_supabase_url' does not exist"
**Solution:** Removed `env` sections from `plus1-rewards/vercel.json` and `plus1-go/vercel.json` since environment variables are already set in Vercel Dashboard.

### 2. ✅ Missing fs-extra Module
**Problem:** Build failed with "Cannot find module 'fs-extra'"
**Solution:** Updated `vercel.json` install command to include root `npm install`:
```json
"installCommand": "npm install && npm install --prefix plus1-rewards && npm install --prefix plus1-go"
```

### 3. ✅ Images Not Loading on Live Deployment
**Problem:** Images show on localhost but not on production
**Solution:** 
- Updated `scripts/combine-builds.js` to copy shared images to `/go/` folder
- Ensured proper routing in `vercel.json` for static assets

### 4. ✅ /go Path Not Working
**Problem:** `/go` path returns 404 or doesn't route to Plus1-Go
**Solution:** Updated `vercel.json` with proper routes configuration:
```json
{
  "routes": [
    { "src": "/go/assets/(.*)", "dest": "/go/assets/$1" },
    { "src": "/go/(.*)", "dest": "/go/index.html" },
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*\\.(png|jpg|jpeg|gif|svg|ico|pdf|json|js|css))", "dest": "/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### 5. ✅ Unified Authentication
**Problem:** Registration page redirected to `/member/login` instead of `/login`
**Solution:** Updated `plus1-rewards/src/pages/MemberRegister.tsx` to redirect to `/login?platform=${platform}`

## Files Modified

1. `vercel.json` (root) - Updated install command and routes
2. `plus1-rewards/vercel.json` - Removed env section
3. `plus1-go/vercel.json` - Removed env section
4. `scripts/combine-builds.js` - Added shared image copying
5. `plus1-rewards/src/pages/MemberRegister.tsx` - Fixed redirect path
6. `.vercelignore` - Created to exclude unnecessary files

## Deployment Instructions

### Option 1: Automatic (Git Push)
```bash
git add .
git commit -m "Fix deployment issues - images, routing, and build"
git push origin main
```
Vercel will automatically deploy from GitHub.

### Option 2: Manual (Vercel CLI)
```bash
vercel --prod
```

## Expected Results After Deployment

### Plus1-Rewards (Root Path)
- ✅ Homepage: https://www.plus1rewards.com
- ✅ Login: https://www.plus1rewards.com/login
- ✅ Register: https://www.plus1rewards.com/register
- ✅ Images load correctly (logo.png, background images, etc.)

### Plus1-Go (Sub Path)
- ✅ Homepage: https://www.plus1rewards.com/go
- ✅ Dashboard: https://www.plus1rewards.com/go/dashboard
- ✅ Login redirect: https://www.plus1rewards.com/go/login → redirects to /login?platform=go
- ✅ Images load correctly from /go/ path

### Unified Authentication
- ✅ Login at `/login` without platform param → redirects to `/member/dashboard`
- ✅ Login at `/login?platform=go` → redirects to `/go/dashboard`
- ✅ Register at `/register` → redirects to `/login`
- ✅ Register at `/register?platform=go` → redirects to `/login?platform=go`

## Verification Checklist

After deployment completes:

- [ ] Visit https://www.plus1rewards.com - Plus1-Rewards loads
- [ ] Check browser DevTools - No 404 errors for images
- [ ] Visit https://www.plus1rewards.com/go - Plus1-Go loads
- [ ] Check /go page - Images load correctly
- [ ] Test login flow - Both platforms work
- [ ] Test registration - Redirects work correctly
- [ ] Check mobile responsiveness
- [ ] Verify all navigation links work

## Build Output Structure

```
dist/
├── index.html                          ← Plus1-Rewards entry
├── assets/
│   ├── index-[hash].css               ← Plus1-Rewards styles
│   └── index-[hash].js                ← Plus1-Rewards scripts
├── logo.png                            ← Shared images
├── plus1-go logo.png
├── background hero section.png
├── day1health-logo.jpg
├── favicon.svg
├── manifest.json
└── go/
    ├── index.html                      ← Plus1-Go entry
    ├── assets/
    │   ├── index-[hash].css           ← Plus1-Go styles
    │   └── index-[hash].js            ← Plus1-Go scripts
    ├── logo.png                        ← Copied for /go path
    └── plus1-go logo.png               ← Copied for /go path
```

## Troubleshooting

### If deployment still fails:

1. **Check Vercel build logs** for specific errors
2. **Verify environment variables** are set in Vercel Dashboard
3. **Test build locally:**
   ```bash
   npm run build:all
   npx serve dist -p 3000
   ```
4. **Clear Vercel cache:**
   - Go to Vercel Dashboard → Deployments
   - Click "..." → Redeploy → Check "Use existing Build Cache" OFF

### If images still don't load:

1. Check browser DevTools Network tab
2. Verify image paths (should be `/logo.png` for root, `/go/logo.png` for /go)
3. Check if images exist in deployment (Vercel → Deployment → Source)

### If /go returns 404:

1. Verify `dist/go/index.html` exists after build
2. Check Vercel project settings → Root Directory is empty or `./`
3. Verify routes in vercel.json are correct

## Next Steps

1. Commit and push all changes
2. Wait for Vercel deployment to complete
3. Test all URLs and functionality
4. Update Supabase redirect URLs if needed:
   - https://www.plus1rewards.com/**
   - https://www.plus1rewards.com/go/**

## Support

If issues persist:
1. Check Vercel deployment logs
2. Test locally with `npm run build:all && npx serve dist`
3. Verify all environment variables are set
4. Ensure Node.js version is 18+ in Vercel settings

---

**Status:** ✅ All fixes applied and ready for deployment
**Last Updated:** 2026-03-28
