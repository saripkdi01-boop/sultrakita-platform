-- 035_referral_realtime_policies.sql
-- Upgrade referral world-class: langganan realtime client untuk event milik sendiri.
--
-- STATUS: FILE SAJA — JANGAN DI-APPLY tanpa persetujuan eksplisit pemilik.
-- Setelah di-apply, halaman /ajak-teman dapat berlangganan INSERT pada
-- referral_account_events yang difilter referrer_id = auth.uid() sehingga
-- statistik (kunjungan → signup → qualified) terbarui real-time tanpa polling.
-- Tanpa migrasi ini, halaman otomatis fallback ke polling 30 detik.
--
-- Keamanan: policy SELECT hanya untuk baris milik sendiri (auth.uid() =
-- referrer_id). Policy deny-all eksisting (FOR ALL USING (false)) tetap ada;
-- di Postgres, policy permissive digabung dengan OR sehingga SELECT milik
-- sendiri diizinkan sementara operasi lain tetap ditolak untuk klien.
-- Service role (dipakai /api/referral) bypass RLS seperti biasa.

DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    EXECUTE $sql$
      DROP POLICY IF EXISTS referral_account_events_select_own
        ON public.referral_account_events;
      CREATE POLICY referral_account_events_select_own
        ON public.referral_account_events
        FOR SELECT
        USING (auth.uid() = referrer_id);

      -- Index komposit untuk query analytics per referrer + tipe event.
      CREATE INDEX IF NOT EXISTS referral_account_events_referrer_type_created_idx
        ON public.referral_account_events (referrer_id, event_type, created_at DESC);

      -- Daftarkan tabel ke publikasi realtime agar langganan
      -- postgres_changes client menerima INSERT baru.
      DO $pub$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_publication_tables
          WHERE pubname = 'supabase_realtime'
            AND schemaname = 'public'
            AND tablename = 'referral_account_events'
        ) THEN
          ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_account_events;
        END IF;
      END
      $pub$;
    $sql$;
  END IF;
END
$migration$;
