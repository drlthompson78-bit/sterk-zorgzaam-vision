-- ============================================================================
-- Documentenportaal Sterk & Zorgzaam
--
-- Eenmalig uitvoeren in Supabase: open je project → SQL Editor → plak dit
-- bestand → Run. Het maakt de opslagmap aan, regelt wie wat mag, en houdt bij
-- wie welk bestand downloadt.
-- ============================================================================


-- 1. Profielen -------------------------------------------------------------
-- Elk account krijgt een profiel met een rol. 'beheerder' mag uploaden en
-- verwijderen, 'auditor' mag alleen bekijken en downloaden.

create table if not exists public.profielen (
  id uuid primary key references auth.users (id) on delete cascade,
  naam text not null default '',
  rol text not null default 'auditor' check (rol in ('beheerder', 'auditor')),
  aangemaakt timestamptz not null default now()
);

alter table public.profielen enable row level security;

-- Iedereen die is ingelogd ziet zijn eigen profiel; beheerders zien alles.
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

drop policy if exists "beheerder beheert profielen" on public.profielen;
create policy "beheerder beheert profielen" on public.profielen
  for all to authenticated
  using (public.is_beheerder())
  with check (public.is_beheerder());


-- 2. Nieuw account krijgt automatisch een profiel --------------------------

create or replace function public.nieuw_profiel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profielen (id, naam)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'naam', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists op_nieuw_account on auth.users;
create trigger op_nieuw_account
  after insert on auth.users
  for each row execute function public.nieuw_profiel();


-- 3. Opslag ----------------------------------------------------------------
-- Privé map: niets is publiek opvraagbaar. Downloaden gaat via een link die
-- de app per klik aanmaakt en die na een minuut verloopt.

insert into storage.buckets (id, name, public)
values ('documenten', 'documenten', false)
on conflict (id) do update set public = false;

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


-- 4. Downloadlogboek -------------------------------------------------------
-- Bewijs voor de audit: wie heeft wanneer welk bestand opgehaald.

create table if not exists public.downloadlog (
  id bigint generated always as identity primary key,
  gebruiker uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pad text not null,
  tijdstip timestamptz not null default now()
);

alter table public.downloadlog enable row level security;

drop policy if exists "eigen download vastleggen" on public.downloadlog;
create policy "eigen download vastleggen" on public.downloadlog
  for insert to authenticated
  with check (gebruiker = auth.uid());

drop policy if exists "beheerder leest logboek" on public.downloadlog;
create policy "beheerder leest logboek" on public.downloadlog
  for select to authenticated
  using (public.is_beheerder());


-- ============================================================================
-- Daarna nog twee dingen in de Supabase-interface:
--
-- 1. Authentication → Providers → Email: zet "Confirm email" uit als je zelf
--    accounts aanmaakt, en zet "Enable signups" UIT. Zonder dat kan iedereen
--    zichzelf een account geven.
--
-- 2. Authentication → Users → Add user: maak je eigen account aan. Voer daarna
--    hieronder je e-mailadres in en draai deze regel om jezelf beheerder te
--    maken:
--
--    update public.profielen set rol = 'beheerder'
--    where id = (select id from auth.users where email = 'jouw@email.nl');
-- ============================================================================
