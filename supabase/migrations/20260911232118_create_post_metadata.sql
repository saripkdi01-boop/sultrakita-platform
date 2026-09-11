-- Create Post metadata: additive, idempotent, and compatible with the live posts contract.
-- No existing post content or media is rewritten.
alter table public.posts
  add column if not exists mood text,
  add column if not exists tagged_user_ids uuid[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_mood_length_check') then
    alter table public.posts add constraint posts_mood_length_check
      check (mood is null or char_length(trim(mood)) between 1 and 40);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'posts_tagged_users_limit_check') then
    alter table public.posts add constraint posts_tagged_users_limit_check
      check (cardinality(tagged_user_ids) <= 10);
  end if;
end $$;

create index if not exists posts_tagged_users_gin_idx
  on public.posts using gin (tagged_user_ids);

comment on column public.posts.mood is 'Optional controlled feeling/activity label selected in Create Post.';
comment on column public.posts.tagged_user_ids is 'Validated public profile IDs tagged by the post author; max 10.';
