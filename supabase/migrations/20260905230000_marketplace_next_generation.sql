-- SUKI Marketplace next-generation foundation.
-- Additive and compatible with the existing UUID listings table.
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  icon_url text, display_order integer not null default 0, is_active boolean not null default true, metadata jsonb not null default '{}'::jsonb
);
create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(), category_id uuid not null references public.categories(id) on delete cascade,
  name text not null, slug text not null, display_order integer not null default 0, unique(category_id, slug)
);

alter table public.listings add column if not exists seller_id uuid references auth.users(id) on delete set null;
alter table public.listings add column if not exists description text;
alter table public.listings add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.listings add column if not exists subcategory_id uuid references public.subcategories(id) on delete set null;
alter table public.listings add column if not exists original_price numeric;
alter table public.listings add column if not exists is_negotiable boolean not null default true;
alter table public.listings add column if not exists stock_quantity integer not null default 1;
alter table public.listings add column if not exists sku text;
alter table public.listings add column if not exists variants jsonb not null default '[]'::jsonb;
alter table public.listings add column if not exists images text[] not null default '{}';
alter table public.listings add column if not exists thumbnail_url text;
alter table public.listings add column if not exists district text;
alter table public.listings add column if not exists city text default 'Kendari';
alter table public.listings add column if not exists province text default 'Sulawesi Tenggara';
alter table public.listings add column if not exists latitude numeric(10,8);
alter table public.listings add column if not exists longitude numeric(11,8);
alter table public.listings add column if not exists exact_location boolean not null default false;
alter table public.listings add column if not exists condition text;
alter table public.listings add column if not exists specifications jsonb not null default '{}'::jsonb;
alter table public.listings add column if not exists ai_generated boolean not null default false;
alter table public.listings add column if not exists ai_metadata jsonb not null default '{}'::jsonb;
alter table public.listings add column if not exists moderation_status text not null default 'approved';
alter table public.listings add column if not exists moderation_reason text;
alter table public.listings add column if not exists reported_count integer not null default 0;
alter table public.listings add column if not exists published_at timestamptz;
alter table public.listings add column if not exists expires_at timestamptz;
alter table public.listings add column if not exists is_local_product boolean not null default false;
update public.listings set seller_id = owner_id where seller_id is null and owner_id is not null;
update public.listings set district = location where district is null and location is not null;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_number text unique not null default ('SK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  buyer_id uuid not null references auth.users(id) on delete restrict, seller_id uuid not null references auth.users(id) on delete restrict,
  listing_id uuid not null references public.listings(id) on delete restrict, quantity integer not null default 1 check (quantity > 0),
  subtotal numeric not null check (subtotal >= 0), shipping_cost numeric not null default 0 check (shipping_cost >= 0), platform_fee numeric not null default 0 check (platform_fee >= 0), total numeric not null check (total >= 0),
  shipping_method text, shipping_address jsonb not null default '{}'::jsonb, tracking_number text,
  payment_method text check (payment_method in ('transfer', 'qris', 'ewallet', 'cod')), payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded','failed')),
  escrow_status text not null default 'held' check (escrow_status in ('held','released','refunded')), status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','returned')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewee_id uuid not null references auth.users(id) on delete cascade, listing_id uuid not null references public.listings(id) on delete cascade, rating integer not null check (rating between 1 and 5), comment text, photos text[] not null default '{}', response text, is_verified_purchase boolean not null default true, is_flagged boolean not null default false, created_at timestamptz not null default now(), unique(order_id, reviewer_id)
);
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(), seller_id uuid not null references auth.users(id) on delete cascade, listing_id uuid not null references public.listings(id) on delete cascade,
  type text not null check (type in ('flash_sale','discount','bundle','boost','featured')), discount_percentage integer, discount_amount numeric, starts_at timestamptz not null, ends_at timestamptz not null, budget numeric, spent numeric not null default 0, target_districts text[] not null default '{}', status text not null default 'draft' check (status in ('draft','active','paused','completed','cancelled')), created_at timestamptz not null default now()
);
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, listing_id uuid not null references public.listings(id) on delete cascade, created_at timestamptz not null default now(), unique(user_id, listing_id)
);
create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, listing_id uuid not null references public.listings(id) on delete cascade, target_price numeric not null check (target_price >= 0), is_triggered boolean not null default false, created_at timestamptz not null default now(), unique(user_id, listing_id)
);
create table if not exists public.marketplace_reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references auth.users(id) on delete cascade, reported_user_id uuid references auth.users(id) on delete set null, reported_listing_id uuid references public.listings(id) on delete cascade, order_id uuid references public.orders(id) on delete set null, reason text not null, description text, evidence_photos text[] not null default '{}', status text not null default 'pending' check (status in ('pending','under_review','resolved','dismissed')), resolution text, resolved_by uuid references auth.users(id) on delete set null, resolved_at timestamptz, created_at timestamptz not null default now()
);

