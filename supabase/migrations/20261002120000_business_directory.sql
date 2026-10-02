-- =====================================================================
-- Business Directory SUKI Apps — direktori bisnis /Business
-- Additive only: tabel baru + fungsi + index + RLS. Tidak ada DROP/ALTER
-- destruktif dan tidak ada seed data.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. public.businesses — profil bisnis
-- ---------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 3 and 120),
  slug text not null unique,
  category text not null,
  description text check (description is null or char_length(description) <= 2000),
  address text,
  city text not null default 'Kendari',
  province text not null default 'Sulawesi Tenggara',
  phone text,
  whatsapp text,
  email text,
  website text,
  logo_url text,
  cover_url text,
  hours jsonb not null default '{}'::jsonb,
  latitude double precision,
  longitude double precision,
  -- 'draft' dipertahankan di CHECK agar kompatibel dengan spesifikasi UI
  -- yang menyebut badge draft (draf belum dikirim untuk verifikasi).
  status text not null default 'pending'
    check (status in ('draft', 'pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists businesses_slug_uidx on public.businesses (slug);
create index if not exists businesses_status_idx on public.businesses (status);
create index if not exists businesses_category_idx on public.businesses (category);
create index if not exists businesses_city_idx on public.businesses (city);
create index if not exists businesses_owner_idx on public.businesses (owner_id);

-- ---------------------------------------------------------------------
-- 2. public.business_inquiries — pesan pengunjung ke bisnis
-- ---------------------------------------------------------------------
create table if not exists public.business_inquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  contact text not null check (char_length(contact) between 5 and 200),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists business_inquiries_business_idx on public.business_inquiries (business_id);

-- ---------------------------------------------------------------------
-- 3. Trigger updated_at untuk public.businesses
-- ---------------------------------------------------------------------
create or replace function public.update_businesses_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.update_businesses_updated_at();

-- ---------------------------------------------------------------------
-- 4. Function slug: lowercase, non-alnum -> '-', trim '-', suffix unik
-- ---------------------------------------------------------------------
create or replace function public.generate_business_slug(p_name text)
returns text as $$
declare
  base text;
  candidate text;
  suffix integer := 1;
begin
  base := lower(coalesce(p_name, ''));
  -- Ganti setiap urutan karakter non-alnum dengan satu '-'
  base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
  -- Hapus '-' di awal dan akhir
  base := regexp_replace(base, '^-+|-+$', '', 'g');
  if base = '' then
    base := 'bisnis';
  end if;

  candidate := base;
  while exists (select 1 from public.businesses where slug = candidate) loop
    suffix := suffix + 1;
    candidate := base || '-' || suffix::text;
  end loop;

  return candidate;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- 5. Function view counter (dipanggil publik via RPC)
-- ---------------------------------------------------------------------
create or replace function public.increment_business_views(p_id uuid)
returns void as $$
begin
  update public.businesses
  set view_count = view_count + 1
  where id = p_id;
end;
$$ language plpgsql security definer;

revoke all on function public.increment_business_views(uuid) from public;
grant execute on function public.increment_business_views(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. RLS
-- ---------------------------------------------------------------------
alter table public.businesses enable row level security;
alter table public.business_inquiries enable row level security;

-- --- businesses: SELECT ------------------------------------------------
drop policy if exists businesses_select on public.businesses;
create policy businesses_select on public.businesses
  for select
  using (
    status = 'approved'
    or auth.uid() = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- --- businesses: INSERT ------------------------------------------------
drop policy if exists businesses_insert on public.businesses;
create policy businesses_insert on public.businesses
  for insert
  with check (auth.uid() = owner_id);

-- --- businesses: UPDATE ------------------------------------------------
-- CATATAN: pembatasan "hanya admin yang boleh mengubah status/is_verified/
-- is_featured" diterapkan di lapisan API, bukan di policy ini.
drop policy if exists businesses_update on public.businesses;
create policy businesses_update on public.businesses
  for update
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  )
  with check (
    auth.uid() = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- --- businesses: DELETE ------------------------------------------------
drop policy if exists businesses_delete on public.businesses;
create policy businesses_delete on public.businesses
  for delete
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- --- business_inquiries: INSERT ----------------------------------------
-- Pengunjung boleh mengirim pesan hanya ke bisnis yang sudah disetujui.
drop policy if exists business_inquiries_insert on public.business_inquiries;
create policy business_inquiries_insert on public.business_inquiries
  for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.status = 'approved'
    )
  );

-- --- business_inquiries: SELECT / UPDATE -------------------------------
-- Hanya pemilik bisnis & admin. Tidak ada policy DELETE: inquiry
-- diarsipkan via status, bukan dihapus.
drop policy if exists business_inquiries_select on public.business_inquiries;
create policy business_inquiries_select on public.business_inquiries
  for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_inquiries.business_id
        and (
          b.owner_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role in ('admin', 'super_admin')
          )
        )
    )
  );

drop policy if exists business_inquiries_update on public.business_inquiries;
create policy business_inquiries_update on public.business_inquiries
  for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_inquiries.business_id
        and (
          b.owner_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role in ('admin', 'super_admin')
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_inquiries.business_id
        and (
          b.owner_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role in ('admin', 'super_admin')
          )
        )
    )
  );
