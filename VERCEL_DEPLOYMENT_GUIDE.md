# Vercel Deployment Guide for Plus1 Ecosystem

## Overview
This guide will help you deploy both Plus1-Rewards and Plus1-Go to Vercel as separate projects that share the same Supabase database.

---

## Prerequisites

1. **Vercel Account:** Sign up at https://vercel.com
2. **GitHub Repository:** Push your code to GitHub
3. **Supabase Credentials:** Have your Supabase URL and keys ready

---

## Project Structure

```
Plus1/
├── plus1-rewards/          # Project 1 (Rewards Platform)
│   ├── vercel.json         ✅ Created
│   ├── package.json
│   └── src/
└── plus1-go/               # Project 2 (Delivery Platform)
    ├── vercel.json         ✅ Created
    ├── package.json
    └── src/
```

---

## Deployment Strategy

### Option 1: Monorepo (Recommended)
Deploy both projects from a single GitHub repository using Vercel's monorepo support.

### Option 2: Separate Repositories
Split into two GitHub repos and deploy separately.

---

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# If not already initialized
cd Plus1
git init
git add .
git commit -m "Initial commit: Plus1 Rewards and Plus1 Go"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/plus1-ecosystem.git
git branch -M main
git push -u origin main
```

---

### 2. Deploy Plus1-Rewards to Vercel

#### A. Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

```
Project Name: plus1-rewards
Framework Preset: Vite
Root Directory: plus1-rewards
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add Environment Variables:
```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_SUPABASE_SERVICE_ROLE=[your-service-role-key]
```

6. Click **"Deploy"**

#### B. Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to plus1-rewards
cd plus1-rewards

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: plus1-rewards
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_SERVICE_ROLE

# Deploy to production
vercel --prod
```

---

### 3. Deploy Plus1-Go to Vercel

#### A. Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import the SAME GitHub repository
4. Configure the project:

```
Project Name: plus1-go
Framework Preset: Vite
Root Directory: plus1-go
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add Environment Variables (SAME as Plus1-Rewards):
```
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_SUPABASE_SERVICE_ROLE=[your-service-role-key]
```

6. Click **"Deploy"**

#### B. Via Vercel CLI

```bash
# Navigate to plus1-go
cd ../plus1-go

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: plus1-go
# - Directory: ./
# - Override settings? No

# Add environment variables (same as rewards)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_SERVICE_ROLE

# Deploy to production
vercel --prod
```

---

## Expected Deployment URLs

After deployment, you'll get:

**Vercel Default URLs:**
```
Plus1-Rewards: https://plus1-rewards.vercel.app
Plus1-Go:      https://plus1-go.vercel.app
```

**Your Custom Domains:**
```
Plus1-Rewards: https://www.plus1rewards.com (main domain)
Plus1-Go:      https://go.plus1rewards.com (subdomain)
```

---

## Environment Variables Setup

### Required Variables (Both Projects)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://gcbmlxdxwakkubpldype.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_SERVICE_ROLE` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### How to Add Environment Variables

#### Via Vercel Dashboard:
1. Go to project settings
2. Navigate to **"Environment Variables"**
3. Add each variable
4. Select environments: Production, Preview, Development
5. Click **"Save"**

#### Via Vercel CLI:
```bash
vercel env add VITE_SUPABASE_URL production
# Paste value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste value when prompted

vercel env add VITE_SUPABASE_SERVICE_ROLE production
# Paste value when prompted
```

---

## Vercel Configuration Files

