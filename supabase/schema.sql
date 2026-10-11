-- Run in the dedicated project's SQL Editor. No public user can grant admin access.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;
create policy "Read own admin membership" on public.site_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.site_content (
  kind text primary key check (kind in ('projects', 'members', 'events', 'calendar')),
  content jsonb not null check (jsonb_typeof(content) = 'array'),
  version integer not null default 1 check (version > 0)
);
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;
create policy "Public content read" on public.site_content
  for select to anon, authenticated using (true);
create policy "Admin content insert" on public.site_content
  for insert to authenticated with check (
    exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
create policy "Admin content update" on public.site_content
  for update to authenticated using (
    exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

-- After creating the administrator in Authentication > Users, run:
-- insert into public.site_admins(user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
