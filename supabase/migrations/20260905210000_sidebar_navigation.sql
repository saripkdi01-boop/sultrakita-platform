-- SultraKita sidebar navigation data model.
-- Additive and idempotent; safe to run after privacy_security_core.
create extension if not exists pgcrypto;

create table if not exists public.user_shortcuts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  shortcut_type text not null check (shortcut_type in ('marketplace', 'groups', 'events', 'custom')),
  shortcut_data jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('listing', 'reel', 'post', 'group', 'event')),
  item_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

alter table if exists public.profiles
  add column if not exists app_preferences jsonb not null default '{"dark_mode":"system","language":"id","notifications_enabled":true,"sidebar_collapsed":false}'::jsonb;

create index if not exists user_shortcuts_user_order_idx on public.user_shortcuts(user_id, display_order);
create index if not exists saved_items_user_created_idx on public.saved_items(user_id, created_at desc);
create index if not exists activity_logs_user_date_idx on public.activity_logs(user_id, created_at desc);

alter table public.user_shortcuts enable row level security;
alter table public.saved_items enable row level security;

drop policy if exists user_shortcuts_select_own on public.user_shortcuts;
create policy user_shortcuts_select_own on public.user_shortcuts for select to authenticated using (auth.uid() = user_id);
drop policy if exists user_shortcuts_insert_own on public.user_shortcuts;
create policy user_shortcuts_insert_own on public.user_shortcuts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists user_shortcuts_update_own on public.user_shortcuts;
create policy user_shortcuts_update_own on public.user_shortcuts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists user_shortcuts_delete_own on public.user_shortcuts;
create policy user_shortcuts_delete_own on public.user_shortcuts for delete to authenticated using (auth.uid() = user_id);

drop policy if exists saved_items_select_own on public.saved_items;
create policy saved_items_select_own on public.saved_items for select to authenticated using (auth.uid() = user_id);
drop policy if exists saved_items_insert_own on public.saved_items;
create policy saved_items_insert_own on public.saved_items for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists saved_items_update_own on public.saved_items;
create policy saved_items_update_own on public.saved_items for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists saved_items_delete_own on public.saved_items;
create policy saved_items_delete_own on public.saved_items for delete to authenticated using (auth.uid() = user_id);

create or replace function public.get_user_memories(p_user_id uuid, days_ago integer default 365)
returns table (id uuid, memory_type text, memory_data jsonb, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select al.id, al.activity_type, al.activity_data, al.created_at
  from public.activity_logs al
  where al.user_id = p_user_id
    and al.created_at >= now() - make_interval(days => greatest(days_ago, 1))
    and al.activity_type in ('post_created', 'profile_updated', 'setting_changed')
  order by al.created_at desc
  limit 10;
$$;
revoke all on function public.get_user_memories(uuid, integer) from public;
grant execute on function public.get_user_memories(uuid, integer) to authenticated;
