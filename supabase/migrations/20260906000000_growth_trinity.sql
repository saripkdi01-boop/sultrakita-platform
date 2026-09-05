-- SultraKita Growth & Engagement Trinity
-- Uses hashed/session-safe identifiers and keeps analytics writes append-only.
create extension if not exists pgcrypto;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id bigint references public.listings(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  last_message text,
  last_message_at timestamptz not null default now(),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  unique(listing_id, buyer_id, seller_id),
  check (buyer_id <> seller_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.listing_analytics (
  id uuid primary key default gen_random_uuid(),
  listing_id bigint not null references public.listings(id) on delete cascade,
  event_type text not null check (event_type in ('view','contact_click','share')),
  visitor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_url text not null,
  thumbnail_url text,
  caption text check (char_length(caption) <= 500),
  district text,
  views_count integer not null default 0 check (views_count >= 0),
  likes_count integer not null default 0 check (likes_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists conversations_participant_idx on public.conversations(buyer_id, seller_id, last_message_at desc);
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at asc);
create index if not exists listing_analytics_listing_idx on public.listing_analytics(listing_id, created_at desc);
create index if not exists reels_discovery_idx on public.reels(is_active, district, created_at desc);

-- Replaceable view definition keeps seller_id compatible with legacy bigint or UUID listings.
drop materialized view if exists public.seller_daily_stats;
create materialized view public.seller_daily_stats as
select l.seller_id::text as seller_id,
  date(l.created_at) as stat_date,
  count(la.id) filter (where la.event_type = 'view') as total_views,
  count(la.id) filter (where la.event_type = 'contact_click') as total_contacts,
  count(distinct c.id) as total_conversations
from public.listings l
left join public.listing_analytics la on la.listing_id = l.id
left join public.conversations c on c.listing_id = l.id and c.seller_id::text = l.seller_id::text
group by l.seller_id::text, date(l.created_at);
create unique index if not exists seller_daily_stats_unique_idx on public.seller_daily_stats(seller_id, stat_date);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.listing_analytics enable row level security;
alter table public.reels enable row level security;

drop policy if exists conversations_participant_select on public.conversations;
create policy conversations_participant_select on public.conversations for select to authenticated using (auth.uid() in (buyer_id, seller_id));
drop policy if exists conversations_participant_insert on public.conversations;
create policy conversations_participant_insert on public.conversations for insert to authenticated with check (auth.uid() in (buyer_id, seller_id));
drop policy if exists conversations_participant_update on public.conversations;
create policy conversations_participant_update on public.conversations for update to authenticated using (auth.uid() in (buyer_id, seller_id)) with check (auth.uid() in (buyer_id, seller_id));

drop policy if exists messages_participant_select on public.messages;
create policy messages_participant_select on public.messages for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)));
drop policy if exists messages_participant_insert on public.messages;
create policy messages_participant_insert on public.messages for insert to authenticated with check (sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)));
drop policy if exists messages_participant_update on public.messages;
create policy messages_participant_update on public.messages for update to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)));

drop policy if exists listing_analytics_insert_public on public.listing_analytics;
create policy listing_analytics_insert_public on public.listing_analytics for insert to anon, authenticated with check (true);
drop policy if exists listing_analytics_owner_select on public.listing_analytics;
create policy listing_analytics_owner_select on public.listing_analytics for select to authenticated using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id::text = auth.uid()::text));

drop policy if exists reels_public_select on public.reels;
create policy reels_public_select on public.reels for select to anon, authenticated using (is_active = true or user_id = auth.uid());
drop policy if exists reels_owner_insert on public.reels;
create policy reels_owner_insert on public.reels for insert to authenticated with check (user_id = auth.uid());
drop policy if exists reels_owner_update on public.reels;
create policy reels_owner_update on public.reels for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists reels_owner_delete on public.reels;
create policy reels_owner_delete on public.reels for delete to authenticated using (user_id = auth.uid());

-- Realtime delivery for chat and reels. Safe on projects where publication already exists.
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.reels;
exception when duplicate_object then null; when undefined_object then null; end $$;
