drop policy if exists "ingelogd mag lezen" on storage.objects;
create policy "ingelogd mag lezen" on storage.objects
  for select to authenticated
  using (bucket_id = 'documenten');

drop policy if exists "beheerder mag uploaden" on storage.objects;
create policy "beheerder mag uploaden" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documenten' and public.is_beheerder());

drop policy if exists "beheerder mag wijzigen" on storage.objects;
create policy "beheerder mag wijzigen" on storage.objects
  for update to authenticated
  using (bucket_id = 'documenten' and public.is_beheerder())
  with check (bucket_id = 'documenten' and public.is_beheerder());

drop policy if exists "beheerder mag verwijderen" on storage.objects;
create policy "beheerder mag verwijderen" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documenten' and public.is_beheerder());