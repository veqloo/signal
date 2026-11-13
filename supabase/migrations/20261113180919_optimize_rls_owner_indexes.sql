create index if not exists businesses_owner_id_idx on public.businesses(owner_id);

drop policy if exists "Owners can read their businesses" on public.businesses;
create policy "Owners can read their businesses"
  on public.businesses for select to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Owners can create their businesses" on public.businesses;
create policy "Owners can create their businesses"
  on public.businesses for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Owners can update their businesses" on public.businesses;
create policy "Owners can update their businesses"
  on public.businesses for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "Owners can delete their businesses" on public.businesses;
create policy "Owners can delete their businesses"
  on public.businesses for delete to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Owners can read feedback for their businesses" on public.feedback;
create policy "Owners can read feedback for their businesses"
  on public.feedback for select to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = feedback.business_id and b.owner_id = (select auth.uid())
  ));
