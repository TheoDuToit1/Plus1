# Domain Strategy for Plus1 Ecosystem

## Current Domain
**Live Domain:** `https://www.plus1rewards.com`

---

## Recommended Options

### Option 1: Subdomain Strategy (RECOMMENDED)

Deploy each project to a separate subdomain:

```
Plus1-Rewards: https://www.plus1rewards.com (main domain)
Plus1-Go:      https://go.plus1rewards.com (subdomain)
```

**Pros:**
- Clean separation
- Easy to manage
- Independent deployments
- Better for SEO
- Users understand they're different services

**Cons:**
- Requires DNS configuration
- Two separate Vercel projects

---

### Option 2: Path-Based Routing

Deploy both under the same domain with different paths:

```
Plus1-Rewards: https://www.plus1rewards.com/
Plus1-Go:      https://www.plus1rewards.com/go/
```

**Pros:**
- Single domain
- Unified branding
- Easier SSL management

**Cons:**
- More complex routing setup
- Requires Vercel rewrites configuration
- Harder to maintain separate projects

---

### Option 3: Separate Domain for Plus1-Go

Use a completely different domain:

```
Plus1-Rewards: https://www.plus1rewards.com
Plus1-Go:      https://www.plus1go.com (new domain)
```

**Pros:**
- Complete separation
- Distinct branding
- Independent marketing

**Cons:**
- Need to purchase new domain
- More expensive
- Users might not realize they're connected

---

## RECOMMENDED IMPLEMENTATION: Option 1 (Subdomain)

### Domain Structure

```
Main Site:     https://www.plus1rewards.com
               ↓
               Hosts: Plus1-Rewards (Member/Partner/Agent/Admin dashboards)

Delivery Site: https://go.plus1rewards.com
               ↓
               Hosts: Plus1-Go (Delivery/ordering platform)
```

### User Experience

**Registration/Login:**
- Both platforms accessible from their respective URLs
- Unified auth pages show tabs to switch platforms
- Users can register on either site
- Same credentials work on both sites

**Navigation:**
- Plus1-Rewards header has link: "Order Online" → `https://go.plus1rewards.com`
- Plus1-Go header has link: "Rewards Dashboard" → `https://www.plus1rewards.com`

---

## Implementation Steps

### Step 1: Deploy to Vercel

#### Deploy Plus1-Rewards
```bash
cd plus1-rewards
vercel --prod
```
**Vercel URL:** `https://plus1-rewards.vercel.app`

#### Deploy Plus1-Go
```bash
cd plus1-go
vercel --prod
```
**Vercel URL:** `https://plus1-go.vercel.app`

---

### Step 2: Configure Custom Domains in Vercel

#### A. For Plus1-Rewards (Main Domain)

1. Go to Vercel Dashboard → Plus1-Rewards project
2. Navigate to **Settings** → **Domains**
3. Add domains:
   - `plus1rewards.com`
   - `www.plus1rewards.com`
4. Vercel will provide DNS instructions

#### B. For Plus1-Go (Subdomain)

1. Go to Vercel Dashboard → Plus1-Go project
2. Navigate to **Settings** → **Domains**
3. Add domain:
   - `go.plus1rewards.com`
4. Vercel will provide DNS instructions

---

### Step 3: DNS Configuration

Add these records to your DNS provider (where you registered plus1rewards.com):

#### For Main Domain (Plus1-Rewards)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: A
Name: www
Value: 76.76.21.21
TTL: 3600

Type: CNAME (Alternative)
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### For Subdomain (Plus1-Go)

```
Type: CNAME
Name: go
Value: cname.vercel-dns.com
TTL: 3600
```

**OR use A record:**

```
Type: A
Name: go
Value: 76.76.21.21
TTL: 3600
```

---

### Step 4: Update Supabase Settings

Add both domains to Supabase allowed URLs:

1. Go to Supabase Dashboard → Settings → API
2. Update **Site URL:** `https://www.plus1rewards.com`
3. Add to **Redirect URLs:**
   - `https://www.plus1rewards.com/**`
   - `https://go.plus1rewards.com/**`
   - `https://plus1-rewards.vercel.app/**` (for preview deployments)
   - `https://plus1-go.vercel.app/**` (for preview deployments)

---

### Step 5: Update Application URLs

#### In Plus1-Rewards Code

Update any hardcoded URLs or links to Plus1-Go:

```typescript
// src/config/urls.ts
export const URLS = {
  REWARDS_BASE: 'https://www.plus1rewards.com',
  GO_BASE: 'https://go.plus1rewards.com',
  GO_DASHBOARD: 'https://go.plus1rewards.com/dashboard',
  GO_BROWSE: 'https://go.plus1rewards.com/browse'
};
```

Add navigation link in header:
```tsx
<a href="https://go.plus1rewards.com" className="nav-link">
  Order Online
</a>
```

#### In Plus1-Go Code

Update links back to Plus1-Rewards:

```typescript
// src/config/urls.ts
export const URLS = {
  REWARDS_BASE: 'https://www.plus1rewards.com',
  REWARDS_DASHBOARD: 'https://www.plus1rewards.com/member/dashboard',
  GO_BASE: 'https://go.plus1rewards.com'
};
```

Add navigation link in header:
```tsx
<a href="https://www.plus1rewards.com" className="nav-link">
  Rewards Dashboard
</a>
```

---

### Step 6: Update Unified Auth Pages

Update the login/register redirect logic to use correct domains:

