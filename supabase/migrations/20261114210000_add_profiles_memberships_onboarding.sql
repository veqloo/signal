-- Signal by Veqlo: Profiles, Memberships, and Onboarding Schema
create extension if not exists pgcrypto;

-- 1. User Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Automatically create profile, business and location on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_biz_name text;
  v_biz_slug text;
  v_biz_cat text;
  v_biz_id uuid;
begin
  -- 1. Create user profile
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;

  -- 2. Create initial business if metadata provided
  v_biz_name := coalesce(new.raw_user_meta_data->>'business_name', 'My Business');
  v_biz_slug := coalesce(new.raw_user_meta_data->>'business_slug', lower(regexp_replace(v_biz_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(new.id::text, 1, 4));
  v_biz_cat := coalesce(new.raw_user_meta_data->>'business_category', 'Café & Restaurant');

  insert into public.businesses (owner_id, name, slug, category, onboarding_completed)
  values (new.id, v_biz_name, v_biz_slug, v_biz_cat, false)
  returning id into v_biz_id;

  -- 3. Create initial main location
  if v_biz_id is not null then
    insert into public.locations (business_id, name, slug, is_active)
    values (v_biz_id, 'Main Location', 'main', true)
    on conflict do nothing;

    -- 4. Create business membership for owner
    insert into public.business_memberships (business_id, user_id, role)
    values (v_biz_id, new.id, 'owner')
    on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Enhance Businesses with onboarding and customization
alter table public.businesses
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists logo_url text,
  add column if not exists feedback_categories text[] default array['Quality', 'Service', 'Speed', 'Atmosphere', 'Cleanliness', 'Value', 'Other'];

-- 3. Business Memberships (Team collaboration)
create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique(business_id, user_id)
);

create index if not exists business_memberships_user_idx on public.business_memberships(user_id);
create index if not exists business_memberships_biz_idx on public.business_memberships(business_id);

alter table public.business_memberships enable row level security;

create policy "Members can read their business memberships"
  on public.business_memberships for select to authenticated
  using (user_id = (select auth.uid()));

-- Allow owners to manage team memberships
create policy "Owners can manage team memberships"
  on public.business_memberships for all to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_memberships.business_id and b.owner_id = (select auth.uid())
  ));
