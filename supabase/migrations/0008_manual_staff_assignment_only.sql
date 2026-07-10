-- Staff access is assigned manually in Supabase, never by public signup.
-- Existing staff accounts are left unchanged.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    lower(new.email)
  )
  on conflict (id) do update
  set email = coalesce(public.profiles.email, lower(new.email));

  insert into public.rewards_ledger (user_id, delta, reason)
  values (new.id, 100, 'signup_bonus')
  on conflict (user_id) where reason = 'signup_bonus' do nothing;

  return new;
end;
$$;
