-- SultraKita Privacy & Security Core
-- session_token is intended to store a one-way hash, never a raw bearer token.
create extension if not exists pgcrypto;

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('login','post_created','profile_updated','setting_changed','security_event')),
  activity_data jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_token text not null,
  device_info jsonb not null default '{}'::jsonb,
  ip_address inet,
  location text,
  is_current boolean not null default false,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table if exists public.profiles
  add column if not exists visibility_settings jsonb not null default '{"full_name":"public","username":"public","bio":"public","phone":"followers","email":"private","location":"public","interests":"public","online_status":"followers"}'::jsonb;

create index if not exists activity_logs_user_idx on public.activity_logs(user_id, created_at desc);
create index if not exists active_sessions_user_idx on public.active_sessions(user_id, last_active_at desc);
create unique index if not exists active_sessions_token_idx on public.active_sessions(session_token);
create index if not exists blocked_users_blocker_idx on public.blocked_users(blocker_id, created_at desc);

alter table public.activity_logs enable row level security;
alter table public.active_sessions enable row level security;
alter table public.blocked_users enable row level security;

-- No client can read session tokens; actions should select a safe projection server-side.
drop policy if exists activity_logs_select_own on public.activity_logs;
create policy activity_logs_select_own on public.activity_logs for select to authenticated using (auth.uid() = user_id);
drop policy if exists activity_logs_insert_own on public.activity_logs;
create policy activity_logs_insert_own on public.activity_logs for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists active_sessions_select_own on public.active_sessions;
create policy active_sessions_select_own on public.active_sessions for select to authenticated using (auth.uid() = user_id);
drop policy if exists active_sessions_delete_own on public.active_sessions;
create policy active_sessions_delete_own on public.active_sessions for delete to authenticated using (auth.uid() = user_id);

drop policy if exists blocked_users_select_own on public.blocked_users;
create policy blocked_users_select_own on public.blocked_users for select to authenticated using (auth.uid() = blocker_id);
drop policy if exists blocked_users_insert_own on public.blocked_users;
create policy blocked_users_insert_own on public.blocked_users for insert to authenticated with check (auth.uid() = blocker_id and blocker_id <> blocked_id);
drop policy if exists blocked_users_delete_own on public.blocked_users;
create policy blocked_users_delete_own on public.blocked_users for delete to authenticated using (auth.uid() = blocker_id);

-- Visibility is private to the owner; public profile rendering must apply this JSONB server-side.
drop policy if exists profiles_visibility_owner_update on public.profiles;
create policy profiles_visibility_owner_update on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
