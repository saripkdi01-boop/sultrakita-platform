alter table public.listings
  add column if not exists is_ai_assisted boolean not null default false,
  add column if not exists ai_generation_timestamp timestamptz;

create index if not exists listings_ai_assisted_idx
  on public.listings (is_ai_assisted, ai_generation_timestamp desc);
