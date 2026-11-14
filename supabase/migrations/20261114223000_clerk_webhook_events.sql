-- Durable idempotency for Clerk webhooks.
create table if not exists public.clerk_webhook_events (
  event_id text primary key,
  event_type text not null,
  status text not null default 'processing'
    check (status in ('processing', 'processed')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.clerk_webhook_events enable row level security;
revoke all on table public.clerk_webhook_events from public, anon, authenticated;
grant all on table public.clerk_webhook_events to service_role;

drop policy if exists "Service role manages clerk_webhook_events"
  on public.clerk_webhook_events;
create policy "Service role manages clerk_webhook_events"
  on public.clerk_webhook_events
  for all
  to service_role
  using (true)
  with check (true);

create index if not exists clerk_webhook_events_created_at_idx
  on public.clerk_webhook_events(created_at);
