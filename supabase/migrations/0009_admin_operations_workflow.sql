-- Admin workflow fields for support, quoting, scheduling, and customer notes.

alter table public.profiles
  add column if not exists internal_notes text;

alter table public.quotes
  add column if not exists internal_notes text,
  add column if not exists scheduled_for timestamptz,
  add column if not exists completed_at timestamptz;
