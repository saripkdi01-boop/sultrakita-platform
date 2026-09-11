-- SUKI Communities: real, authenticated community spaces for SultraKita.
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 3 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 500),
  category text not null default 'umum' check (category in ('umum','jual_beli','wisata','kuliner','umkm','hobi','property','profesi')),
  privacy text not null default 'public' check (privacy in ('public','private')),
  cover_url text,
  member_count integer not null default 1 check (member_count >= 0),
  post_count integer not null default 0 check (post_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','moderator','member')),
  status text not null default 'active' check (status in ('active','pending','blocked')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  post_type text not null default 'discussion' check (post_type in ('discussion','question','announcement','event')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_rules (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  position integer not null default 1 check (position between 1 and 10),
  title text not null check (char_length(trim(title)) between 3 and 100),
  body text not null default '' check (char_length(body) <= 500),
  unique(group_id, position)
);

create table if not exists public.group_events (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  host_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 120),
  starts_at timestamptz not null,
  location text,
  created_at timestamptz not null default now()
);

create index if not exists groups_discovery_idx on public.groups (category, privacy, updated_at desc);
create index if not exists groups_owner_idx on public.groups (owner_id, created_at desc);
create index if not exists group_members_user_idx on public.group_members (user_id, status, joined_at desc);
create index if not exists group_posts_feed_idx on public.group_posts (group_id, is_pinned desc, created_at desc);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_posts enable row level security;
alter table public.group_rules enable row level security;
alter table public.group_events enable row level security;

drop policy if exists groups_public_read on public.groups;
create policy groups_public_read on public.groups for select using (privacy = 'public' or exists (select 1 from public.group_members gm where gm.group_id = id and gm.user_id = auth.uid() and gm.status = 'active'));
drop policy if exists groups_owner_insert on public.groups;
create policy groups_owner_insert on public.groups for insert with check (auth.uid() = owner_id);
drop policy if exists groups_owner_update on public.groups;
create policy groups_owner_update on public.groups for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists groups_owner_delete on public.groups;
create policy groups_owner_delete on public.groups for delete using (auth.uid() = owner_id);

drop policy if exists group_members_read on public.group_members;
create policy group_members_read on public.group_members for select using (auth.uid() = user_id or exists (select 1 from public.groups g where g.id = group_id and g.privacy = 'public'));
drop policy if exists group_members_join on public.group_members;
create policy group_members_join on public.group_members for insert with check (auth.uid() = user_id and status in ('active','pending'));
drop policy if exists group_members_self_leave on public.group_members;
create policy group_members_self_leave on public.group_members for delete using (auth.uid() = user_id);
drop policy if exists group_members_moderate on public.group_members;
create policy group_members_moderate on public.group_members for update using (exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())) with check (true);

drop policy if exists group_posts_read on public.group_posts;
create policy group_posts_read on public.group_posts for select using (exists (select 1 from public.groups g left join public.group_members gm on gm.group_id = g.id and gm.user_id = auth.uid() and gm.status = 'active' where g.id = group_id and (g.privacy = 'public' or gm.user_id is not null)));
drop policy if exists group_posts_member_insert on public.group_posts;
create policy group_posts_member_insert on public.group_posts for insert with check (auth.uid() = author_id and exists (select 1 from public.group_members gm where gm.group_id = group_id and gm.user_id = auth.uid() and gm.status = 'active'));
drop policy if exists group_posts_author_update on public.group_posts;
create policy group_posts_author_update on public.group_posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists group_posts_author_delete on public.group_posts;
create policy group_posts_author_delete on public.group_posts for delete using (auth.uid() = author_id or exists (select 1 from public.groups gm_group where gm_group.id = group_id and gm_group.owner_id = auth.uid()));

drop policy if exists group_rules_read on public.group_rules;
create policy group_rules_read on public.group_rules for select using (exists (select 1 from public.groups g where g.id = group_id and (g.privacy = 'public' or exists (select 1 from public.group_members gm where gm.group_id = g.id and gm.user_id = auth.uid() and gm.status = 'active'))));
drop policy if exists group_rules_manage on public.group_rules;
create policy group_rules_manage on public.group_rules for all using (exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())) with check (exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid()));

drop policy if exists group_events_read on public.group_events;
create policy group_events_read on public.group_events for select using (exists (select 1 from public.groups g where g.id = group_id and (g.privacy = 'public' or exists (select 1 from public.group_members gm where gm.group_id = g.id and gm.user_id = auth.uid() and gm.status = 'active'))));
drop policy if exists group_events_manage on public.group_events;
create policy group_events_manage on public.group_events for all using (auth.uid() = host_id or exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())) with check (auth.uid() = host_id);

create or replace function public.create_suki_group(
  p_name text, p_slug text, p_description text, p_category text, p_privacy text
) returns public.groups language plpgsql security invoker set search_path = public as $$
declare new_group public.groups;
begin
  insert into public.groups (owner_id, name, slug, description, category, privacy)
  values (auth.uid(), trim(p_name), lower(trim(p_slug)), coalesce(trim(p_description), ''), p_category, p_privacy)
  returning * into new_group;
  insert into public.group_members (group_id, user_id, role, status) values (new_group.id, auth.uid(), 'owner', 'active');
  return new_group;
end; $$;

do $$ begin alter publication supabase_realtime add table public.group_posts; exception when duplicate_object then null; end $$;
