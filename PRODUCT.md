# EroticEcho — Product launch notes

## God / owner login (unrestricted)

| Field | Value |
|-------|--------|
| Email | `god` **or** `god@eroticecho.local` |
| Password | `ILIKEBLONDES` (from `GOD_PASSWORD` in `.env.local`) |

God plan: **no daily caps**, admin flags, bypass metering.

**Change `GOD_PASSWORD` before public launch.**

## Plans

| Plan | Story/day | Image/day | Avatar/day | Price label |
|------|-----------|-----------|------------|-------------|
| Free | **4** | **0** (pre-made art only) | **0** | $0 |
| Pro | 200 | **20** (paid feature) | **15** | $12/mo |
| Lifetime | ∞ stories | **60**/day images | **40** | $79 once |
| God | ∞ | ∞ | ∞ | Owner |

**Image policy:** Free never burns xAI image credits. Live scene/portrait gen is Pro+ only (`canGenerateImages`). Set `IMAGE_GEN_ENABLED=false` to kill image APIs for everyone.

## Monetization paths (ready to experiment)

1. **Demo billing** (`DEMO_BILLING=true`) — instant upgrade for testing sales copy.
2. **Redeem codes** — `REDEEM_CODES=PRO:CODE1;LIFETIME:CODE2` (already seeded `EEPRO2026` / `EEFOREVER`).
3. **Stripe Checkout** — set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_LIFETIME`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
   - Turn `DEMO_BILLING=false` in production.

## Auth

- Register / login / logout via `/login`
- Session cookie `ee_session` (HTTP-only)
- Users file: `data/users.json` locally; on **Vercel** uses `/tmp` + memory (no project-dir writes)
- God login never requires a writable filesystem (`GOD_PASSWORD` env)
- AI routes require login unless `ALLOW_GUEST_AI=true`

### Vercel env (required for god login)

| Variable | Notes |
|----------|--------|
| `SESSION_SECRET` | Long random string (≥16 chars) |
| `GOD_USER` | Default `god` |
| `GOD_PASSWORD` | Must match what you type on `/login` |
| `XAI_API_KEY` | Live stories/images |

## Public checklist

- [ ] Change `SESSION_SECRET` and `GOD_PASSWORD`
- [ ] `ALLOW_GUEST_AI=false`
- [ ] `DEMO_BILLING=false` once Stripe live
- [ ] Set `NEXT_PUBLIC_APP_URL`
- [ ] `npm run build && npm start`
- [ ] Age gate + Terms + Privacy linked
- [ ] Confirm xAI billing limits
- [ ] HTTPS host (Vercel / Fly / VPS)

## Suggested next product steps

1. Stripe webhook to set plan on `checkout.session.completed`
2. Password reset email
3. Soft paywall UI banner when 80% of daily limit used
4. Analytics (Plausible/PostHog) — privacy-friendly
5. Admin page for god: list users, grant plans
6. Legal review for adult SaaS in your jurisdiction
