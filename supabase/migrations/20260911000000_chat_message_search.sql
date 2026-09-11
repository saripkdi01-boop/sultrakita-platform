-- Suki Chat message search index.
-- The participant membership check remains in the server action and RLS.
create index if not exists messages_content_search_idx
  on public.messages using gin (to_tsvector('simple', content));
