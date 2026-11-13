drop policy if exists "No client access to rate limit events" on public.feedback_rate_limits;
create policy "No client access to rate limit events"
  on public.feedback_rate_limits
  for all
  to anon, authenticated
  using (false)
  with check (false);
