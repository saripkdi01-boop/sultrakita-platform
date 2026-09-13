-- SUKI Community interactions: comments and typed reactions.
create table if not exists public.group_post_comments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  post_id uuid not null references public.group_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_post_reactions (
  post_id uuid not null references public.group_posts(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like','support','insight')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, reaction_type)
);

create index if not exists group_post_comments_feed_idx on public.group_post_comments (post_id, created_at asc);
create index if not exists group_post_comments_group_idx on public.group_post_comments (group_id, created_at desc);
create index if not exists group_post_reactions_feed_idx on public.group_post_reactions (post_id, reaction_type, created_at desc);

alter table public.group_post_comments enable row level security;
alter table public.group_post_reactions enable row level security;

drop policy if exists group_post_comments_read on public.group_post_comments;
create policy group_post_comments_read on public.group_post_comments for select using (
  exists (
    select 1 from public.groups g
    left join public.group_members gm on gm.group_id = g.id and gm.user_id = auth.uid() and gm.status = 'active'
    where g.id = group_id and (g.privacy = 'public' or gm.user_id is not null)
  )
);
drop policy if exists group_post_comments_insert on public.group_post_comments;
create policy group_post_comments_insert on public.group_post_comments for insert with check (
  auth.uid() = author_id and exists (
    select 1 from public.group_members gm where gm.group_id = group_id and gm.user_id = auth.uid() and gm.status = 'active'
  )
);
drop policy if exists group_post_comments_author_update on public.group_post_comments;
create policy group_post_comments_author_update on public.group_post_comments for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists group_post_comments_moderate_delete on public.group_post_comments;
create policy group_post_comments_moderate_delete on public.group_post_comments for delete using (
  auth.uid() = author_id or exists (
    select 1 from public.group_members gm where gm.group_id = group_id and gm.user_id = auth.uid() and gm.role in ('owner','moderator') and gm.status = 'active'
  )
);

drop policy if exists group_post_reactions_read on public.group_post_reactions;
create policy group_post_reactions_read on public.group_post_reactions for select using (
  exists (
    select 1 from public.groups g
    left join public.group_members gm on gm.group_id = g.id and gm.user_id = auth.uid() and gm.status = 'active'
    where g.id = group_id and (g.privacy = 'public' or gm.user_id is not null)
  )
);
drop policy if exists group_post_reactions_insert on public.group_post_reactions;
create policy group_post_reactions_insert on public.group_post_reactions for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.group_members gm where gm.group_id = group_id and gm.user_id = auth.uid() and gm.status = 'active'
  )
);
drop policy if exists group_post_reactions_delete on public.group_post_reactions;
create policy group_post_reactions_delete on public.group_post_reactions for delete using (auth.uid() = user_id);

do $$ begin alter publication supabase_realtime add table public.group_post_comments; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.group_post_reactions; exception when duplicate_object then null; end $$;
