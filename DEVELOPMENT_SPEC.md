# Beaumont — Development Specification

> **For the AI agent:** Build this in one shot. It is a premium service-business website + customer web app. Prioritize a polished, app-like feel (smooth animations, instant navigation, no page reloads). Ship a working full-stack app, not a static mockup. Where a decision isn't specified, pick the cleaner option and keep moving.

---

## 1. Product summary

Beaumont is a luxury cleaning/service company with a warm, earthy heritage-luxury identity (see §3). The site must feel **super premium** — like a native app, not a brochure. Visitors can browse services, get an **instant AI-estimated quote from a property's area** (drawn on an interactive map), request a formal quote, and manage everything inside a **logged-in profile** (quotes, contract, payments, reward points, referrals).

> **Zero-key principle:** The entire site must run end-to-end with **no API keys and no credit card** using free, open services (see §2 and §2.1). Paid/keyed services (live email, premium geocoding, card payments) sit behind adapters with safe free defaults and are switched on later by dropping env vars in — **no code changes**. The owner will link real keys *after* the site is built.

**Two surfaces, one codebase:**
1. **Public marketing site** — Home, Services, Who We Are, instant quote tool, Terms & Conditions.
2. **Customer app (authenticated)** — Profile dashboard: quotes, contract, payments, points, referrals, before/after galleries.

---

## 2. Tech stack

- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS + a small design-token layer for brand colors.
- **Animation:** Framer Motion (page transitions, scroll reveals, micro-interactions). Keep it tasteful and 60fps — never janky.
- **Backend / DB / Auth:** Supabase (Postgres + Auth + Row Level Security + Storage for before/after images).
- **Maps & area (free, no key, no card):** **Leaflet** + **OpenStreetMap** raster tiles for the map; **Leaflet-Geoman** (or `leaflet-draw`) for polygon drawing; **Turf.js** (`@turf/area`) to compute the drawn area in m². All MIT, all client-side, no billing key. (Google Maps is NOT used.)
- **Address search / geocoding (free):** **Photon** (Komoot, autocomplete-friendly) as primary, **Nominatim** as fallback, accessed through a **server-side `/api/geocode` route** (debounced + cached in DB + proper `User-Agent`) to honor OSM usage policy. Behind a `GEOCODER` adapter so a paid provider can be swapped in later via env.
- **Email (free, no card):** a thin **`sendEmail()` adapter** (`src/lib/email/`). **Default driver = `console`** — emails render to the server log so the app works with zero setup. Drivers for **MailerSend**, **Brevo**, **Resend**, and **SMTP (Nodemailer)** included; pick one later by setting `EMAIL_PROVIDER` + its key. Use React Email (or simple HTML) templates for: quote sent, welcome, referral credited, payment receipt.
- **Payments:** **Stripe** for cards, behind a `payments` adapter that renders a **disabled/test state when no key is set** (flow visible, no charge). The **manual transfer / cash** path works with **no key at all**, so customers can transact day one.
- **Deploy:** Vercel (works fully on the free Hobby tier).

> Put all secrets in `.env.local` and document them in `.env.example`. Never hardcode keys. The build must `npm run dev` successfully with an empty `.env`.

### 2.1 Optional keys & what each unlocks (all off by default)

| Env var(s) | Service | Default behavior with no key | What setting it unlocks |
|---|---|---|---|
| *(none)* | Maps, draw, area | **Fully works** (Leaflet/OSM/Turf) | — already free forever |
| *(none)* | Geocoding | **Works** via Photon/Nominatim free endpoints | — |
| `GEOCODER`, `GEOCODER_KEY` | Premium geocoder (optional) | Free Photon/Nominatim | higher rate limits / better autocomplete |
| `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM` | Transactional email | Emails logged to **console** | real email delivery (MailerSend/Brevo/Resend/SMTP) |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Card payments | Card UI shown **disabled**; transfer/cash works | live card charging |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_*` keys | DB/Auth/Storage | App expects these for full features | the only keys needed for the core app |

> Supabase keys are the one set needed for the *core* app (auth, data). Everything in §4 that isn't payments/email works with just Supabase. If the agent has no Supabase project, it should still scaffold against the schema in §6 and document setup in the README.

---

## 3. Brand & design language

- **Feel:** premium, calm, confident, warm. Earthy luxury — think boutique hospitality / artisanal heritage brand, not clinical tech. Lots of whitespace, large serif type, soft shadows, subtle motion, organic textures.
- **Brand colors (final — earth-tone palette):** define as CSS variables / Tailwind theme tokens in one place.
  - `--ivory:    #F9F8E7` (primary light background / text-on-dark)
  - `--sand:     #D7BE96` (soft neutral / secondary surfaces)
  - `--ochre:    #A1794F` (warm mid accent)
  - `--cinnamon: #7A4327` (rich accent / CTAs)
  - `--oak:      #40261A` (deep surface)
  - `--soil:     #1D170F` (near-black base / dark sections)
