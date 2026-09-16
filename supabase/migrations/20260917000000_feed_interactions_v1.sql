-- Suki Feed interaction source of truth.
-- Apply only after staging verification. This migration targets public.post_comments,
-- the social comments table already present in the remote Supabase project.

alter table public.post_comments
  add column if not exists idempotency_key text;

create unique index if not exists post_comments_user_idempotency_idx
  on public.post_comments(post_id, user_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.saved_posts (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.post_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'native' check (channel in ('native', 'clipboard', 'whatsapp')),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, idempotency_key)
);

create index if not exists saved_posts_user_created_idx
  on public.saved_posts(user_id, created_at desc);
create index if not exists post_shares_post_created_idx
  on public.post_shares(post_id, created_at desc);
create index if not exists post_comments_post_created_idx
  on public.post_comments(post_id, created_at asc);

alter table public.saved_posts enable row level security;
alter table public.post_shares enable row level security;

drop policy if exists saved_posts_select_own on public.saved_posts;
create policy saved_posts_select_own on public.saved_posts for select to authenticated using (auth.uid() = user_id);
drop policy if exists saved_posts_insert_own on public.saved_posts;
create policy saved_posts_insert_own on public.saved_posts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists saved_posts_delete_own on public.saved_posts;
create policy saved_posts_delete_own on public.saved_posts for delete to authenticated using (auth.uid() = user_id);

drop policy if exists post_shares_select_own on public.post_shares;
create policy post_shares_select_own on public.post_shares for select to authenticated using (auth.uid() = user_id);
drop policy if exists post_shares_insert_own on public.post_shares;
create policy post_shares_insert_own on public.post_shares for insert to authenticated with check (auth.uid() = user_id);

-- Preserve public comment visibility semantics already used by the social schema.
drop policy if exists post_comments_public_read on public.post_comments;
create policy post_comments_public_read on public.post_comments for select to anon, authenticated
  using (status = 'visible' and exists (
    select 1 from public.posts p
    where p.id = post_id and p.status = 'published'
      and (p.privacy = 'public' or p.user_id = auth.uid())
  ));

drop policy if exists post_comments_owner_insert on public.post_comments;
create policy post_comments_owner_insert on public.post_comments for insert to authenticated
  with check (auth.uid() = user_id and status = 'visible' and exists (
    select 1 from public.posts p
    where p.id = post_id and p.status = 'published'
      and (p.privacy = 'public' or p.user_id = auth.uid())
  ));
