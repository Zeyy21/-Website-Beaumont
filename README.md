# Beaumont

A premium, app-like website + customer portal for a luxury cleaning service.
Built to run **fully on an empty `.env`** — no API keys, no credit card — with
paid services (live email, card payments, premium geocoding) that switch on
later by adding environment variables. No code changes required.

> Brand, scope, and decisions are documented in [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md).

## Stack

- **Next.js 14** (App Router, TypeScript) · **Tailwind** · **Framer Motion**
- **Supabase** — Postgres + Auth + RLS + Storage (the only keys the core app needs)
- **Leaflet + OpenStreetMap + Leaflet-Geoman + Turf.js** — the instant area-based quote (free, keyless)
- **Photon → Nominatim** — address autocomplete via a server route (free, keyless)
- Email behind a swappable adapter (console default · MailerSend/Brevo/Resend/SMTP)
- Payments: manual transfer/cash (keyless) + Stripe (optional)

## Quick start (zero config)

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no `.env`, you get the full experience in
**preview mode**: marketing site, instant quote (draw your home on the map, get
a live price), and the dashboard/admin shells. Emails print to your terminal.

## Enabling accounts & data (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
   (creates tables, RLS policies, seed services, and the `gallery` storage bucket).
3. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Restart `npm run dev`. Sign-up, login, saved quotes, payments, points,
   referrals, contracts, and galleries are now live.

To make yourself **staff** (for `/admin`): after signing up, run in the SQL editor:

```sql
update public.profiles set role = 'staff' where id = '<your-auth-user-id>';
```

## Switching on optional services

Everything below is off by default and documented in [`.env.example`](./.env.example):

| Capability | Add to `.env.local` | Notes |
| --- | --- | --- |
| Live email | `EMAIL_PROVIDER` + `EMAIL_API_KEY` + `EMAIL_FROM` | MailerSend/Brevo/Resend (no card) or `smtp` (`npm i nodemailer`) |
| Card payments | `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | also `npm i stripe`; transfer/cash work without it |
| Premium geocoder | `GEOCODER` + `GEOCODER_KEY` | free Photon/Nominatim used otherwise |

## Brand assets

Logos live in `/public/brand/` (copied from `Logo + Icons/`). The display font
**Bombay Black Unicode** is referenced in `globals.css`; drop
`BombayBlackUnicode.woff2`/`.ttf` into `/public/fonts/` to upgrade headings —
until then they fall back to **Cormorant** automatically.

## Key features

- **Instant quote** — address search → draw property on map → live area-based price → save or request.
- **Customer dashboard** — quotes, contract (in-profile e-sign), payments (card/transfer/cash), reward points, referral link, before/after gallery.
- **Rewards & referrals** — points on signup/jobs/referrals, redeemable as discounts.
- **Admin** (`/admin`, staff-gated) — confirm & send quotes, mark payments paid, edit pricing live, manage gallery, **generate per-zone QR door tags** (print-ready).
- **Door-tag program** — `/api/door-tag` mints tracked, zone-seeded QR codes; the admin UI lays them out as premium printable hangers.

## Scripts

```bash
npm run dev        # local dev
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Deploy

Deploys to **Vercel** as-is (free Hobby tier). Add the env vars you want in the
Vercel project settings. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL so
emails, OAuth redirects, and QR links resolve correctly.
