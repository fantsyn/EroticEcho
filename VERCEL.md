# Deploy EroticEcho on Vercel

## 1. Connect repo

- Import `fantsyn/EroticEcho` (or your fork) on [vercel.com](https://vercel.com)
- Framework: **Next.js** (auto-detected)
- Build: `npm run build` · Output: default

## 2. Environment variables (Production + Preview)

| Variable | Required | Notes |
|----------|----------|--------|
| `SESSION_SECRET` | **Yes** | Long random string (≥16). Session cookies. |
| `GOD_PASSWORD` | **Yes** for owner login | Password for `god` / `god@eroticecho.local` |
| `GOD_USER` | No | Default `god` |
| `XAI_API_KEY` | For live AI | Stories/images/TTS; without it = offline demos |
| `XAI_MODEL` | No | Default `grok-4.5` |
| `XAI_IMAGE_MODEL` | No | Default `grok-imagine-image` |
| `NEXT_PUBLIC_APP_URL` | Recommended | `https://your-domain.vercel.app` |
| `ALLOW_GUEST_AI` | No | Keep `false` in production |
| `DEMO_BILLING` | No | `true` only for testing free upgrades |
| `STRIPE_SECRET_KEY` | For real pay | Live or test key |
| `STRIPE_PRICE_PRO` | With Stripe | Price id |
| `STRIPE_PRICE_LIFETIME` | With Stripe | Price id |
| `STRIPE_WEBHOOK_SECRET` | With Stripe | From webhook endpoint |
| `UPSTASH_REDIS_REST_URL` | **Strongly recommended** | Durable users + share codes |
| `UPSTASH_REDIS_REST_TOKEN` | With Upstash | |
| `REDEEM_CODES` | No | e.g. `PRO:EEPRO2026;LIFETIME:EEFOREVER` |
| `RESEND_API_KEY` | No | Welcome/upgrade emails |
| `EMAIL_FROM` | No | `EroticEcho <hello@domain.com>` |

### Upstash (users + cloud codes that survive cold starts)

1. Create free Redis at [upstash.com](https://upstash.com)
2. Copy **REST URL** + **REST TOKEN** into Vercel env
3. Redeploy

Without Upstash, god login still works (env password), but **register/login users** and **share codes** may reset when serverless instances recycle.

## 3. Stripe (optional)

1. Create products/prices in Stripe Dashboard  
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_LIFETIME`  
3. Webhook → `https://YOUR_DOMAIN/api/billing/webhook`  
   Event: `checkout.session.completed`  
4. Set `STRIPE_WEBHOOK_SECRET`  
5. Leave `DEMO_BILLING` unset or `false` in production  

## 4. After deploy checklist

- [ ] Open site → age gate works  
- [ ] Login as god with `GOD_PASSWORD`  
- [ ] Generate one story scene (needs `XAI_API_KEY`)  
- [ ] Portrait picker mid-story shows images  
- [ ] Publish share code → open `/read/CODE` in another browser  
- [ ] Privacy + Terms links in footer/nav  
- [ ] Change default redeem codes if public  

## 5. Local

```bash
cd EroticEcho
cp .env.example .env.local
# fill keys
npm install
npm run dev
```

## 6. Regenerate portraits

```bash
node scripts/generate-avatars.mjs --only=char-id --multi --force
# then for extra looks (delete existing extra PNGs first if overwriting):
node scripts/generate-avatars.mjs --only=char-id --extra
```