### plus1-rewards/vercel.json
```json
{
  "version": 2,
  "name": "plus1-rewards",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### plus1-go/vercel.json
```json
{
  "version": 2,
  "name": "plus1-go",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**What these do:**
- Enable SPA routing (all routes go to index.html)
- Serve static assets from /assets/
- Configure build output directory

---

## Custom Domain Setup (Optional)

### 1. Add Custom Domain in Vercel

#### For Plus1-Rewards (Main Domain):
1. Go to Vercel Dashboard → Plus1-Rewards project
2. Navigate to **Settings** → **"Domains"**
3. Add domains:
   - `plus1rewards.com`
   - `www.plus1rewards.com`
4. Follow DNS configuration instructions

#### For Plus1-Go (Subdomain):
1. Go to Vercel Dashboard → Plus1-Go project
2. Navigate to **Settings** → **"Domains"**
3. Add domain:
   - `go.plus1rewards.com`
4. Follow DNS configuration instructions

### 2. DNS Configuration

Add these records to your DNS provider (where you registered plus1rewards.com):

#### For Main Domain (Plus1-Rewards):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: A
Name: www
Value: 76.76.21.21
TTL: 3600
```

Or use CNAME for www:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### For Subdomain (Plus1-Go):
```
Type: CNAME
Name: go
Value: cname.vercel-dns.com
TTL: 3600
```

Or use A record:
```
Type: A
Name: go
Value: 76.76.21.21
TTL: 3600
```

---

## Automatic Deployments

### Enable Auto-Deploy from GitHub

1. Go to project settings → **"Git"**
2. Connect to GitHub repository
3. Configure:
   - **Production Branch:** `main`
   - **Preview Branches:** All branches
4. Every push to `main` will auto-deploy

### Branch Deployments

```bash
# Create feature branch
git checkout -b feature/new-auth

# Make changes and push
git add .
git commit -m "Add new auth feature"
git push origin feature/new-auth

# Vercel automatically creates preview deployment
# URL: https://plus1-rewards-git-feature-new-auth.vercel.app
```

---

## Build Optimization

### 1. Add Build Output Caching

Both projects already use Vite which has built-in caching.

### 2. Optimize Bundle Size

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['framer-motion', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 3. Enable Compression

Vercel automatically enables:
- Gzip compression
- Brotli compression
- HTTP/2 push

---

## Monitoring & Analytics

### Enable Vercel Analytics

1. Go to project settings → **"Analytics"**
2. Enable **"Web Analytics"**
3. Add to your app:

```bash
npm install @vercel/analytics
```

```typescript
// In main.tsx or App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Enable Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

---

## Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** `Environment variable not found`
```bash
# Solution: Check .env.local exists and has correct format
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Routes Not Working (404 on refresh)

**Problem:** SPA routes return 404 on page refresh

**Solution:** Ensure `vercel.json` has correct routing:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Environment Variables Not Loading

**Problem:** `import.meta.env.VITE_*` is undefined

**Solutions:**
1. Ensure variables start with `VITE_`
2. Restart dev server after adding variables
3. Check Vercel dashboard has variables set
4. Redeploy after adding variables

### CORS Errors

**Problem:** Supabase requests blocked by CORS

**Solution:** Add your Vercel domains to Supabase:
1. Go to Supabase Dashboard → Settings → API
2. Add to **"Site URL"**: `https://www.plus1rewards.com`
3. Add to **"Redirect URLs"**:
   - `https://www.plus1rewards.com/**`
   - `https://go.plus1rewards.com/**`
   - `https://plus1-rewards.vercel.app/**`
   - `https://plus1-go.vercel.app/**`

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables documented
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] Supabase credentials ready

### Plus1-Rewards Deployment
- [ ] Project created on Vercel
- [ ] Root directory set to `plus1-rewards`
- [ ] Environment variables added
- [ ] Build succeeds on Vercel
- [ ] Site accessible at deployment URL
- [ ] Login/registration works
- [ ] Database connection works

### Plus1-Go Deployment
- [ ] Project created on Vercel
- [ ] Root directory set to `plus1-go`
- [ ] Environment variables added (same as Rewards)
- [ ] Build succeeds on Vercel
- [ ] Site accessible at deployment URL
- [ ] Login/registration works
- [ ] Database connection works

### Post-Deployment
- [ ] Both sites accessible
- [ ] Unified auth works (register on one, login on other)
- [ ] Custom domains configured (if applicable)
- [ ] Analytics enabled
- [ ] Auto-deploy from GitHub enabled
- [ ] Team members added to Vercel projects

---

## Quick Deploy Commands

### Deploy Both Projects

```bash
# Deploy Plus1-Rewards
cd plus1-rewards
vercel --prod

# Deploy Plus1-Go
cd ../plus1-go
vercel --prod
```

### Update Environment Variables

```bash
# Update for Plus1-Rewards
cd plus1-rewards
vercel env rm VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_URL production

# Update for Plus1-Go
cd ../plus1-go
vercel env rm VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_URL production
```

### Rollback Deployment

```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote [deployment-url]
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Support:** https://vercel.com/support

---

## Summary

You now have:
1. ✅ `vercel.json` configured for both projects
2. ✅ Build scripts ready in `package.json`
3. ✅ Environment variable structure defined
4. ✅ Deployment strategy documented
5. ✅ Troubleshooting guide available

**Next Steps:**
1. Push code to GitHub
2. Deploy Plus1-Rewards to Vercel
3. Deploy Plus1-Go to Vercel
4. Test unified authentication across both platforms
5. Configure custom domains (optional)

---

**Status:** Ready for Deployment  
**Date:** March 28, 2026  
**Deployment URLs:** TBD after deployment