- **Color usage:** dark sections on `--soil`/`--oak` with `--ivory` text and a subtle dark wood/plaster texture overlay (matches the logo treatment); light sections on `--ivory`/`--sand`; `--cinnamon` and `--ochre` for buttons, links, accents, and the "luxury highlight" role. Maintain WCAG AA contrast.
- **Logo & wordmark:** the brand uses a custom **"B" monogram** + **BEAUMONT wordmark** (elegant high-contrast serif). Provide both an ivory version (for dark backgrounds) and a dark version (for light backgrounds). See §3.1 for required asset files.
- **Type:**
  - **Display / wordmark:** **Bombay Black Unicode** (the brand serif — use for the wordmark, hero headlines, and major section titles). Self-host via `next/font/local` (drop the font file in `/public/fonts` or `/app/fonts`); provide an elegant high-contrast serif fallback (e.g. *Cormorant Garamond*) in the font stack in case the file is absent.
  - **Body / UI:** a clean, quiet sans (e.g. *Inter*) via `next/font/google` for paragraphs, forms, dashboard UI.
- **Motion rules:** ease-out, 200–500ms; stagger lists; reveal-on-scroll; animated number count-ups for quotes/points; page transitions that slide/fade. Respect `prefers-reduced-motion`.
- **Navigation:** sticky, minimal top nav + app-style bottom/side nav inside the profile. Everything client-routed and fast.

### 3.1 Brand assets (already provided)

Real brand files exist in **`/Logo + Icons/`** at the repo root. The agent should copy them into `/public/brand/` and reference them there. Inventory:

| Source file (`/Logo + Icons/`) | What it is | Copy to `/public/brand/` as | Use |
|---|---|---|---|
| `beaumont logo -icon.png` | "B" monogram, **ivory, transparent** | `monogram-ivory.png` | nav mark / favicon on dark backgrounds |
| `beaumont logo -text.png` | "BEAUMONT" wordmark, **ivory, transparent** | `wordmark-ivory.png` | hero, footer, dark sections |
| `Logo Icon Beaumont Brown.png` | "B" monogram, ivory **on dark `--soil` tile** | `monogram-tile.png` | app icon / social avatar / favicon source |
| `color palette/Screenshot 2026-06-18…png` | the 6-color palette swatch (reference only) | — | design reference (tokens already in §3) |

**Derive the rest** (the ivory cut-outs are transparent, so recolor in CSS or export dark variants):
- `monogram-dark` + `wordmark-dark` in `--soil` for **light** backgrounds — recolor the transparent ivory PNGs via CSS `filter`/`mask`, or export dark SVGs.
- `favicon.ico` + `apple-touch-icon.png` from `monogram-tile.png`.
- `texture-dark` (the organic wood/plaster look behind the logos): optional — use a CSS gradient/noise fallback on `--soil`/`--oak` if not exported.

### 3.2 Display font — Bombay Black Unicode (supplied ✓)

The brand font ships at `Logo + Icons/FONT/Bombay-Black-Unicode/…ttf` and is copied to **`/public/fonts/BombayBlackUnicode.ttf`**, loaded via `@font-face` in `globals.css`. Headings and the wordmark use it.
- Font stack: `"Bombay Black Unicode", var(--font-cormorant), "Cormorant", Georgia, serif` — if the file is ever removed it falls back to **Cormorant** automatically (no breakage).
- The ivory wordmark PNG is still used for the literal "BEAUMONT" lockup in nav/footer/hangers so the mark is pixel-exact regardless of font loading.
- Optional: export a `.woff2` and add it as the first `src` for a smaller/faster load.

---

## 4. Core features

### 4.1 Instant AI quote (the hero feature — make it effortless)
- User enters an address → **Photon autocomplete** (via `/api/geocode`) → **Leaflet/OSM** map flies to it.
- User **draws the property/area** with the **Leaflet-Geoman** polygon tool; **Turf.js** computes area live in m²/ft². (No building-footprint autosuggest — OSM residential footprints are unreliable; user-drawn polygon is the source of truth.)
- Pick **service type** + frequency (one-time / weekly / bi-weekly / monthly) + options (deep clean, windows, etc.).
- **Quote engine** = transparent pricing model: `base + (area × rate_per_m² × service_multiplier × frequency_modifier) + add-ons`. Show an animated price range instantly. Store the rate table in DB so pricing is editable without code changes.
- CTA: **"Save quote to my account"** (prompts login/signup) and **"Request formal quote"** (notifies staff + emails the customer).
- Keep the whole flow to **3 steps max**, with a progress indicator. No friction.

### 4.2 Authentication & profile
- Supabase email/password + magic link + Google OAuth.
- **Profile dashboard** (app-like): saved/requested quotes with status (Draft → Requested → Sent → Accepted → Scheduled), **active contract** (viewable + e-signable/acknowledged in-profile), **payments** (history + pay now), **reward points balance**, **referral link/code**, **before/after galleries** of their completed jobs.

