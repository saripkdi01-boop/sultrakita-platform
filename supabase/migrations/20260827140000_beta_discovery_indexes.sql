-- SultraKita Beta: index discovery, seller, analytics, dan moderation.
-- DDL ini aman dijalankan ulang karena seluruh index memakai IF NOT EXISTS.

create index if not exists listings_active_district_created_idx
  on public.listings (district, created_at desc)
  where status = 'active';

create index if not exists listings_active_category_created_idx
  on public.listings (category_id, created_at desc)
  where status = 'active';

create index if not exists listings_seller_status_created_idx
  on public.listings (seller_id, status, created_at desc);

create index if not exists analytics_events_name_created_idx
  on public.analytics_events (event_name, created_at desc);

create index if not exists analytics_events_listing_created_idx
  on public.analytics_events (listing_id, created_at desc)
  where listing_id is not null;

create index if not exists seller_verifications_user_status_created_idx
  on public.seller_verifications (user_id, status, created_at desc);

comment on index public.listings_active_district_created_idx is
  'Beta discovery: active listing feed per district, newest first';

comment on index public.seller_verifications_user_status_created_idx is
  'Beta trust: seller verification history and moderation queue lookup';
