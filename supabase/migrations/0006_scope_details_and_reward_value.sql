-- Store review-based quote notes and align reward value with the current points economy.

alter table public.quotes
  add column if not exists scope_details text;

insert into public.pricing_rates (key, value, note)
values ('points_per_dollar', 10, '100 points = $10 discount')
on conflict (key) do update
set value = excluded.value,
    note = excluded.note;
