-- Suki Properti / Suki Suites
create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) on delete cascade,
  category text not null check (category in ('rumah_sewa','kos_kosan','rumah_takeover','lelang','rumah_subsidi')),
  title text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  price_type text not null default 'total' check (price_type in ('per_bulan','per_tahun','total','mulai_dari')),
  land_area_sqm integer check (land_area_sqm is null or land_area_sqm >= 0),
  building_area_sqm integer check (building_area_sqm is null or building_area_sqm >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  furnished boolean not null default false,
  district text not null,
  city text not null default 'Kendari',
  address_detail text,
  maps_link text,
  shm_status text,
  is_bank_verified boolean not null default false,
  images text[] not null default '{}',
  video_url text,
  status text not null default 'available' check (status in ('available','rented','sold','archived')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_category_idx on public.properties(category, status);
create index if not exists properties_district_idx on public.properties(district, status);
create index if not exists properties_price_idx on public.properties(price);
create index if not exists properties_featured_idx on public.properties(is_featured, created_at desc);

alter table public.properties enable row level security;
drop policy if exists "Public can view available properties" on public.properties;
create policy "Public can view available properties" on public.properties for select to anon, authenticated using (status = 'available');
drop policy if exists "Sellers can manage own properties" on public.properties;
create policy "Sellers can manage own properties" on public.properties for all to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create or replace function public.touch_properties_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at before update on public.properties for each row execute function public.touch_properties_updated_at();

insert into public.subcategories (category_id, name, slug, display_order)
select c.id, v.name, v.slug, v.display_order
from public.categories c
cross join (values ('Properti','properti',3)) v(name, slug, display_order)
where c.slug = 'properti'
on conflict (category_id, slug) do nothing;
