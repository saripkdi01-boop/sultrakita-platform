-- T-ADMIN (2026-10-02): seed feature flag untuk login Facebook.
-- FILE-ONLY — BELUM dijalankan ke Supabase. Jalankan manual via SQL editor
-- atau sertakan saat menjalankan batch migrasi berikutnya.
--
-- facebook_login_enabled = false (default MATI):
--   * Provider Facebook BELUM di-enable di dashboard Supabase (butuh app
--     Facebook bernama SUKI milik owner) — menyalakan flag tanpa provider
--     hanya memunculkan tombol yang error "Unsupported provider".
--   * Untuk menyalakan: (1) enable provider Facebook di dashboard Supabase,
--     (2) set flag ini true dari /admin/settings (tanpa deploy ulang).
-- Idempotent: tidak menimpa nilai yang sudah diubah admin.

insert into public.site_settings (key, value, description) values
  ('facebook_login_enabled', 'false'::jsonb,
   'Tampilkan tombol "Lanjutkan dengan Facebook" di /login & /signup. Hanya berpengaruh bila provider Facebook sudah di-enable di dashboard Supabase.')
on conflict (key) do nothing;
