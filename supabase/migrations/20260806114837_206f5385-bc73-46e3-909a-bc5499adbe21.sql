CREATE SCHEMA IF NOT EXISTS prive;
REVOKE ALL ON SCHEMA prive FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA prive TO service_role;

CREATE OR REPLACE FUNCTION prive.is_beheerder()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.profielen
    where id = auth.uid() and rol = 'beheerder'
  );
$$;

REVOKE ALL ON FUNCTION prive.is_beheerder() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION prive.is_beheerder() TO service_role;

DROP POLICY IF EXISTS "beheerder leest logboek" ON public.downloadlog;
CREATE POLICY "beheerder leest logboek" ON public.downloadlog
  FOR SELECT TO authenticated
  USING (prive.is_beheerder());

DROP POLICY IF EXISTS "beheerder beheert profielen" ON public.profielen;
CREATE POLICY "beheerder beheert profielen" ON public.profielen
  FOR ALL TO authenticated
  USING (prive.is_beheerder())
  WITH CHECK (prive.is_beheerder());

DROP POLICY IF EXISTS "eigen profiel lezen" ON public.profielen;
CREATE POLICY "eigen profiel lezen" ON public.profielen
  FOR SELECT TO authenticated
  USING ((id = auth.uid()) OR prive.is_beheerder());

DROP POLICY IF EXISTS "beheerder mag uploaden" ON storage.objects;
CREATE POLICY "beheerder mag uploaden" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documenten' AND prive.is_beheerder());

DROP POLICY IF EXISTS "beheerder mag wijzigen" ON storage.objects;
CREATE POLICY "beheerder mag wijzigen" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documenten' AND prive.is_beheerder())
  WITH CHECK (bucket_id = 'documenten' AND prive.is_beheerder());

DROP POLICY IF EXISTS "beheerder mag verwijderen" ON storage.objects;
CREATE POLICY "beheerder mag verwijderen" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documenten' AND prive.is_beheerder());

DROP FUNCTION IF EXISTS public.is_beheerder();