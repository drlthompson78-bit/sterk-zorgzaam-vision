create table if not exists public.profielen (
  id uuid primary key references auth.users (id) on delete cascade,
  naam text not null default '',
  rol text not null default 'auditor' check (rol in ('beheerder', 'auditor')),
  aangemaakt timestamptz not null default now()
);

grant select, insert, update, delete on public.profielen to authenticated;
grant all on public.profielen to service_role;

alter table public.profielen enable row level security;

create or replace function public.is_beheerder()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profielen
    where id = auth.uid() and rol = 'beheerder'
  );
$$;

drop policy if exists "eigen profiel lezen" on public.profielen;
create policy "eigen profiel lezen" on public.profielen
  for select to authenticated
  using (id = auth.uid() or public.is_beheerder());

drop policy if exists "eigen profiel aanmaken" on public.profielen;
create policy "eigen profiel aanmaken" on public.profielen
  for insert to authenticated
  with check (id = auth.uid() and rol = 'auditor');

drop policy if exists "eigen naam bijwerken" on public.profielen;
create policy "eigen naam bijwerken" on public.profielen
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and rol = (select p.rol from public.profielen p where p.id = auth.uid()));

drop policy if exists "beheerder beheert profielen" on public.profielen;
create policy "beheerder beheert profielen" on public.profielen
  for all to authenticated
  using (public.is_beheerder())
  with check (public.is_beheerder());

create table if not exists public.downloadlog (
  id bigint generated always as identity primary key,
  gebruiker uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pad text not null,
  tijdstip timestamptz not null default now()
);

grant select, insert on public.downloadlog to authenticated;
grant all on public.downloadlog to service_role;

alter table public.downloadlog enable row level security;

drop policy if exists "eigen download vastleggen" on public.downloadlog;
create policy "eigen download vastleggen" on public.downloadlog
  for insert to authenticated
  with check (gebruiker = auth.uid());

drop policy if exists "beheerder leest logboek" on public.downloadlog;
create policy "beheerder leest logboek" on public.downloadlog
  for select to authenticated
  using (public.is_beheerder());