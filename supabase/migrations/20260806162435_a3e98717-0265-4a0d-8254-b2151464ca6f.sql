create or replace function prive.is_portaallid()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profielen p
    where p.id = auth.uid() and p.rol in ('auditor','beheerder')
  )
$$;

revoke all on function prive.is_portaallid() from public, anon, authenticated;

drop policy if exists "ingelogd mag lezen" on storage.objects;
create policy "portaallid mag lezen" on storage.objects
  for select to authenticated
  using (bucket_id = 'documenten' and prive.is_portaallid());