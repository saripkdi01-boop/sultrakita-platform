-- SLICE-A (2026-10-01): audit trail untuk aksi admin/moderasi (P0-3).
-- Kontrak aplikasi: next-app/lib/security/audit.ts -> logAuditEvent().
--
-- Desain:
-- - actor_id TANPA foreign key ke auth.users: baris audit harus bertahan
--   walau akun pelaku dihapus.
-- - RLS aktif. SELECT hanya untuk admin (profiles.role).
-- - SENGAJA tanpa policy INSERT/UPDATE/DELETE publik: penulisan hanya via
--   service-role key (bypass RLS) dari server, lewat logAuditEvent().

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid null,
  action text not null,
  target_type text not null,
  target_id text null,
  reason text null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists audit_events_created_at_idx
  on public.audit_events (created_at desc);
create index if not exists audit_events_actor_id_idx
  on public.audit_events (actor_id);
create index if not exists audit_events_target_idx
  on public.audit_events (target_type, target_id);

alter table public.audit_events enable row level security;

-- SELECT: hanya admin / super_admin (cek mandiri, tidak bergantung ke
-- migrasi lain agar urutan eksekusi aman).
drop policy if exists audit_events_admin_select on public.audit_events;
create policy audit_events_admin_select
  on public.audit_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin')
    )
  );

-- Catatan: tidak ada policy INSERT/UPDATE/DELETE -> hanya service_role
-- (bypass RLS) yang dapat menulis, dipanggil dari server via logAuditEvent().
