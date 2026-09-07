-- F2.4 AI Listing Assistant feedback: store seller sentiment only, never image or generated listing payload.
create table if not exists public.ai_listing_feedback (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  generation_id uuid not null,
  helpful boolean not null,
  comment text,
  corrected_fields text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint ai_listing_feedback_comment_length check (comment is null or char_length(comment) <= 1000),
  constraint ai_listing_feedback_generation_unique unique (seller_id, generation_id)
);

create index if not exists ai_listing_feedback_created_idx
  on public.ai_listing_feedback(created_at desc);
create index if not exists ai_listing_feedback_helpful_idx
  on public.ai_listing_feedback(helpful, created_at desc);

alter table public.ai_listing_feedback enable row level security;

drop policy if exists ai_listing_feedback_insert_own on public.ai_listing_feedback;
create policy ai_listing_feedback_insert_own on public.ai_listing_feedback
  for insert to authenticated
  with check (auth.uid() = seller_id);

drop policy if exists ai_listing_feedback_select_own on public.ai_listing_feedback;
create policy ai_listing_feedback_select_own on public.ai_listing_feedback
  for select to authenticated
  using (auth.uid() = seller_id);

comment on table public.ai_listing_feedback is 'Seller feedback metadata for AI listing assistant; excludes photos, prompts, AI output, API keys, and raw provider errors.';
