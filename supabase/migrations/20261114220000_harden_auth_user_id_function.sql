-- Harden the Clerk JWT identity helper.
-- RLS policies call this function as the authenticated request role.
create or replace function public.auth_user_id()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'sub', '');
$$;

-- The helper is only needed inside authenticated RLS policies.
revoke all on function public.auth_user_id() from PUBLIC, anon;
grant execute on function public.auth_user_id() to authenticated;
grant execute on function public.auth_user_id() to service_role;
