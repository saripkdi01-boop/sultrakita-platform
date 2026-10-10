-- Aplikasi pengajuan KPR via integrasi perbankan.
-- BELUM DIJALANKAN ke production — butuh approval suki via Supabase SQL Editor.
--
-- PRINSIP PRIVASI:
-- - NIK/KTP TIDAK PERNAH disimpan plain di tabel ini. Hanya nik_hash
--   (SHA-256) sebagai referensi deduplikasi; verifikasi identitas asli
--   terjadi di sisi bank (e-KYC), bukan di database SUKI.

create table if not exists public.banking_kpr_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  provider_code text not null default 'mock',
  external_ref text,
  status text not null default 'draft'
    check (status in ('draft','submitted','verifying','approved','rejected','disbursed','cancelled')),
  bank_code text not null,
  applicant_name text not null,
  nik_hash text,
  phone text,
  monthly_income numeric,
  employment_type text,
  property_price numeric not null,
  down_payment numeric not null,
  tenor_years int not null check (tenor_years between 1 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_banking_kpr_user
  on public.banking_kpr_applications(user_id, created_at desc);
create index if not exists idx_banking_kpr_property
  on public.banking_kpr_applications(property_id);
create index if not exists idx_banking_kpr_external
  on public.banking_kpr_applications(provider_code, external_ref);

alter table public.banking_kpr_applications enable row level security;

-- User hanya membaca pengajuannya sendiri.
create policy "user read own kpr applications"
  on public.banking_kpr_applications for select
  using (auth.uid() = user_id);

-- Insert/update hanya via service role (server action) — tidak ada policy
-- insert/update publik. Webhook bank memakai service role juga.