### 4.3 Rewards (points) & referrals
- Earn points for: signing up, accepting a quote, completed jobs, and successful referrals.
- **Referral program:** each user gets a unique code/link; referred signup + first paid job credits both parties. Track in DB; show progress in profile.
- Points redeemable as a discount on future quotes (show conversion clearly).

### 4.4 Payments
- Stripe Payment Element for cards, with receipts emailed — **behind the payments adapter**: when `STRIPE_*` keys are absent, show the card option in a clearly **disabled "coming soon / test" state** (UI visible, no charge attempted), so the build runs keyless.
- **Bank transfer / cash:** user selects it; invoice marked *Awaiting payment*; staff can mark *Paid*. **Works with no keys at all** — this is the default working payment path day one. All payment records live in the profile.

### 4.5 Content pages
- **Who We Are**, **What We Do / Services** (each service with description + before/after slider), **Terms & Conditions** (full legal page), **Contact**.
- **Before/after**: image comparison slider component, sourced from Supabase Storage.

### 4.6 Staff/admin (lightweight)
- Protected `/admin` for staff: view incoming quote requests, send a finalized quote (triggers email), upload before/after images, mark payments paid, edit the pricing rate table. Role gated via Supabase RLS (`role = 'staff'`).

---

## 5. Door-tag program (offline → online bridge)

A **physical door-hanger / tag system** to put a branded tag on every door in target neighborhoods, driving people to the instant-quote tool.

- **Design:** premium die-cut door hanger in brand colors — front: logo + one-line promise ("Beaumont. Effortless luxury cleaning."); back: **per-door QR code** + short URL + "Scan for an instant quote on *this* home."
- **Smart QR:** each tag encodes a campaign + (optionally) a geo/route ID → lands on the quote tool **pre-seeded with that neighborhood**, and attributes the lead to that door-tag batch. Store scans in a `door_tag_scans` table for conversion tracking.
- **Strategy / rollout:** organize by route/zone; generate QR batches per zone; track scan → quote → booking funnel in admin. Tags should feel like a gift left on the door, not a flyer (heavyweight stock, gold foil accent, rounded die-cut).
- **Deliverable in repo:** a print-ready door-hanger template (SVG/HTML→PDF) plus a `/api/door-tag` route that generates QR codes for a list of addresses/zones.

---

## 6. Data model (Supabase — create via migration)

`profiles` (id→auth.users, name, phone, role, points_balance, referral_code, referred_by) ·
`services` (id, name, description, base_price, rate_per_m2, multiplier, active) ·
`quotes` (id, user_id, service_id, address, area_m2, frequency, line_items jsonb, total, status, created_at) ·
`contracts` (id, user_id, quote_id, terms, signed_at, status) ·
`payments` (id, user_id, quote_id, amount, method [card|transfer|cash], status, stripe_id, paid_at) ·
`rewards_ledger` (id, user_id, delta, reason, created_at) ·
`referrals` (id, referrer_id, referred_id, status, reward_granted) ·
`gallery_items` (id, user_id, service_id, before_url, after_url, caption) ·
`pricing_rates` (editable rate table) ·
`door_tag_scans` (id, zone, tag_id, landed_at, converted_quote_id).

**Enable RLS on every table.** Users read/write only their own rows; staff role gets broader access. Document policies in the migration.

---

## 7. Build order

1. Scaffold Next.js + Tailwind + design tokens + fonts + Framer Motion shell with animated nav/page transitions.
2. Supabase project: schema migration + RLS + Auth + Storage bucket.
3. Marketing pages (Home, Services w/ before-after slider, Who We Are, T&C) — fully animated.
4. Instant quote tool (Leaflet/OSM map + Leaflet-Geoman draw + Turf area + `/api/geocode` Photon autocomplete + pricing engine + save/request).
5. Auth + profile dashboard (quotes, contract, payments, points, referrals, galleries).
6. **Adapters:** `sendEmail()` (console default + MailerSend/Brevo/Resend/SMTP drivers) and `payments` (manual transfer/cash working; Stripe behind disabled-when-no-key state). Wire transactional emails through the adapter.
7. Rewards + referral logic.
8. Admin panel + door-tag QR generator + print template.
9. Polish pass: motion, responsiveness, `prefers-reduced-motion`, accessibility, empty/loading states. **Verify `npm run dev` boots with an empty `.env` and every keyless feature works.**

---

## 8. Definition of done

- Loads fast, animates smoothly, fully responsive, feels like an app.
- A visitor can: draw their property → get an instant estimate → sign up → request a formal quote → see it in their profile.
- A logged-in user sees real quotes, points, referral link, contract, payment history, and before/after galleries — all backed by Supabase with RLS.
- Staff can send quotes, upload galleries, mark payments, edit pricing.
- Door-tag QR generator outputs working per-zone codes and a print-ready hanger template.
- **Runs with zero keys:** `npm run dev` boots on an empty `.env`; map/draw/area, geocode autocomplete, manual payments, and console-email all work. Live email + Stripe + premium geocode switch on via env vars with no code change.
- `.env.example` + `README` with setup steps and the §2.1 key table. No hardcoded secrets.
