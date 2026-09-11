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

Hash a store-management password:

```bash
npx tsx scripts/hash-store-password.ts 'your-password'
```

Paste the printed JSON into `STORE_MANAGEMENT_USERS` (Vercel / `.env.local`).

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

`/store-management` is auth-gated, `noindex`, and not included in the sitemap.

## Content migrations

One-off Sanity scripts live in `scripts/` and are run with `npx tsx scripts/<name>.ts` (requires `SANITY_API_TOKEN`).
