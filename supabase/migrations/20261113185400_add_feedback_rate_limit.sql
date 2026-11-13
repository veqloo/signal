create table if not exists public.feedback_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists feedback_rate_limits_ip_created_idx
  on public.feedback_rate_limits (ip_hash, created_at desc);
alter table public.feedback_rate_limits enable row level security;
