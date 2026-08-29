-- SultraKita Social Beta: identity, follows, and realtime notifications.
-- Additive/idempotent: does not duplicate or alter the existing beta discovery indexes.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Warga Sultra',
  username text unique,
  avatar_url text,
  bio text,
  district text,
  is_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_not_self check (follower_id <> following_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null default 'activity',
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists follows_following_id_idx on public.follows (following_id, created_at desc);
create index if not exists notifications_recipient_created_idx on public.notifications (recipient_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications (recipient_id, created_at desc) where read_at is null;

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;

drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select using (true);

drop policy if exists profiles_owner_write on public.profiles;
create policy profiles_owner_write on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists follows_public_read on public.follows;
create policy follows_public_read on public.follows for select using (true);

drop policy if exists follows_owner_write on public.follows;
create policy follows_owner_write on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists follows_owner_delete on public.follows;
create policy follows_owner_delete on public.follows for delete using (auth.uid() = follower_id);

drop policy if exists notifications_recipient_read on public.notifications;
create policy notifications_recipient_read on public.notifications for select using (auth.uid() = recipient_id);

drop policy if exists notifications_recipient_update on public.notifications;
create policy notifications_recipient_update on public.notifications for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

-- Realtime is best-effort and idempotent: duplicate publication membership is ignored by the block.
do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

comment on table public.profiles is 'Social profile surface for the SultraKita beta frontend';
comment on table public.follows is 'Follower graph for optimistic follow UI and seller suggestions';
comment on table public.notifications is 'Realtime social notifications; payment status is never written by the frontend';
