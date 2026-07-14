-- Beaumont: sales representative applications.
-- Captures submissions from the private recruiting page (/prototype-christophe).
-- Anyone may submit an application (public form); only staff may read them.
-- Safe to re-run.

create table if not exists public.sales_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  motivation text not null,
  schedule_ok boolean not null default false,
  source text,
  created_at timestamptz not null default now()
);

alter table public.sales_applications enable row level security;

-- Public form: anyone (including anonymous visitors) may submit an application.
drop policy if exists sales_applications_insert on public.sales_applications;
create policy sales_applications_insert on public.sales_applications
  for insert with check (true);

-- Only staff may read the submitted applications.
drop policy if exists sales_applications_staff_select on public.sales_applications;
create policy sales_applications_staff_select on public.sales_applications
  for select using (public.is_staff());
