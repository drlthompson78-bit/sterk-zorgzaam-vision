-- ============================================================================
-- Deellinks aanscherpen voor het ISO-traject.
--
-- 1. Alleen beheerders mogen een openbare koppeling maken.
-- 2. Elk gebruik van zo'n koppeling wordt vastgelegd, zodat bij een audit
--    aantoonbaar is welk document wanneer is opgehaald.
-- ============================================================================


-- 1. Delen is voortaan een beheerdersrecht -----------------------------------

drop policy if exists "eigen deellink aanmaken" on public.deellinks;

create policy "beheerder maakt deellink" on public.deellinks
  for insert to authenticated
  with check (aangemaakt_door = auth.uid() and prive.is_beheerder());


-- 2. Logboek van gebruikte koppelingen ---------------------------------------
-- Bewust géén IP-adres: dat is een persoonsgegeven en voor de audit volstaat
-- welk document wanneer via welke koppeling is opgehaald.

create table if not exists public.deellink_gebruik (
  id bigint generated always as identity primary key,
  code text not null,
  pad text not null,
  tijdstip timestamptz not null default now()
);

create index if not exists deellink_gebruik_code_idx on public.deellink_gebruik (code);

alter table public.deellink_gebruik enable row level security;

grant select on public.deellink_gebruik to authenticated;
grant all on public.deellink_gebruik to service_role;

-- Schrijven gebeurt uitsluitend door de server (service role, omzeilt RLS);
-- lezen mag alleen de beheerder.
drop policy if exists "beheerder leest deellinkgebruik" on public.deellink_gebruik;
create policy "beheerder leest deellinkgebruik" on public.deellink_gebruik
  for select to authenticated
  using (prive.is_beheerder());
