# Path-Based Deployment Strategy

## Domain Structure

**Single Domain:** `https://www.plus1rewards.com`

### URL Paths

```
Plus1-Rewards (Root):
├── https://www.plus1rewards.com/
├── https://www.plus1rewards.com/member/dashboard
├── https://www.plus1rewards.com/partner/dashboard
├── https://www.plus1rewards.com/agent/dashboard
├── https://www.plus1rewards.com/admin/dashboard
└── https://www.plus1rewards.com/login

Plus1-Go (Under /go):
├── https://www.plus1rewards.com/go
├── https://www.plus1rewards.com/go/dashboard
├── https://www.plus1rewards.com/go/browse
├── https://www.plus1rewards.com/go/partner/[id]
├── https://www.plus1rewards.com/go/cart
├── https://www.plus1rewards.com/go/checkout
└── https://www.plus1rewards.com/go/orders
```

---

## Implementation Approach

### Option A: Vercel Monorepo with Rewrites (RECOMMENDED)

Deploy both projects to Vercel and use rewrites to route paths.

### Option B: Single Vite Project with Nested Routes

Merge both projects into one and use React Router for all routing.

---

## RECOMMENDED: Option A - Vercel Rewrites

### Step 1: Project Structure

```
Plus1/
├── plus1-rewards/          # Main app (root paths)
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── plus1-go/               # Go app (/go/* paths)
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── vercel.json             # Root config (handles routing)
```

### Step 2: Create Root Vercel Configuration

Create `vercel.json` at the root of your project:

```json
{
  "version": 2,
  "name": "plus1-ecosystem",
  "builds": [
    {
      "src": "plus1-rewards/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "plus1-rewards/dist"
      }
    },
    {
      "src": "plus1-go/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "plus1-go/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/go/assets/(.*)",
      "dest": "/plus1-go/dist/assets/$1"
    },
    {
      "src": "/go/(.*)",
      "dest": "/plus1-go/dist/index.html"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/plus1-rewards/dist/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/plus1-rewards/dist/index.html"
    }
  ]
}
```

### Step 3: Update Plus1-Go Base Path

