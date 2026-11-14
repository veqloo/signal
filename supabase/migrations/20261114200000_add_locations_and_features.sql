-- Signal by Veqlo: Multi-location, status management, and notification system

-- 1. Locations table for multi-unit businesses (cafes, restaurants, retail shops)
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

create index if not exists locations_business_id_idx on public.locations(business_id);

alter table public.locations enable row level security;

create policy "Owners can read their business locations"
  on public.locations for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id and b.owner_id = (select auth.uid())
  ));

create policy "Owners can create their business locations"
  on public.locations for insert to authenticated
  with check (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id and b.owner_id = (select auth.uid())
  ));

create policy "Owners can update their business locations"
  on public.locations for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id and b.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id and b.owner_id = (select auth.uid())
  ));

create policy "Owners can delete their business locations"
  on public.locations for delete to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = locations.business_id and b.owner_id = (select auth.uid())
  ));

-- 2. Enhance feedback table with location_id, status, and internal_notes
alter table public.feedback
  add column if not exists location_id uuid references public.locations(id) on delete set null,
  add column if not exists status text not null default 'new' check (status in ('new', 'read', 'flagged', 'resolved', 'archived')),
  add column if not exists internal_notes text;

create index if not exists feedback_location_id_idx on public.feedback(location_id);
create index if not exists feedback_status_idx on public.feedback(status);

-- Allow owners to update feedback status and internal notes
create policy "Owners can update feedback for their businesses"
  on public.feedback for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id and b.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id and b.owner_id = (select auth.uid())
  ));

-- 3. In-app notifications table
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

create index if not exists notifications_business_created_idx
  on public.notifications(business_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Owners can read their notifications"
  on public.notifications for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id and b.owner_id = (select auth.uid())
  ));

create policy "Owners can update their notifications"
  on public.notifications for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id and b.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id and b.owner_id = (select auth.uid())
  ));

create policy "Owners can delete their notifications"
  on public.notifications for delete to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = notifications.business_id and b.owner_id = (select auth.uid())
  ));
