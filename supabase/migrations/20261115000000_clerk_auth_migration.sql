-- ====================================================================
-- Signal by Veqlo: Clerk Third-Party Auth & Identity Migration
-- Fully resilient migration script (safe to run multiple times)
-- ====================================================================

-- Step 1: Ensure all required tables exist before modifying
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  slug text not null unique,
  category text,
  welcome_message text,
  google_review_url text,
  onboarding_completed boolean not null default false,
  logo_url text,
  feedback_categories text[] default array['Quality', 'Service', 'Speed', 'Atmosphere', 'Cleanliness', 'Value', 'Other'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  slug text not null,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(business_id, slug)
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  category text,
  comment text check (char_length(comment) <= 4000),
  status text not null default 'new' check (status in ('new', 'read', 'flagged', 'resolved', 'archived')),
  internal_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  feedback_id uuid references public.feedback(id) on delete set null,
  title text not null,
  message text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  email text not null,
  full_name text,
  avatar_url text,
  clerk_user_id text unique,
  legacy_auth_id uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id text not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique(business_id, user_id)
);

-- Step 2: DROP ALL EXISTING POLICIES FIRST
-- (PostgreSQL forbids altering column types if any policy references the column)
drop policy if exists "Owners can read their businesses" on public.businesses;
drop policy if exists "Owners can create their businesses" on public.businesses;
drop policy if exists "Owners can update their businesses" on public.businesses;
drop policy if exists "Owners can delete their businesses" on public.businesses;

drop policy if exists "Owners can read feedback for their businesses" on public.feedback;
drop policy if exists "Owners can update feedback for their businesses" on public.feedback;

drop policy if exists "Owners can read their business locations" on public.locations;
drop policy if exists "Owners can create their business locations" on public.locations;
drop policy if exists "Owners can update their business locations" on public.locations;
drop policy if exists "Owners can delete their business locations" on public.locations;
drop policy if exists "Owners can manage locations" on public.locations;

drop policy if exists "Owners can read their notifications" on public.notifications;
drop policy if exists "Owners can update their notifications" on public.notifications;
drop policy if exists "Owners can delete their notifications" on public.notifications;

drop policy if exists "Members can read their business memberships" on public.business_memberships;
drop policy if exists "Owners can manage team memberships" on public.business_memberships;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Step 3: DROP FOREIGN KEY CONSTRAINTS TO auth.users
alter table public.businesses
  drop constraint if exists businesses_owner_id_fkey;

alter table public.business_memberships
  drop constraint if exists business_memberships_user_id_fkey;

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

-- Step 4: CONVERT UUID COLUMNS TO TEXT (supports Clerk IDs like 'user_2...')
alter table public.businesses
  alter column owner_id type text using owner_id::text;

alter table public.business_memberships
  alter column user_id type text using user_id::text;

alter table public.profiles
  alter column id type text using id::text;

alter table public.profiles
  add column if not exists clerk_user_id text,
  add column if not exists legacy_auth_id uuid;

-- Backfill legacy_auth_id safely
do $$
begin
  update public.profiles
  set legacy_auth_id = id::uuid
  where legacy_auth_id is null
    and id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
exception when others then
  null;
end $$;

-- Step 5: HELPER FUNCTION FOR CLERK & SUPABASE USER ID
-- Extract 'sub' claim from JWT (works for both Clerk and legacy tokens, NEVER calls auth.uid())
create or replace function public.auth_user_id()
returns text as $$
  select coalesce(auth.jwt() ->> 'sub', '');
$$ language sql stable security definer;

-- Step 6: WEBHOOK IDEMPOTENCY TABLE
create table if not exists public.clerk_processed_emails (
  event_id text primary key,
  slug text not null,
  recipient text not null,
  processed_at timestamptz not null default now()
);

alter table public.clerk_processed_emails enable row level security;
drop policy if exists "Service role manages clerk_processed_emails" on public.clerk_processed_emails;
create policy "Service role manages clerk_processed_emails"
  on public.clerk_processed_emails for all
  to service_role using (true) with check (true);

-- Step 7: RECREATE ALL ROW LEVEL SECURITY POLICIES

-- Businesses
alter table public.businesses enable row level security;

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

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = public.auth_user_id() or clerk_user_id = public.auth_user_id());

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = public.auth_user_id() or clerk_user_id = public.auth_user_id())
  with check (id = public.auth_user_id() or clerk_user_id = public.auth_user_id());

-- Business Memberships
alter table public.business_memberships enable row level security;

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

-- Locations
alter table public.locations enable row level security;

create policy "Owners can read their business locations"
  on public.locations for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can create their business locations"
  on public.locations for insert to authenticated
  with check (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can update their business locations"
  on public.locations for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can delete their business locations"
  on public.locations for delete to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id
      and b.owner_id = public.auth_user_id()
  ));

-- Feedback
alter table public.feedback enable row level security;

create policy "Owners can read feedback for their businesses"
  on public.feedback for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can update feedback for their businesses"
  on public.feedback for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id
      and b.owner_id = public.auth_user_id()
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id
      and b.owner_id = public.auth_user_id()
  ));

-- Notifications
alter table public.notifications enable row level security;

create policy "Owners can read their notifications"
  on public.notifications for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can update their notifications"
  on public.notifications for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id
      and b.owner_id = public.auth_user_id()
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id
      and b.owner_id = public.auth_user_id()
  ));

create policy "Owners can delete their notifications"
  on public.notifications for delete to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id
      and b.owner_id = public.auth_user_id()
  ));
