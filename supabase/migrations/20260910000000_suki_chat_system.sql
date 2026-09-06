-- SUKI Chat system hardening (additive).
-- The core tables were introduced by 20260905220000_realtime_chat.sql.
-- This migration keeps that schema compatible while closing the remaining
-- conversation/message RLS and realtime publication gaps from the chat spec.

create extension if not exists pgcrypto;

create index if not exists messages_sender_created_idx
  on public.messages(sender_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_conversation_member(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = p_conversation_id and user_id = p_user_id
  );
$$;

drop policy if exists conversations_select_member on public.conversations;
create policy conversations_select_member on public.conversations
  for select to authenticated
  using (public.is_conversation_member(id));

drop policy if exists messages_select_member on public.messages;
create policy messages_select_member on public.messages
  for select to authenticated
  using (public.is_conversation_member(conversation_id));

drop policy if exists messages_insert_member on public.messages;
create policy messages_insert_member on public.messages
  for insert to authenticated
  with check (
    auth.uid() = sender_id
    and public.is_conversation_member(conversation_id)
  );

drop policy if exists messages_update_sender on public.messages;
create policy messages_update_sender on public.messages
  for update to authenticated
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

create or replace function public.suki_touch_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_suki_messages_updated_at on public.messages;
create trigger trg_suki_messages_updated_at
  before update on public.messages
  for each row execute function public.suki_touch_updated_at();

drop trigger if exists trg_suki_conversations_updated_at on public.conversations;
create trigger trg_suki_conversations_updated_at
  before update on public.conversations
  for each row execute function public.suki_touch_updated_at();

do $$ begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when undefined_object then null;
end $$;
