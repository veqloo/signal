-- Cover the notifications.feedback_id foreign key for joins and deletes.
create index if not exists notifications_feedback_id_idx
  on public.notifications (feedback_id);
