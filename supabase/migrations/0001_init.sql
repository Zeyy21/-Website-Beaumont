-- Beaumont — initial schema, RLS, seed.
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- Safe to re-run: uses IF NOT EXISTS / idempotent policies where practical.

-- ───────────────────────── extensions ─────────────────────────
create extension if not exists "pgcrypto";

-- ───────────────────────── helper: role check ─────────────────────────
-- SECURITY DEFINER avoids RLS recursion when policies query profiles.
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
$$;

-- ───────────────────────── profiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','staff')),
  points_balance integer not null default 0,
  referral_code text not null unique default encode(gen_random_bytes(4), 'hex'),
  referred_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ───────────────────────── services ─────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  base_price numeric not null default 0,
  rate_per_m2 numeric not null default 0,
  multiplier numeric not null default 1,
  active boolean not null default true,
  sort integer not null default 0
);

-- ───────────────────────── pricing_rates (editable knobs) ─────────────────────────
create table if not exists public.pricing_rates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value numeric not null,
  note text
);

-- ───────────────────────── quotes ─────────────────────────
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  address text,
  area_m2 numeric,
  frequency text,
  line_items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'draft'
    check (status in ('draft','requested','sent','accepted','scheduled','completed')),
  source_zone text,
  created_at timestamptz not null default now()
);

-- ───────────────────────── contracts ─────────────────────────
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  terms text not null default '',
  status text not null default 'draft' check (status in ('draft','sent','signed')),
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ───────────────────────── payments ─────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  amount numeric not null,
  method text not null check (method in ('card','transfer','cash')),
  status text not null default 'awaiting' check (status in ('awaiting','paid','refunded')),
  stripe_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ───────────────────────── rewards_ledger ─────────────────────────
create table if not exists public.rewards_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- ───────────────────────── referrals ─────────────────────────
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  reward_granted boolean not null default false,
  created_at timestamptz not null default now(),
  unique (referrer_id, referred_id)
);

-- ───────────────────────── gallery_items ─────────────────────────
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  before_url text not null,
  after_url text not null,
  caption text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── door_tag_scans ─────────────────────────
create table if not exists public.door_tag_scans (
  id uuid primary key default gen_random_uuid(),
  zone text,
  tag_id text,
  landed_at timestamptz not null default now(),
  converted_quote_id uuid references public.quotes(id) on delete set null
);

-- ───────────────────────── keep points_balance in sync ─────────────────────────
create or replace function public.apply_reward()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
    set points_balance = points_balance + new.delta
    where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_apply_reward on public.rewards_ledger;
create trigger trg_apply_reward
  after insert on public.rewards_ledger
  for each row execute function public.apply_reward();

-- ───────────────────────── auto-create profile on signup ─────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═════════════════════════ ROW LEVEL SECURITY ═════════════════════════
alter table public.profiles       enable row level security;
alter table public.services        enable row level security;
alter table public.pricing_rates   enable row level security;
alter table public.quotes          enable row level security;
alter table public.contracts       enable row level security;
alter table public.payments        enable row level security;
alter table public.rewards_ledger  enable row level security;
alter table public.referrals       enable row level security;
alter table public.gallery_items   enable row level security;
alter table public.door_tag_scans  enable row level security;

-- profiles: self read/update; staff read all
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select using (id = auth.uid() or public.is_staff());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid());

-- services & pricing: public read; staff write
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select using (true);
drop policy if exists services_staff_write on public.services;
create policy services_staff_write on public.services
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists rates_public_read on public.pricing_rates;
create policy rates_public_read on public.pricing_rates for select using (true);
drop policy if exists rates_staff_write on public.pricing_rates;
create policy rates_staff_write on public.pricing_rates
  for all using (public.is_staff()) with check (public.is_staff());

-- quotes: owner full; anonymous draft inserts allowed (user_id null); staff all
drop policy if exists quotes_owner_select on public.quotes;
create policy quotes_owner_select on public.quotes
  for select using (user_id = auth.uid() or public.is_staff());