```typescript
// In UnifiedLogin.tsx and UnifiedRegister.tsx

const handleSubmit = async (e: FormEvent) => {
  // ... authentication logic ...

  // Navigate based on platform
  if (activePlatform === 'rewards') {
    window.location.href = 'https://www.plus1rewards.com/member/dashboard';
  } else {
    window.location.href = 'https://go.plus1rewards.com/dashboard';
  }
};
```

---

## Cross-Domain Session Management

Since you're using different domains, you need to handle sessions carefully:

### Option A: Shared Session via Database (Current Approach)

Your current approach stores session in localStorage/sessionStorage, which works per domain.

**How it works:**
1. User logs in on `www.plus1rewards.com`
2. Session stored in localStorage
3. User clicks "Order Online" → goes to `go.plus1rewards.com`
4. Plus1-Go checks for session → NOT FOUND (different domain)
5. User needs to log in again (but same credentials work)

**Solution:** This is actually fine! Users just log in once per domain with same credentials.

### Option B: Token-Based Cross-Domain Auth (Advanced)

Pass authentication token via URL parameter:

```typescript
// In Plus1-Rewards
<a href={`https://go.plus1rewards.com?token=${authToken}`}>
  Order Online
</a>

// In Plus1-Go
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    // Validate token and create session
    validateAndCreateSession(token);
  }
}, []);
```

### Option C: Subdomain Cookie Sharing (Recommended)

Set cookies at the parent domain level:

```typescript
// When user logs in, set cookie for parent domain
document.cookie = `auth_token=${token}; domain=.plus1rewards.com; path=/; secure; samesite=lax`;

// Both www.plus1rewards.com and go.plus1rewards.com can read this cookie
```

---

## Environment Variables per Project

### Plus1-Rewards (.env.production)
```env
VITE_APP_URL=https://www.plus1rewards.com
VITE_GO_URL=https://go.plus1rewards.com
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
VITE_SUPABASE_SERVICE_ROLE=[your-key]
```

### Plus1-Go (.env.production)
```env
VITE_APP_URL=https://go.plus1rewards.com
VITE_REWARDS_URL=https://www.plus1rewards.com
VITE_SUPABASE_URL=https://gcbmlxdxwakkubpldype.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
VITE_SUPABASE_SERVICE_ROLE=[your-key]
```

Add these in Vercel Dashboard for each project.

---

## Testing the Setup

### 1. Test Main Domain
```
Visit: https://www.plus1rewards.com
Expected: Plus1-Rewards loads
Test: Login as member → Should work
```

### 2. Test Subdomain
```
Visit: https://go.plus1rewards.com
Expected: Plus1-Go loads
Test: Login as member → Should work (same credentials)
```

### 3. Test Cross-Platform Navigation
```
1. Login on www.plus1rewards.com
2. Click "Order Online" → goes to go.plus1rewards.com
3. Should see login page (or auto-login if using Option C)
4. Login with same credentials → Should work
```

### 4. Test Unified Auth
```
1. Register on www.plus1rewards.com with Rewards tab
2. Go to go.plus1rewards.com
3. Login with same credentials → Should work
4. Both platforms access same database
```

---

## DNS Propagation Timeline

After configuring DNS:
- **Immediate:** Some users see changes
- **1-4 hours:** Most users see changes
- **24-48 hours:** All users worldwide see changes

Check propagation: https://www.whatsmydns.net/

---

## SSL Certificates

Vercel automatically provisions SSL certificates for:
- `plus1rewards.com`
- `www.plus1rewards.com`
- `go.plus1rewards.com`

**Timeline:** 
- Usually within 5-10 minutes after DNS is configured
- Automatic renewal every 90 days

---

## Final Domain Structure

```
┌─────────────────────────────────────────┐
│   https://www.plus1rewards.com          │
│   (Plus1-Rewards)                       │
│                                         │
│   - Member Dashboard                    │
│   - Partner Dashboard                   │
│   - Agent Dashboard                     │
│   - Admin Dashboard                     │
│   - QR Code Scanning                    │
│   - Cover Plan Management               │
│                                         │
│   Link: "Order Online" →                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   https://go.plus1rewards.com           │
│   (Plus1-Go)                            │
│                                         │
│   - Browse Partners                     │
│   - Order Food/Groceries                │
│   - Track Deliveries                    │
│   - Driver Dashboard                    │
│   - Earn Cashback                       │
│                                         │
│   Link: "Rewards Dashboard" →           │
└─────────────────────────────────────────┘
```

---

## Quick Setup Checklist

- [ ] Deploy Plus1-Rewards to Vercel
- [ ] Deploy Plus1-Go to Vercel
- [ ] Add `www.plus1rewards.com` to Plus1-Rewards project
- [ ] Add `go.plus1rewards.com` to Plus1-Go project
- [ ] Configure DNS A/CNAME records
- [ ] Update Supabase allowed URLs
- [ ] Add environment variables to both projects
- [ ] Test main domain loads
- [ ] Test subdomain loads
- [ ] Test login on both domains
- [ ] Test unified auth (register on one, login on other)
- [ ] Add cross-navigation links
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify SSL certificates active

---

## Summary

**Recommended Setup:**
- Main Domain: `https://www.plus1rewards.com` → Plus1-Rewards
- Subdomain: `https://go.plus1rewards.com` → Plus1-Go
- Both share same Supabase database
- Users can register/login on either site
- Same credentials work on both platforms
- Clean separation, easy to manage

This gives you the best of both worlds: unified authentication with clear service separation.
