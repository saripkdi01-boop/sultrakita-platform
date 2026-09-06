-- SUKI SUITS (PROPERTI) compatibility upgrade.
-- The base properties table already exists in 20260907000000_suki_properti.sql;
-- this migration adds the fields required by the new SUKI Suits contract safely.
create extension if not exists pgcrypto;

alter table if exists public.properties
  add column if not exists floors integer not null default 1,
  add column if not exists certificate_type text,
  add column if not exists latitude numeric(10,8),
  add column if not exists longitude numeric(11,8),
  add column if not exists views_count integer not null default 0,
  add column if not exists favorites_count integer not null default 0;

alter table if exists public.properties drop constraint if exists properties_price_type_check;
alter table if exists public.properties add constraint properties_price_type_check check (price_type in ('per_bulan','per_tahun','total','mulai_dari','nego'));
alter table if exists public.properties drop constraint if exists properties_certificate_type_check;
alter table if exists public.properties add constraint properties_certificate_type_check check (certificate_type is null or certificate_type in ('SHM','HGB','AJB','PPJB'));

create index if not exists properties_suki_suits_category_status_idx on public.properties(category, status);
create index if not exists properties_suki_suits_district_idx on public.properties(district, city);
create index if not exists properties_suki_suits_price_idx on public.properties(price);
create index if not exists properties_suki_suits_featured_idx on public.properties(is_featured, created_at desc);

alter table public.properties enable row level security;
drop policy if exists "Public can view available properties" on public.properties;
create policy "Public can view available properties" on public.properties for select to anon, authenticated using (status = 'available');
drop policy if exists suki_suits_properties_insert on public.properties;
create policy suki_suits_properties_insert on public.properties for insert to authenticated with check (auth.uid() = seller_id);
drop policy if exists suki_suits_properties_update on public.properties;
create policy suki_suits_properties_update on public.properties for update to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

update public.suki_ecosystem_apps set route = '/properti', updated_at = now() where slug = 'suki-suits';
update public.suki_ecosystem_apps set route = '/suki-marketplace', updated_at = now() where slug = 'suki-marketplace';
