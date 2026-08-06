REVOKE ALL ON FUNCTION public.is_beheerder() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_beheerder() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_beheerder() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_beheerder() TO service_role;