insert into public.categories (name, slug, display_order, metadata) values
  ('Tenun & Kerajinan Buton', 'tenun-kerajinan-buton', 1, '{"local":true,"culture":"Buton"}'),
  ('Kuliner Khas Sultra', 'kuliner-khas-sultra', 2, '{"local":true,"culture":"Sultra"}'),
  ('Properti', 'properti', 3, '{}'), ('Kendaraan', 'kendaraan', 4, '{}'), ('Jasa Lokal', 'jasa-lokal', 5, '{}')
on conflict (slug) do nothing;

create index if not exists listings_marketplace_discovery_idx on public.listings(district, city, status, created_at desc);
create index if not exists listings_marketplace_category_idx on public.listings(category_id, status, price);
create index if not exists listings_marketplace_seller_idx on public.listings(seller_id, status, created_at desc);
create index if not exists orders_buyer_idx on public.orders(buyer_id, created_at desc);
create index if not exists orders_seller_idx on public.orders(seller_id, status, created_at desc);
create index if not exists reviews_listing_idx on public.reviews(listing_id, rating);
create index if not exists promotions_active_idx on public.promotions(listing_id, status, starts_at, ends_at);

alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.promotions enable row level security;
alter table public.wishlists enable row level security;
alter table public.price_alerts enable row level security;
alter table public.marketplace_reports enable row level security;

drop policy if exists categories_public_read on public.categories; create policy categories_public_read on public.categories for select to anon, authenticated using (is_active = true);
drop policy if exists subcategories_public_read on public.subcategories; create policy subcategories_public_read on public.subcategories for select to anon, authenticated using (true);
drop policy if exists orders_participant_read on public.orders; create policy orders_participant_read on public.orders for select to authenticated using (auth.uid() in (buyer_id, seller_id));
drop policy if exists orders_buyer_insert on public.orders; create policy orders_buyer_insert on public.orders for insert to authenticated with check (auth.uid() = buyer_id);
drop policy if exists orders_participant_update on public.orders; create policy orders_participant_update on public.orders for update to authenticated using (auth.uid() in (buyer_id, seller_id)) with check (auth.uid() in (buyer_id, seller_id));
drop policy if exists reviews_public_read on public.reviews; create policy reviews_public_read on public.reviews for select to anon, authenticated using (is_flagged = false);
drop policy if exists reviews_buyer_insert on public.reviews; create policy reviews_buyer_insert on public.reviews for insert to authenticated with check (auth.uid() = reviewer_id);
drop policy if exists reviews_owner_update on public.reviews; create policy reviews_owner_update on public.reviews for update to authenticated using (auth.uid() in (reviewer_id, reviewee_id));
drop policy if exists promotions_public_read on public.promotions; create policy promotions_public_read on public.promotions for select to anon, authenticated using (status = 'active' and now() between starts_at and ends_at);
drop policy if exists promotions_seller_manage on public.promotions; create policy promotions_seller_manage on public.promotions for all to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
drop policy if exists wishlists_own_manage on public.wishlists; create policy wishlists_own_manage on public.wishlists for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists price_alerts_own_manage on public.price_alerts; create policy price_alerts_own_manage on public.price_alerts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists reports_own_manage on public.marketplace_reports; create policy reports_own_manage on public.marketplace_reports for all to authenticated using (auth.uid() = reporter_id) with check (auth.uid() = reporter_id);
