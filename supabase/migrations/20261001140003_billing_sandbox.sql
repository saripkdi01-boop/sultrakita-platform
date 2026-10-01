-- =====================================================================
-- SLICE-C: Monetisasi SANDBOX SukiApps
-- Fondasi billing: plans, entitlements, orders (sandbox), webhook events.
--
-- ATURAN KERAS:
--  - TIDAK ada pembayaran nyata di lapis ini. Provider = 'sandbox'.
--  - UI/dokumen TIDAK boleh mengklaim transaksi sukses / pengguna membayar.
--  - Bila provider nyata belum dikonfigurasi, tampilkan state jujur
--    `not_configured` (lihat env SUKI_BILLING_PROVIDER).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. billing_plans — katalog paket langganan (dikelola admin via UI)
-- ---------------------------------------------------------------------
create table if not exists public.billing_plans (
  id text primary key,                       -- 'free' | 'basic' | 'pro' | 'enterprise'
  name text not null,                        -- nama tampil, Indonesia
  price_monthly integer not null default 0 check (price_monthly >= 0),  -- IDR
  features jsonb not null default '{}'::jsonb,  -- { display: string[], entitlements: { key: limit|null } }
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. billing_entitlements — hak akses per pengguna per fitur
--    unique(user_id, feature_key): satu baris per fitur per pengguna.
-- ---------------------------------------------------------------------
create table if not exists public.billing_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.billing_plans(id),
  feature_key text not null,                 -- 'featured_listings' | 'boost_credits' | 'verified_business' | 'premium_job_posts'
  limit_value integer,                       -- null = tanpa batas angka (mis. boolean verified_business -> 1 = punya)
  used_value integer not null default 0,
  valid_until timestamptz,                   -- null = tanpa kedaluwarsa
  created_at timestamptz not null default now(),
  unique (user_id, feature_key)
);
create index if not exists billing_entitlements_user_idx on public.billing_entitlements(user_id);

-- ---------------------------------------------------------------------
-- 3. billing_orders — pesanan paket (SANDBOX saja)
--    Status: draft -> pending -> sandbox_paid | sandbox_failed | cancelled
--    INSERT HANYA via server (service role) — tanpa policy insert publik.
-- ---------------------------------------------------------------------
create table if not exists public.billing_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.billing_plans(id),
  amount integer not null check (amount >= 0),  -- IDR, snapshot harga saat checkout
  currency text not null default 'IDR',
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'sandbox_paid', 'sandbox_failed', 'cancelled')),
  provider text not null default 'sandbox',
  provider_ref text,                         -- referensi eksternal (sandbox: token simulasi)
  idempotency_key text unique,               -- UUID per checkout, mencegah duplikat
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists billing_orders_user_idx on public.billing_orders(user_id, created_at desc);
create index if not exists billing_orders_status_idx on public.billing_orders(status, created_at desc);

-- ---------------------------------------------------------------------
-- 4. webhook_events — log mentah callback (untuk idempotency + audit)
-- ---------------------------------------------------------------------
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                    -- 'sandbox' saat ini
  event_id text unique not null,             -- kunci idempotency
  payload jsonb not null,
  status text not null default 'received'
    check (status in ('received', 'processed', 'duplicate', 'rejected')),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists webhook_events_created_idx on public.webhook_events(created_at desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.billing_plans enable row level security;
alter table public.billing_entitlements enable row level security;
alter table public.billing_orders enable row level security;
alter table public.webhook_events enable row level security;

-- Plans: publik (anon + authenticated) hanya bisa baca yang aktif.
-- Admin baca semua (policy terpisah); tulis hanya via server (service role).
drop policy if exists billing_plans_public_read on public.billing_plans;
create policy billing_plans_public_read
  on public.billing_plans for select to anon, authenticated
  using (is_active = true);

drop policy if exists billing_plans_admin_read on public.billing_plans;
create policy billing_plans_admin_read
  on public.billing_plans for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
  );

-- Entitlements: pengguna hanya baca miliknya; admin baca semua.
drop policy if exists billing_entitlements_owner_read on public.billing_entitlements;
create policy billing_entitlements_owner_read
  on public.billing_entitlements for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists billing_entitlements_admin_read on public.billing_entitlements;
create policy billing_entitlements_admin_read
  on public.billing_entitlements for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
  );

-- Orders: pengguna hanya baca miliknya; admin baca semua.
-- TIDAK ada policy INSERT publik: order dibuat server-side (service role).
drop policy if exists billing_orders_owner_read on public.billing_orders;
create policy billing_orders_owner_read
  on public.billing_orders for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists billing_orders_admin_read on public.billing_orders;
create policy billing_orders_admin_read
  on public.billing_orders for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
  );

-- webhook_events: hanya admin yang baca.
drop policy if exists webhook_events_admin_read on public.webhook_events;
create policy webhook_events_admin_read
  on public.webhook_events for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
  );

-- ---------------------------------------------------------------------
-- Fungsi RPC: konsumsi 1 unit kuota secara atomik (anti double-spend).
-- Dipakai lib/billing/entitlements.ts -> useEntitlement().
-- ---------------------------------------------------------------------
create or replace function public.billing_consume_entitlement(p_user_id uuid, p_feature_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  update public.billing_entitlements
  set used_value = used_value + 1
  where id = (
    select id from public.billing_entitlements
    where user_id = p_user_id
      and feature_key = p_feature_key
      and (valid_until is null or valid_until > now())
    order by valid_until nulls last
    limit 1
  )
  and used_value < limit_value
  returning id into v_id;

  return v_id is not null;
end;
$$;

-- ---------------------------------------------------------------------
-- Seed 3 plan — harga ASUMSI (bukan harga final), dalam IDR.
-- ---------------------------------------------------------------------
insert into public.billing_plans (id, name, price_monthly, features, is_active) values
(
  'free',
  'Gratis',
  0,
  '{
    "display": [
      "Pasang listing tanpa batas",
      "1 lowongan kerja premium per bulan",
      "Dukungan komunitas"
    ],
    "entitlements": {
      "featured_listings": 0,
      "boost_credits": 0,
      "verified_business": 0,
      "premium_job_posts": 1
    }
  }'::jsonb,
  true
),
(
  'basic',
  'Basic',
  49000,
  '{
    "display": [
      "4 listing unggulan (featured) per bulan",
      "10 kredit boost per bulan",
      "1 lowongan kerja premium (5 posting/bulan)",
      "Lencana bisnis terverifikasi"
    ],
    "entitlements": {
      "featured_listings": 4,
      "boost_credits": 10,
      "verified_business": 1,
      "premium_job_posts": 5
    }
  }'::jsonb,
  true
),
(
  'pro',
  'Pro',
  149000,
  '{
    "display": [
      "20 listing unggulan (featured) per bulan",
      "50 kredit boost per bulan",
      "20 posting lowongan kerja premium per bulan",
      "Lencana bisnis terverifikasi",
      "Prioritas dukungan"
    ],
    "entitlements": {
      "featured_listings": 20,
      "boost_credits": 50,
      "verified_business": 1,
      "premium_job_posts": 20
    }
  }'::jsonb,
  true
)
on conflict (id) do update set
  name = excluded.name,
  price_monthly = excluded.price_monthly,
  features = excluded.features,
  is_active = excluded.is_active;
