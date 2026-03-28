# Quick Reference - Plus1 Deployment

## 🚀 Deploy in 3 Commands

```bash
npm install
npm run build:all
vercel --prod
```

---

## 🌐 URL Structure

```
https://www.plus1rewards.com/          → Plus1-Rewards
https://www.plus1rewards.com/go/       → Plus1-Go
```

---

## 📁 Files Modified

```
✅ plus1-go/vite.config.ts         (added base: '/go/')
✅ plus1-go/src/main.tsx           (added basename="/go")
✅ plus1-go/src/AppRouter.tsx      (accepts basename prop)
✅ package.json                    (root build config)
✅ vercel.json                     (deployment config)
✅ scripts/combine-builds.js       (build combiner)
```

---

## 🔧 Build Commands

```bash
npm run build:rewards    # Build Plus1-Rewards only
npm run build:go         # Build Plus1-Go only
npm run build:all        # Build both + combine
npm run combine          # Combine existing builds
```

---

## 🧪 Test Locally

```bash
npm run build:all
npx serve dist

# Visit:
# http://localhost:3000      → Plus1-Rewards
# http://localhost:3000/go   → Plus1-Go
```

---

## 🔐 Environment Variables

Add in Vercel Dashboard:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_SERVICE_ROLE
```

---

## 📋 Deployment Checklist

- [ ] `npm install`
- [ ] `npm run build:all`
- [ ] `vercel --prod`
- [ ] Add domain: `www.plus1rewards.com`
- [ ] Configure DNS
- [ ] Add environment variables
- [ ] Update Supabase URLs
- [ ] Test both paths

---

## 🆘 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Routes not working?**
- Check `vercel.json` has rewrites
- Check `vite.config.ts` has `base: '/go/'`

**Assets 404?**
- Ensure Plus1-Go built with correct base path
- Check browser console for errors

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **DNS Check:** https://www.whatsmydns.net

---

**Ready to deploy!** 🎉
