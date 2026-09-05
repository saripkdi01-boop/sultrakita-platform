-- SUKI Chat realtime expansion.
-- Additive migration: preserves legacy conversations/listing chat columns.
create extension if not exists pgcrypto;

alter table public.conversations add column if not exists type text not null default 'private' check (type in ('private', 'group'));
alter table public.conversations add column if not exists name text;
alter table public.conversations add column if not exists avatar_url text;
alter table public.conversations add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.conversations add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.conversations add column if not exists updated_at timestamptz not null default now();

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  is_muted boolean not null default false,
  is_archived boolean not null default false,
  unique (conversation_id, user_id)
);

insert into public.conversation_participants (conversation_id, user_id, role)
select c.id, participant.user_id, case when participant.user_id = c.seller_id then 'admin' else 'member' end
from public.conversations c
cross join lateral (values (c.buyer_id), (c.seller_id)) as participant(user_id)
where participant.user_id is not null
on conflict (conversation_id, user_id) do nothing;

alter table public.messages add column if not exists message_type text not null default 'text' check (message_type in ('text', 'image', 'video', 'voice', 'file', 'system'));
alter table public.messages add column if not exists media_url text;
alter table public.messages add column if not exists media_metadata jsonb;
alter table public.messages add column if not exists reply_to_message_id uuid references public.messages(id) on delete set null;
alter table public.messages add column if not exists edited boolean not null default false;
alter table public.messages add column if not exists edited_at timestamptz;
alter table public.messages add column if not exists deleted boolean not null default false;
alter table public.messages add column if not exists deleted_at timestamptz;
alter table public.messages add column if not exists updated_at timestamptz not null default now();

create table if not exists public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (char_length(emoji) between 1 and 16),
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);

create table if not exists public.message_status (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('sent', 'delivered', 'read')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create table if not exists public.typing_indicators (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_typing boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table if not exists public.user_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_online boolean not null default false,
  last_seen timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_updated_idx on public.conversations(updated_at desc);
create index if not exists conversation_participants_user_idx on public.conversation_participants(user_id, conversation_id);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at desc);
create index if not exists message_reactions_message_idx on public.message_reactions(message_id);
create index if not exists message_status_message_idx on public.message_status(message_id);
create index if not exists typing_indicators_conversation_idx on public.typing_indicators(conversation_id, updated_at desc);

alter table public.conversation_participants enable row level security;
alter table public.message_reactions enable row level security;
alter table public.message_status enable row level security;
alter table public.typing_indicators enable row level security;
alter table public.user_presence enable row level security;

create or replace function public.is_conversation_member(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.conversation_participants where conversation_id = p_conversation_id and user_id = p_user_id); $$;
create or replace function public.is_conversation_admin(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.conversation_participants where conversation_id = p_conversation_id and user_id = p_user_id and role = 'admin'); $$;

drop policy if exists conversation_participants_select_own on public.conversation_participants;
create policy conversation_participants_select_own on public.conversation_participants for select to authenticated using (public.is_conversation_member(conversation_id));
drop policy if exists conversation_participants_manage_admin on public.conversation_participants;
create policy conversation_participants_manage_admin on public.conversation_participants for all to authenticated using (public.is_conversation_admin(conversation_id)) with check (public.is_conversation_admin(conversation_id));

drop policy if exists message_reactions_select_participant on public.message_reactions;
create policy message_reactions_select_participant on public.message_reactions for select to authenticated using (exists (select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));
drop policy if exists message_reactions_manage_own on public.message_reactions;
create policy message_reactions_manage_own on public.message_reactions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and exists (select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));

drop policy if exists message_status_select_participant on public.message_status;
create policy message_status_select_participant on public.message_status for select to authenticated using (exists (select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));
drop policy if exists message_status_manage_own on public.message_status;
create policy message_status_manage_own on public.message_status for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists typing_select_participant on public.typing_indicators;
create policy typing_select_participant on public.typing_indicators for select to authenticated using (public.is_conversation_member(conversation_id));
drop policy if exists typing_manage_own on public.typing_indicators;
create policy typing_manage_own on public.typing_indicators for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists presence_select_authenticated on public.user_presence;
create policy presence_select_authenticated on public.user_presence for select to authenticated using (true);
drop policy if exists presence_manage_own on public.user_presence;
create policy presence_manage_own on public.user_presence for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.touch_conversation_on_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message = coalesce(new.content, '[' || new.message_type || ']'), last_message_at = new.created_at, updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;
drop trigger if exists trg_touch_conversation_on_message on public.messages;
create trigger trg_touch_conversation_on_message after insert on public.messages for each row execute function public.touch_conversation_on_message();

create or replace function public.cleanup_stale_typing()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.typing_indicators where updated_at < now() - interval '10 seconds';
  return new;
end;
$$;
drop trigger if exists trg_cleanup_stale_typing on public.typing_indicators;
create trigger trg_cleanup_stale_typing after insert or update on public.typing_indicators for each row execute function public.cleanup_stale_typing();

-- Realtime delivery for the chat tables. Duplicate additions are ignored.
do $$ begin alter publication supabase_realtime add table public.conversation_participants; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.message_reactions; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.message_status; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.typing_indicators; exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.user_presence; exception when duplicate_object then null; when undefined_object then null; end $$;
