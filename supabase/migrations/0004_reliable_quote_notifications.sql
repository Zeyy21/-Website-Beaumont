-- Persist every formal quote request before attempting email delivery.

alter table public.quotes
  add column if not exists requester_name text,
  add column if not exists requester_email text,
  add column if not exists account_email text,
  add column if not exists requester_phone text,
  add column if not exists service_name text,
  add column if not exists conditional_services jsonb not null default '[]'::jsonb,
  add column if not exists request_key uuid,
  add column if not exists notification_status text not null default 'pending',
  add column if not exists notification_error text,
  add column if not exists notification_sent_at timestamptz;

create unique index if not exists quotes_request_key_unique
  on public.quotes (request_key)
  where request_key is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'quotes_notification_status_check'
      and conrelid = 'public.quotes'::regclass
  ) then
    alter table public.quotes
      add constraint quotes_notification_status_check
      check (notification_status in ('pending', 'sent', 'failed'));
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.rewards_ledger (user_id, delta, reason)
  values (new.id, 100, 'signup_bonus')
  on conflict (user_id) where reason = 'signup_bonus' do nothing;

  return new;
end;
$$;

