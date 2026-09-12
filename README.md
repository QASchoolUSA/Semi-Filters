# Semi Filters

Next.js storefront for [semifilters.com](https://semifilters.com) — OEM-quality oil, air, fuel, and cabin filters for semi trucks.

## Stack

- **Next.js 16** (App Router) + React 19
- **Sanity** CMS (embedded Studio at `/studio`)
- **Stripe** Checkout + webhooks
- **Nodemailer** for contact and order emails
- **Auth.js** for `/store-management` (credentials, 1–2 staff)
- **Shippo** for multi-carrier shipping labels

## Getting started

```bash
npm install
# create .env.local with the variables below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
- Store management: [http://localhost:3000/store-management](http://localhost:3000/store-management)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typegen` | Extract Sanity schema + generate TypeScript types |
| `npx tsx scripts/hash-store-password.ts 'pass'` | Hash a password + print one-line `STORE_MANAGEMENT_USERS` |
| `npx tsx scripts/minify-store-users.ts users.json` | Minify multi-line users JSON to one env line |
| `npm run seed-demo-order` | Upsert a paid demo order for Shippo label testing |

Hash a store-management password:

```bash
npx tsx scripts/hash-store-password.ts 'your-password'
```

Paste the printed JSON into `STORE_MANAGEMENT_USERS` (Vercel / `.env.local`).

### Demo order (shipping labels)

```bash
npm run seed-demo-order
```

Requires `SANITY_API_TOKEN`. Creates/updates a paid order (`demo_cs_test_seed`) shippable in `/store-management/shipping`. Use a **Shippo test API token** when buying labels so you are not charged.

Store-management reads orders **without the Sanity CDN** so new checkouts and seeds show up immediately. Shipping uses **USPS Flat Rate / Regional Rate boxes** (template + weight only — no manual L×W×H).

Local login also needs Auth.js env (see table below). Minimal `.env.local` for orders + login:

```bash
# after setting SANITY_* …
openssl rand -base64 32   # paste as AUTH_SECRET
npx tsx scripts/hash-store-password.ts 'your-password' 'you@semifilters.com'
# paste the printed STORE_MANAGEMENT_USERS=... line into .env.local
# then restart: npm run dev
```

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually `production`) |
| `SANITY_API_TOKEN` | Write token (webhook order upsert + label updates) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `SMTP_USER` / `SMTP_PASS` | Outbound email |
| `TELEGRAM_BOT_TOKEN` | Bot token for new-order group alerts |
| `TELEGRAM_CHAT_ID` | Telegram group/chat id (e.g. `-5486379420`) |
| `INDEXNOW_SECRET` | IndexNow API auth |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity (optional) |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | Set `true` on Vercel |
| `STORE_MANAGEMENT_USERS` | JSON array of `{ email, passwordHash, name? }` |
| `SHIPPO_API_TOKEN` | Shippo API token |
| `SHIP_FROM_NAME` | Label from-name |
| `SHIP_FROM_STREET1` | Warehouse street |
| `SHIP_FROM_CITY` | Warehouse city |
| `SHIP_FROM_STATE` | Warehouse state |
| `SHIP_FROM_ZIP` | Warehouse ZIP |
| `SHIP_FROM_COUNTRY` | Usually `US` |
| `SHIP_FROM_PHONE` | Warehouse phone |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (Search Console dashboard) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GSC_SITE_URL` | Optional override if auto-detect picks the wrong property |

`/store-management` is auth-gated, `noindex`, and not included in the sitemap.

### Google Search Console (store-management)

The **SEO** tab at `/store-management/seo` shows clicks, impressions, CTR, average position, top keywords, pages, countries, and devices via the Search Console API.

One-time setup:

1. In [Google Cloud Console](https://console.cloud.google.com/), create/select a project and enable **Google Search Console API**.
2. Create an **OAuth 2.0 Web application** client. Add **both** authorized redirect URIs (exact match required):
   - Production: `https://semifilters.com/api/store-management/gsc/callback`
   - Local: `http://localhost:3000/api/store-management/gsc/callback`
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, and `SANITY_API_TOKEN`. `NEXT_PUBLIC_SITE_URL` is optional for GSC now (redirect uses the request origin), but still recommended for canonical URLs.
4. Sign in to store-management → **SEO** → **Connect Google** with an account that has access to the semifilters.com property.
5. The refresh token is encrypted and stored in Sanity automatically. The app picks the matching GSC property from your account (override with `GSC_SITE_URL` if needed).

Clicks are visits from Google Search only — not full-site analytics (Clarity/GA). Data usually lags about two days. Use **Disconnect** on the SEO page to remove the saved connection.

## Content migrations

One-off Sanity scripts live in `scripts/` and are run with `npx tsx scripts/<name>.ts` (requires `SANITY_API_TOKEN`).
