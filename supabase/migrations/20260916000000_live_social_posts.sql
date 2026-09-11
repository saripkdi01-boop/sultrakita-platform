-- Live social post publishing: additive fields for the existing posts table.
-- Apply after 20260913000000_beranda_social_feed.sql.
alter table public.posts
  add column if not exists privacy text not null default 'public',
  add column if not exists status text not null default 'published',
  add column if not exists idempotency_key text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_privacy_check') then
    alter table public.posts add constraint posts_privacy_check check (privacy in ('public', 'followers'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'posts_status_check') then
    alter table public.posts add constraint posts_status_check check (status in ('draft', 'published', 'archived'));
  end if;
end $$;

create unique index if not exists posts_user_idempotency_key_idx
  on public.posts(user_id, idempotency_key)
  where idempotency_key is not null;

-- Public posts are readable by everyone; follower-only posts are readable by the author
-- or users who follow the author. Drafts and archived posts never enter the public feed.
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts for select to anon, authenticated
using (
  status = 'published'
  and (
    privacy = 'public'
    or auth.uid() = user_id
    or exists (
      select 1 from public.follows
      where follows.follower_id = auth.uid()
        and follows.following_id = posts.user_id
    )
  )
);

drop policy if exists posts_owner_write on public.posts;
create policy posts_owner_write on public.posts for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists posts_status_privacy_created_idx
  on public.posts(status, privacy, created_at desc);
