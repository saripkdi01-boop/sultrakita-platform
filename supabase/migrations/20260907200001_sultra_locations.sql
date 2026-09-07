create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  province_name text not null default 'Sulawesi Tenggara',
  regency_name text not null,
  district_name text not null,
  subdistrict_name text not null,
  created_at timestamptz not null default now(),
  unique (regency_name, district_name, subdistrict_name)
);

alter table public.properties add column if not exists regency_name text not null default 'Kota Kendari';
alter table public.properties add column if not exists subdistrict_name text;
alter table public.properties add column if not exists location_id uuid references public.locations(id) on delete set null;

create index if not exists locations_regency_idx on public.locations(regency_name, district_name, subdistrict_name);
create index if not exists properties_location_idx on public.properties(regency_name, district, subdistrict_name);

alter table public.locations enable row level security;
drop policy if exists "Public can view locations" on public.locations;
create policy "Public can view locations" on public.locations for select to anon, authenticated using (true);
