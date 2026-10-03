-- Alert pencarian tersimpan properti (SUKI Suits).
--
-- FILE SAJA — JANGAN dijalankan ke database tanpa persetujuan eksplisit pemilik.
-- Kode matcher (`lib/property-saved-search.ts`) memakai kolom yang SUDAH ADA
-- (`saved_searches.filters` JSONB dengan penanda filters.target = 'properti'),
-- sehingga migrasi ini OPSIONAL: hanya indeks parsial agar query cron efisien.
--
-- Urutan aktivasi (semua butuh persetujuan pemilik):
--   1. Jalankan file ini di Supabase SQL Editor (idempoten).
--   2. Set env `PROPERTI_SAVED_SEARCH_ENABLED=true` di Vercel (All Environments)
--      lalu redeploy.
--   3. Pastikan `CRON_SECRET` ter-set dan cron saved-search-alerts terjadwal
--      (sudah ada di vercel.json — verifikasi manual).
-- Tanpa langkah 2, matcher selalu skip graceful dan tidak mengirim apa pun.

-- Indeks parsial: hanya baris alert properti yang aktif.
create index if not exists saved_searches_properti_alert_idx
  on public.saved_searches (alert_enabled, last_notified_at)
  where (filters ->> 'target') = 'properti';

-- Catatan: tidak ada perubahan data, tidak ada perubahan RLS.
-- Policy `saved_searches_owner` yang sudah ada tetap berlaku.
