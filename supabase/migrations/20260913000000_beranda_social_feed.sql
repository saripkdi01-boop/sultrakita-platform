-- Beranda social feed: additive schema aligned with existing SultraKita profiles.
create extension if not exists pgcrypto;

alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists role text not null default 'warga' check (role in ('warga','seller','admin'));
alter table public.profiles add column if not exists whatsapp_number text;
alter table public.profiles add column if not exists is_verified boolean not null default false;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '', media_urls text[] not null default '{}', type text not null default 'post' check (type in ('post','reel','property')),
  location text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(post_id, user_id)
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);
create index if not exists posts_feed_idx on public.posts(created_at desc);
create index if not exists posts_user_idx on public.posts(user_id, created_at desc);
create index if not exists likes_post_idx on public.likes(post_id);
create index if not exists comments_post_idx on public.comments(post_id, created_at asc);

alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
drop policy if exists posts_public_read on public.posts; create policy posts_public_read on public.posts for select to anon, authenticated using (true);
drop policy if exists posts_owner_write on public.posts; create policy posts_owner_write on public.posts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists likes_public_read on public.likes; create policy likes_public_read on public.likes for select to anon, authenticated using (true);
drop policy if exists likes_owner_write on public.likes; create policy likes_owner_write on public.likes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists comments_public_read on public.comments; create policy comments_public_read on public.comments for select to anon, authenticated using (true);
drop policy if exists comments_owner_write on public.comments; create policy comments_owner_write on public.comments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

do $$ begin alter publication supabase_realtime add table public.posts; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.likes; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.comments; exception when duplicate_object then null; when undefined_object then null; end $$;
