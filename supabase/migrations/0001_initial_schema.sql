-- Signal by Veqlo: initial Supabase schema
-- Run in the Supabase SQL editor after creating the project.
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  category text,
  welcome_message text,
  google_review_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  category text,
  comment text check (char_length(comment) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists feedback_business_created_idx
  on public.feedback (business_id, created_at desc);

alter table public.businesses enable row level security;
alter table public.feedback enable row level security;

create policy "Owners can read their businesses"
  on public.businesses for select to authenticated
  using (owner_id = auth.uid());

create policy "Owners can create their businesses"
  on public.businesses for insert to authenticated
  with check (owner_id = auth.uid());

create policy "Owners can update their businesses"
  on public.businesses for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Owners can delete their businesses"
  on public.businesses for delete to authenticated
  using (owner_id = auth.uid());

create policy "Owners can read feedback for their businesses"
  on public.feedback for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id and b.owner_id = auth.uid()
  ));

-- Public feedback submission is intentionally handled through a server-side
-- endpoint/Edge Function, not direct anonymous table INSERT access.
-- Never expose the service-role key in browser code.
