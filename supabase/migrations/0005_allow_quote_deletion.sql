-- Allow users to delete their own quotes
drop policy if exists quotes_owner_delete on public.quotes;
create policy quotes_owner_delete on public.quotes
  for delete using (user_id = auth.uid() or public.is_staff());
