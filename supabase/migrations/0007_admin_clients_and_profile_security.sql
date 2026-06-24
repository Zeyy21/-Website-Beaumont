-- Support staff client lookup and lock customer-controlled profile fields.

alter table public.profiles
  add column if not exists email text;

update public.profiles as profile
set email = lower(auth_user.email)
from auth.users as auth_user
where profile.id = auth_user.id
  and profile.email is null;

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.profile_self_update_allowed(
  profile_id uuid,
  new_email text,
  new_role text,
  new_points_balance integer,
  new_referral_code text,
  new_referred_by uuid,
  new_created_at timestamptz
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles as existing
    where existing.id = profile_id
      and existing.id = auth.uid()
      and existing.email is not distinct from new_email
      and existing.role = new_role
      and existing.points_balance = new_points_balance
      and existing.referral_code = new_referral_code
      and existing.referred_by is not distinct from new_referred_by
      and existing.created_at = new_created_at
  );
$$;

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update
  using (id = auth.uid())
  with check (
    public.profile_self_update_allowed(
      id,
      email,
      role,
      points_balance,
      referral_code,
      referred_by,
      created_at
    )
  );

-- Defense in depth for PostgREST: authenticated users only need to edit their
-- own profile contact fields. Staff role management should happen via SQL or a
-- dedicated staff-only function, not broad customer profile updates.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    lower(new.email),
    case
      when lower(new.email) = 'beaumontgroup.net@gmail.com' then 'staff'
      else 'customer'
    end
  )
  on conflict (id) do update
  set email = coalesce(public.profiles.email, lower(new.email)),
      role = case
        when lower(new.email) = 'beaumontgroup.net@gmail.com' then 'staff'
        else public.profiles.role
      end;

  insert into public.rewards_ledger (user_id, delta, reason)
  values (new.id, 100, 'signup_bonus')
  on conflict (user_id) where reason = 'signup_bonus' do nothing;

  return new;
end;
$$;
