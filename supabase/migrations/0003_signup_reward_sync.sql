-- Award the advertised signup reward exactly once and reconcile profile totals
-- with the immutable reward ledger.

create unique index if not exists rewards_one_signup_bonus_per_user
  on public.rewards_ledger (user_id)
  where reason = 'signup_bonus';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.rewards_ledger (user_id, delta, reason)
  values (new.id, 100, 'signup_bonus')
  on conflict (user_id) where reason = 'signup_bonus' do nothing;

  return new;
end;
$$;

insert into public.rewards_ledger (user_id, delta, reason)
select profile.id, 100, 'signup_bonus'
from public.profiles as profile
where not exists (
  select 1
  from public.rewards_ledger as reward
  where reward.user_id = profile.id
    and reward.reason = 'signup_bonus'
)
on conflict (user_id) where reason = 'signup_bonus' do nothing;

update public.profiles as profile
set points_balance = coalesce((
  select sum(reward.delta)::integer
  from public.rewards_ledger as reward
  where reward.user_id = profile.id
), 0);
