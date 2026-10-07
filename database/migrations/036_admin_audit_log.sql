-- 036_admin_audit_log.sql
-- Tabel audit append-only untuk semua aksi API admin (/api/admin/*).
-- Ditulis LANGSUNG dari route (bukan diserahkan ke bot) — temuan P1 audit 8 Okt 2026.
--
-- Append-only: hanya INSERT yang diizinkan via RLS. Tidak ada policy
-- UPDATE/DELETE → riwayat tidak bisa diubah/dihapus dari aplikasi.
-- PENTING: jalankan via Supabase SQL Editor (butuh approval Sarip untuk production).

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  route       TEXT NOT NULL,                       -- mis. /api/admin/write
  method      TEXT NOT NULL DEFAULT 'POST',
  actor       TEXT NOT NULL DEFAULT 'bot',         -- sumber: bot | dashboard
  action      TEXT NOT NULL,                       -- mis. update/delete/approve
  target_table TEXT,
  target_id   TEXT,
  detail      JSONB,                               -- ringkasan perubahan (tanpa secret)
  ip          TEXT,
  ok          BOOLEAN NOT NULL DEFAULT true,
  error       TEXT
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created
  ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_route
  ON public.admin_audit_log (route, created_at DESC);

-- RLS: nyalakan, hanya service_role yang bisa INSERT/SELECT.
-- Tidak ada policy UPDATE/DELETE = append-only di level database.
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_service_all ON public.admin_audit_log;
CREATE POLICY audit_log_service_all ON public.admin_audit_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Tidak ada policy untuk anon/authenticated → mereka tidak bisa baca/tulis.
