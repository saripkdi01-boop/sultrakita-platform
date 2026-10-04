-- FASE B4 (2026-10-03): pengumuman broadcast — tabel announcements.
--
-- CARA PAKAI: jalankan di Supabase Dashboard → SQL Editor (idempoten).
-- Publik hanya membaca pengumuman AKTIF dalam rentang waktu; kelola via admin.

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  link_url text null,
  link_label text null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz null,
  is_active boolean not null default true,
  audience text not null default 'all' check (audience in ('all')),
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists announcements_active_idx
  on public.announcements (is_active, starts_at desc);

alter table public.announcements enable row level security;

-- Publik (anon + authenticated): hanya yang aktif & dalam rentang waktu.
drop policy if exists announcements_public_read on public.announcements;
create policy announcements_public_read
  on public.announcements
  for select
  to anon, authenticated
  using (
    is_active = true
    and starts_at <= now()
    and (ends_at is null or ends_at > now())
  );

-- Kelola (insert/update/delete): hanya admin / super_admin.
drop policy if exists announcements_admin_write on public.announcements;
create policy announcements_admin_write
  on public.announcements
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );
