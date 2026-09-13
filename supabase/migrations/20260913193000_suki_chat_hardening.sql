-- SUKI Chat hardening: prevent duplicate buyer/seller threads for one listing.
-- Safe to apply after 20260913190000_suki_chat_live.sql.
create unique index if not exists suki_chat_listing_thread_unique_idx
  on public.suki_chat_conversations(listing_id, buyer_id, seller_id)
  where listing_id is not null and buyer_id is not null and seller_id is not null and type = 'private';

create index if not exists suki_chat_messages_search_idx
  on public.suki_chat_messages using gin (to_tsvector('simple', content));
