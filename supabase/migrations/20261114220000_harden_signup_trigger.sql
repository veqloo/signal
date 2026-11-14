-- Keep the auth.users trigger callable by PostgreSQL only.
-- Trigger execution does not require exposing the function through PostgREST.
alter function public.handle_new_user() set search_path = public, pg_temp;
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;
