-- Keep auth.users inserts from being rolled back by optional profile metadata
-- or reward bookkeeping. This migration is safe to run repeatedly.

alter table public.profiles
  add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create the required profile first. Email is updated separately so a stale
  -- legacy profile with the same email cannot prevent creation of auth.users.
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
  set full_name = coalesce(
    nullif(excluded.full_name, ''),
    public.profiles.full_name
  );

  begin
    update public.profiles
    set email = lower(new.email)
    where id = new.id
      and nullif(new.email, '') is not null;
  exception
    when unique_violation then
      -- Email uniqueness is useful for client lookup, but a stale legacy row
      -- must never roll back creation of the authentication account.
      raise warning 'Profile email already belongs to another profile for auth user %', new.id;
  end;

  begin
    -- An unqualified ON CONFLICT works whether or not older deployments have
    -- the partial signup-bonus index from migration 0003.
    insert into public.rewards_ledger (user_id, delta, reason)
    values (new.id, 100, 'signup_bonus')
    on conflict do nothing;
  exception
    when others then
      -- Rewards are non-critical. A ledger problem must not block signup.
      raise warning 'Could not grant signup reward to auth user %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;
