-- SUKI Chat live storage.
-- Additive schema: keeps legacy public.conversations/messages untouched.
create extension if not exists pgcrypto;

create table if not exists public.suki_chat_conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id bigint references public.listings(id) on delete set null,
  type text not null default 'private' check (type in ('private', 'group')),
  name text,
  avatar_url text,
  created_by uuid references auth.users(id) on delete set null,
  buyer_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  check (buyer_id is null or seller_id is null or buyer_id <> seller_id)
);

create table if not exists public.suki_chat_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.suki_chat_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  is_muted boolean not null default false,
  is_archived boolean not null default false,
  unique (conversation_id, user_id)
);

create table if not exists public.suki_chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.suki_chat_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  message_type text not null default 'text' check (message_type in ('text', 'image', 'video', 'voice', 'file', 'system')),
  media_url text,
  media_metadata jsonb,
  reply_to_message_id uuid references public.suki_chat_messages(id) on delete set null,
  edited boolean not null default false,
  deleted boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suki_chat_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.suki_chat_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (char_length(emoji) between 1 and 16),
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);

create table if not exists public.suki_chat_typing (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.suki_chat_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_typing boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table if not exists public.suki_chat_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_online boolean not null default false,
  last_seen timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists suki_chat_participants_user_idx on public.suki_chat_participants(user_id, conversation_id);
create index if not exists suki_chat_messages_conversation_idx on public.suki_chat_messages(conversation_id, created_at desc);
create index if not exists suki_chat_conversations_updated_idx on public.suki_chat_conversations(updated_at desc);
create index if not exists suki_chat_reactions_message_idx on public.suki_chat_reactions(message_id);

create or replace function public.suki_chat_is_member(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.suki_chat_participants where conversation_id = p_conversation_id and user_id = p_user_id); $$;

create or replace function public.suki_chat_is_admin(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.suki_chat_participants where conversation_id = p_conversation_id and user_id = p_user_id and role = 'admin'); $$;

create or replace function public.suki_chat_touch_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.suki_chat_conversations set last_message = new.content, last_message_at = new.created_at, updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;
drop trigger if exists suki_chat_touch_conversation on public.suki_chat_messages;
create trigger suki_chat_touch_conversation after insert on public.suki_chat_messages for each row execute function public.suki_chat_touch_conversation();

alter table public.suki_chat_conversations enable row level security;
alter table public.suki_chat_participants enable row level security;
alter table public.suki_chat_messages enable row level security;
alter table public.suki_chat_reactions enable row level security;
alter table public.suki_chat_typing enable row level security;
alter table public.suki_chat_presence enable row level security;

drop policy if exists suki_chat_conversations_select on public.suki_chat_conversations;
create policy suki_chat_conversations_select on public.suki_chat_conversations for select to authenticated using (public.suki_chat_is_member(id));
drop policy if exists suki_chat_conversations_insert on public.suki_chat_conversations;
create policy suki_chat_conversations_insert on public.suki_chat_conversations for insert to authenticated with check (created_by = (select auth.uid()));
drop policy if exists suki_chat_conversations_update on public.suki_chat_conversations;
create policy suki_chat_conversations_update on public.suki_chat_conversations for update to authenticated using (public.suki_chat_is_member(id)) with check (public.suki_chat_is_member(id));

create policy suki_chat_participants_select on public.suki_chat_participants for select to authenticated using (public.suki_chat_is_member(conversation_id));
create policy suki_chat_participants_insert on public.suki_chat_participants for insert to authenticated with check (public.suki_chat_is_admin(conversation_id) or user_id = (select auth.uid()));
create policy suki_chat_participants_update on public.suki_chat_participants for update to authenticated using (user_id = (select auth.uid()) or public.suki_chat_is_admin(conversation_id)) with check (user_id = (select auth.uid()) or public.suki_chat_is_admin(conversation_id));

create policy suki_chat_messages_select on public.suki_chat_messages for select to authenticated using (public.suki_chat_is_member(conversation_id));
create policy suki_chat_messages_insert on public.suki_chat_messages for insert to authenticated with check (sender_id = (select auth.uid()) and public.suki_chat_is_member(conversation_id));
create policy suki_chat_messages_update on public.suki_chat_messages for update to authenticated using (sender_id = (select auth.uid()) or public.suki_chat_is_admin(conversation_id));

create policy suki_chat_reactions_select on public.suki_chat_reactions for select to authenticated using (exists (select 1 from public.suki_chat_messages m where m.id = message_id and public.suki_chat_is_member(m.conversation_id)));
create policy suki_chat_reactions_manage on public.suki_chat_reactions for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (select 1 from public.suki_chat_messages m where m.id = message_id and public.suki_chat_is_member(m.conversation_id)));
create policy suki_chat_typing_select on public.suki_chat_typing for select to authenticated using (public.suki_chat_is_member(conversation_id));
create policy suki_chat_typing_manage on public.suki_chat_typing for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.suki_chat_is_member(conversation_id));
create policy suki_chat_presence_select on public.suki_chat_presence for select to authenticated using (true);
create policy suki_chat_presence_manage on public.suki_chat_presence for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

do $$ begin alter publication supabase_realtime add table public.suki_chat_conversations; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.suki_chat_participants; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.suki_chat_messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.suki_chat_reactions; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.suki_chat_typing; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.suki_chat_presence; exception when duplicate_object then null; end $$;
