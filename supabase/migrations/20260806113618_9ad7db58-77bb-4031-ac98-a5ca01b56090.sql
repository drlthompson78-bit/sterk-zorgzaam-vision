revoke all on function public.is_beheerder() from public;
revoke all on function public.is_beheerder() from anon;
grant execute on function public.is_beheerder() to authenticated;
grant execute on function public.is_beheerder() to service_role;