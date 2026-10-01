-- SLICE-B (2026-10-01): site_settings untuk feature flags + maintenance mode.
-- Pemilik tabel: SLICE-B. Helper getFlag ada di next-app/lib/settings/flags.ts.
-- Catatan integrasi: kolom is_suspended & admin_notes ditambahkan ke profiles
-- oleh migrasi ini (additive, idempotent) untuk modul admin/users.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_settings enable row level security;

-- Seed flag awal (idempotent)
insert into public.site_settings (key, value, description) values
  ('maintenance_mode', 'false'::jsonb, 'Bila true, middleware menampilkan halaman perawatan ke semua pengunjung non-admin.'),
  ('announcement_bar', 'null'::jsonb, 'Teks pengumuman di bar atas situs; null = tidak tampil.'),
  ('signup_enabled', 'true'::jsonb, 'Bila false, pendaftaran akun baru dinonaktifkan sementara.')
on conflict (key) do nothing;

-- Kolom moderasi untuk admin/users (additive, aman untuk RLS yang sudah ada)
alter table public.profiles add column if not exists is_suspended boolean not null default false;
alter table public.profiles add column if not exists admin_notes text;
create index if not exists profiles_is_suspended_idx on public.profiles(is_suspended);

-- Helper: cek role admin dari sesi saat ini (dipakai policies di bawah)
create or replace function public.suki_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin') and coalesce(is_suspended, false) = false
  );
$$;

-- RLS: baca & tulis HANYA admin (termasuk super_admin).
-- INSERT/DELETE dibatasi ke admin juga karena modul settings butuh CRUD penuh
-- (keputusan SLICE-B: "tanpa INSERT/DELETE publik" diartikan sebagai tanpa akses
-- non-admin; audit log dicatat per mutasi di layer aplikasi).
drop policy if exists site_settings_admin_select on public.site_settings;
create policy site_settings_admin_select on public.site_settings
  for select to authenticated using (public.suki_is_admin());

drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update on public.site_settings
  for update to authenticated using (public.suki_is_admin()) with check (public.suki_is_admin());

drop policy if exists site_settings_admin_insert on public.site_settings;
create policy site_settings_admin_insert on public.site_settings
  for insert to authenticated with check (public.suki_is_admin());

drop policy if exists site_settings_admin_delete on public.site_settings;
create policy site_settings_admin_delete on public.site_settings
  for delete to authenticated using (public.suki_is_admin());

-- Email kontak pengguna hanya boleh dibaca admin (dipakai modul admin/users
-- untuk pencarian & tampilan; RLS sebelumnya tidak punya SELECT policy).
drop policy if exists profile_contacts_admin_read on public.profile_contacts;
create policy profile_contacts_admin_read on public.profile_contacts
  for select to authenticated using (public.suki_is_admin());