Update `plus1-go/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/go/',  // Important: Set base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### Step 4: Update Plus1-Go Router

Update `plus1-go/src/AppRouter.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function AppRouter() {
  return (
    <BrowserRouter basename="/go">  {/* Add basename */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/partner/:id" element={<PartnerDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

### Step 5: Update Plus1-Rewards Links

Add links to Plus1-Go in Plus1-Rewards:

```typescript
// In Plus1-Rewards navigation/header
<a href="/go" className="nav-link">
  <span className="material-symbols-outlined">local_shipping</span>
  Order Online
</a>

// Or use React Router Link
import { Link } from 'react-router-dom';

<Link to="/go" className="nav-link">
  Order Online
</Link>
```

### Step 6: Update Plus1-Go Links

Add links back to Plus1-Rewards:

```typescript
// In Plus1-Go navigation/header
<a href="/" className="nav-link">
  <span className="material-symbols-outlined">add_circle</span>
  Rewards Dashboard
</a>

// Or use React Router Link
import { Link } from 'react-router-dom';

<Link to="/" className="nav-link">
  Rewards Dashboard
</Link>
```

---

## Alternative: Simpler Vercel Configuration

If the above is too complex, use this simpler approach:

### Create `vercel.json` at root:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/go/:path*",
      "destination": "https://plus1-go.vercel.app/:path*"
    },
    {
      "source": "/:path*",
      "destination": "https://plus1-rewards.vercel.app/:path*"
    }
  ]
}
```

This approach:
1. Deploy Plus1-Rewards to Vercel (gets URL: `plus1-rewards.vercel.app`)
2. Deploy Plus1-Go to Vercel (gets URL: `plus1-go.vercel.app`)
3. Add `www.plus1rewards.com` to Plus1-Rewards project
4. Use rewrites to proxy `/go/*` requests to Plus1-Go

---

## SIMPLEST APPROACH: Deploy Plus1-Go with Base Path

### Step 1: Update Plus1-Go Configuration

**File: `plus1-go/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/go/',
  build: {
    outDir: 'dist'
  }
})
```

**File: `plus1-go/src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/go">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**File: `plus1-go/src/AppRouter.tsx`**

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/partner/:id" element={<PartnerDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
```

### Step 2: Build Plus1-Go

```bash
cd plus1-go
npm run build
```

This creates `dist/` folder with all files configured for `/go/` base path.

### Step 3: Copy Plus1-Go Build to Plus1-Rewards

```bash
# After building plus1-go
cp -r plus1-go/dist plus1-rewards/public/go
```

Or create a build script:

**File: `build-combined.sh`**

```bash
#!/bin/bash

echo "Building Plus1-Go..."
cd plus1-go
npm run build
cd ..

echo "Building Plus1-Rewards..."
cd plus1-rewards
npm run build
cd ..

echo "Copying Plus1-Go to Plus1-Rewards..."
mkdir -p plus1-rewards/dist/go
cp -r plus1-go/dist/* plus1-rewards/dist/go/

echo "Build complete!"
echo "Deploy plus1-rewards/dist to Vercel"
```

### Step 4: Update Plus1-Rewards Vercel Config

**File: `plus1-rewards/vercel.json`**

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
      "src": "/go/assets/(.*)",
      "dest": "/go/assets/$1"
    },
    {
      "src": "/go/(.*)",
      "dest": "/go/index.html"
    },
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

### Step 5: Deploy to Vercel

```bash
cd plus1-rewards
vercel --prod
```

---

## RECOMMENDED FINAL APPROACH: Vercel Monorepo

This is the cleanest approach for your use case.

### Step 1: Create Root Configuration

**File: `vercel.json` (at root of Plus1 folder)**

```json
{
  "version": 2,
  "name": "plus1-ecosystem",
  "github": {
    "silent": true
  },
  "buildCommand": "npm run build:all",
  "outputDirectory": "dist",
  "installCommand": "npm install --prefix plus1-rewards && npm install --prefix plus1-go",
  "rewrites": [
    {
      "source": "/go/:path((?!assets).*)",
      "destination": "/go/index.html"
    },
    {
      "source": "/:path((?!assets|go).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Create Root Package.json

**File: `package.json` (at root of Plus1 folder)**

```json
{
  "name": "plus1-ecosystem",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build:rewards": "cd plus1-rewards && npm run build",
    "build:go": "cd plus1-go && npm run build",
    "build:all": "npm run build:rewards && npm run build:go && npm run combine",
    "combine": "node scripts/combine-builds.js"
  }
}
```

### Step 3: Create Build Combination Script

**File: `scripts/combine-builds.js`**

```javascript
const fs = require('fs-extra');
const path = require('path');

async function combineBuild() {
  console.log('Combining builds...');
  
  const distDir = path.join(__dirname, '..', 'dist');
  const rewardsDistDir = path.join(__dirname, '..', 'plus1-rewards', 'dist');
  const goDistDir = path.join(__dirname, '..', 'plus1-go', 'dist');
  
  // Clean dist directory
  await fs.emptyDir(distDir);
  
  // Copy Plus1-Rewards to root of dist
  console.log('Copying Plus1-Rewards...');
  await fs.copy(rewardsDistDir, distDir);
  
  // Copy Plus1-Go to dist/go
  console.log('Copying Plus1-Go to /go...');
  await fs.copy(goDistDir, path.join(distDir, 'go'));
  
  console.log('Build combination complete!');
}

combineBuild().catch(console.error);
```

Install fs-extra:
```bash
npm install --save-dev fs-extra
```

### Step 4: Update Plus1-Go Config

**File: `plus1-go/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/go/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

**File: `plus1-go/src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/go">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Step 5: Deploy

```bash
# From root of Plus1 folder
vercel --prod
```

---

## URL Structure After Deployment

```
Main Domain: https://www.plus1rewards.com

Plus1-Rewards Routes:
├── /                           → Home/Landing
├── /login                      → Unified Login
├── /register                   → Unified Register
├── /member/dashboard           → Member Dashboard
├── /member/profile             → Member Profile
├── /partner/dashboard          → Partner Dashboard
├── /partner/login              → Partner Login
├── /agent/dashboard            → Agent Dashboard
└── /admin/dashboard            → Admin Dashboard

Plus1-Go Routes:
├── /go                         → Go Home/Browse
├── /go/login                   → Go Login (redirects to /login?platform=go)
├── /go/register                → Go Register (redirects to /register?platform=go)
├── /go/dashboard               → Go Member Dashboard
├── /go/browse                  → Browse Partners
├── /go/partner/123             → Partner Detail
├── /go/cart                    → Shopping Cart
├── /go/checkout                → Checkout
└── /go/orders                  → Order History
```

---

## Navigation Between Apps

### In Plus1-Rewards Header

```tsx
<nav className="main-nav">
  <a href="/" className="nav-link">Home</a>
  <a href="/member/dashboard" className="nav-link">Dashboard</a>
  <a href="/go" className="nav-link highlight">
    <span className="material-symbols-outlined">local_shipping</span>
    Order Online
  </a>
</nav>
```

### In Plus1-Go Header

```tsx
<nav className="main-nav">
  <a href="/go" className="nav-link">Browse</a>
  <a href="/go/orders" className="nav-link">Orders</a>
  <a href="/member/dashboard" className="nav-link">
    <span className="material-symbols-outlined">add_circle</span>
    Rewards
  </a>
</nav>
```

---

## Testing Locally

### Test Plus1-Rewards
```bash
cd plus1-rewards
npm run dev
# Visit: http://localhost:5173
```

### Test Plus1-Go with Base Path
```bash
cd plus1-go
npm run dev
# Visit: http://localhost:5174/go
```

### Test Combined Build
```bash
# From root
npm run build:all

# Serve combined dist
npx serve dist
# Visit: http://localhost:3000 (Rewards)
# Visit: http://localhost:3000/go (Go)
```

---

## Deployment Checklist

- [ ] Update `plus1-go/vite.config.ts` with `base: '/go/'`
- [ ] Update `plus1-go/src/main.tsx` with `basename="/go"`
- [ ] Create root `vercel.json` with rewrites
- [ ] Create root `package.json` with build scripts
- [ ] Create `scripts/combine-builds.js`
- [ ] Install `fs-extra` dependency
- [ ] Test build locally: `npm run build:all`
- [ ] Test serve locally: `npx serve dist`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Add custom domain: `www.plus1rewards.com`
- [ ] Test all routes work
- [ ] Test navigation between apps
- [ ] Update Supabase allowed URLs

---

## Summary

**Final URL Structure:**
- Plus1-Rewards: `https://www.plus1rewards.com/*`
- Plus1-Go: `https://www.plus1rewards.com/go/*`

**Benefits:**
- Single domain
- Clean URL structure
- Easy navigation between apps
- Shared authentication
- Single SSL certificate
- Unified branding

**User Experience:**
- User visits `www.plus1rewards.com` → sees Rewards
- Clicks "Order Online" → goes to `www.plus1rewards.com/go`
- Same login works on both
- Seamless navigation