drop policy if exists quotes_insert on public.quotes;
create policy quotes_insert on public.quotes
  for insert with check (user_id = auth.uid() or user_id is null);
drop policy if exists quotes_owner_update on public.quotes;
create policy quotes_owner_update on public.quotes
  for update using (user_id = auth.uid() or public.is_staff());

-- contracts: owner read + sign; staff all
drop policy if exists contracts_owner_select on public.contracts;
create policy contracts_owner_select on public.contracts
  for select using (user_id = auth.uid() or public.is_staff());
drop policy if exists contracts_owner_update on public.contracts;
create policy contracts_owner_update on public.contracts
  for update using (user_id = auth.uid() or public.is_staff());
drop policy if exists contracts_staff_insert on public.contracts;
create policy contracts_staff_insert on public.contracts
  for insert with check (public.is_staff());

-- payments: owner read + create (manual); staff all
drop policy if exists payments_owner_select on public.payments;
create policy payments_owner_select on public.payments
  for select using (user_id = auth.uid() or public.is_staff());
drop policy if exists payments_owner_insert on public.payments;
create policy payments_owner_insert on public.payments
  for insert with check (user_id = auth.uid());
drop policy if exists payments_staff_update on public.payments;
create policy payments_staff_update on public.payments
  for update using (public.is_staff());

-- rewards_ledger: owner read; inserts via server (service role) or staff
drop policy if exists rewards_owner_select on public.rewards_ledger;
create policy rewards_owner_select on public.rewards_ledger
  for select using (user_id = auth.uid() or public.is_staff());
drop policy if exists rewards_staff_insert on public.rewards_ledger;
create policy rewards_staff_insert on public.rewards_ledger
  for insert with check (public.is_staff());

-- referrals: parties read; staff all
drop policy if exists referrals_select on public.referrals;
create policy referrals_select on public.referrals
  for select using (
    referrer_id = auth.uid() or referred_id = auth.uid() or public.is_staff()
  );

-- gallery: public read featured; owner reads own; staff write
drop policy if exists gallery_public_read on public.gallery_items;
create policy gallery_public_read on public.gallery_items
  for select using (featured or user_id = auth.uid() or public.is_staff());
drop policy if exists gallery_staff_write on public.gallery_items;
create policy gallery_staff_write on public.gallery_items
  for all using (public.is_staff()) with check (public.is_staff());

-- door_tag_scans: anyone may log a scan; staff read
drop policy if exists scans_insert on public.door_tag_scans;
create policy scans_insert on public.door_tag_scans for insert with check (true);
drop policy if exists scans_staff_select on public.door_tag_scans;
create policy scans_staff_select on public.door_tag_scans
  for select using (public.is_staff());

-- ═════════════════════════ SEED ═════════════════════════
insert into public.services (name, description, base_price, rate_per_m2, multiplier, sort)
values
  ('Residential Cleaning','Recurring care for your home — surfaces, floors, kitchens and baths returned to a quiet, ordered calm.',80,1.8,1.0,1),
  ('Signature Deep Clean','A meticulous top-to-bottom reset. Grout, baseboards, fixtures and the details most services overlook.',140,2.6,1.0,2),
  ('Move-In / Move-Out','Empty-home detailing so a space is flawless for its next chapter — or for handing back the keys.',160,2.9,1.0,3),
  ('Estate & Luxury Care','Discreet, white-glove housekeeping for larger residences, with a dedicated team and bespoke checklist.',240,3.4,1.0,4)
on conflict do nothing;

insert into public.pricing_rates (key, value, note) values
  ('points_per_dollar', 100, '100 points = $1 discount'),
  ('signup_bonus', 100, 'points granted on signup'),
  ('referral_bonus', 1000, 'points per successful referral')
on conflict (key) do nothing;

-- Storage bucket for before/after galleries (id + public read).
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;
