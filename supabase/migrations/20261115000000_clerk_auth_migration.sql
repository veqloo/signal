-- ====================================================================
-- Signal by Veqlo: Clerk Third-Party Auth & Identity Migration
-- Safe, non-destructive migration script
-- ====================================================================

-- 1. Helper function to extract user ID from either Clerk JWT or legacy Supabase Auth
create or replace function public.auth_user_id()
returns text as $$
  select coalesce(
    nullif(auth.jwt() ->> 'sub', ''),
    (select auth.uid())::text,
    ''
  );
$$ language sql stable security definer;

-- 2. Drop existing foreign key constraints against auth.users
alter table public.businesses
  drop constraint if exists businesses_owner_id_fkey;

alter table public.business_memberships
  drop constraint if exists business_memberships_user_id_fkey;

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

-- 3. Convert UUID columns to TEXT to support Clerk string user IDs
alter table public.businesses
  alter column owner_id type text using owner_id::text;

alter table public.business_memberships
  alter column user_id type text using user_id::text;

alter table public.profiles
  alter column id type text using id::text;

-- 4. Add identity linkage columns to profiles
alter table public.profiles
  add column if not exists clerk_user_id text unique,
  add column if not exists legacy_auth_id uuid unique;

-- Backfill legacy_auth_id for existing rows where id was a valid UUID
update public.profiles
set legacy_auth_id = id::uuid
where legacy_auth_id is null
  and id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- 5. Webhook idempotency table for Clerk email events
create table if not exists public.clerk_processed_emails (
  event_id text primary key,
  slug text not null,
  recipient text not null,
  processed_at timestamptz not null default now()
);

alter table public.clerk_processed_emails enable row level security;
-- Service role only; no client access
create policy "Service role manages clerk_processed_emails"
  on public.clerk_processed_emails for all
  to service_role using (true) with check (true);

-- 6. Rebuild Row Level Security Policies using public.auth_user_id()

-- --- Businesses ---
drop policy if exists "Owners can read their businesses" on public.businesses;
drop policy if exists "Owners can create their businesses" on public.businesses;
drop policy if exists "Owners can update their businesses" on public.businesses;
drop policy if exists "Owners can delete their businesses" on public.businesses;

create policy "Owners can read their businesses"
  on public.businesses for select to authenticated
  using (owner_id = public.auth_user_id());

create policy "Owners can create their businesses"
  on public.businesses for insert to authenticated
  with check (owner_id = public.auth_user_id());

create policy "Owners can update their businesses"
  on public.businesses for update to authenticated
  using (owner_id = public.auth_user_id())
  with check (owner_id = public.auth_user_id());

create policy "Owners can delete their businesses"
  on public.businesses for delete to authenticated
  using (owner_id = public.auth_user_id());

-- --- Profiles ---
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = public.auth_user_id() or clerk_user_id = public.auth_user_id());

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = public.auth_user_id() or clerk_user_id = public.auth_user_id())
  with check (id = public.auth_user_id() or clerk_user_id = public.auth_user_id());

-- --- Business Memberships ---
drop policy if exists "Members can read their business memberships" on public.business_memberships;
drop policy if exists "Owners can manage team memberships" on public.business_memberships;

create policy "Members can read their business memberships"
  on public.business_memberships for select to authenticated
  using (user_id = public.auth_user_id());

create policy "Owners can manage team memberships"
  on public.business_memberships for all to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_memberships.business_id
      and b.owner_id = public.auth_user_id()
  ));

-- --- Feedback ---
drop policy if exists "Owners can read feedback for their businesses" on public.feedback;

create policy "Owners can read feedback for their businesses"
  on public.feedback for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id
      and b.owner_id = public.auth_user_id()
  ));

-- --- Locations ---
drop policy if exists "Owners can manage locations" on public.locations;

create policy "Owners can manage locations"
  on public.locations for all to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ));
