-- LAUNCH T5 (observability): atribusi signup per kanal UTM.
--
-- STATUS: FILE-ONLY — BELUM DIJALANKAN ke Supabase production.
-- Cara menjalankan (butuh akses dashboard Supabase / psql dengan service role):
--   1. Buka Supabase Dashboard → SQL Editor (project ibvcfdfsjpytwpnxgylm).
--   2. Tempel seluruh isi file ini, jalankan.
--   3. Verifikasi: \d public.profiles menampilkan kolom utm_source/utm_medium/utm_campaign.
--   4. Sampai migrasi ini dijalankan, seksi "CAC per kanal UTM" di /admin/overview
--      menampilkan status jujur "belum tersedia" (bukan angka palsu).
--
-- DESAIN:
--   - Kolom nullable di public.profiles: diisi SEKALI saat profil dibuat
--     (dari cookie landing page yang menyimpan utm_* pertama kali pengunjung tiba).
--   - Nilai UTM bukan PII (hanya nama kanal/kampanye), aman untuk agregasi admin.
--   - Wiring penangkapan (middleware menulis cookie sk_utm_* + trigger/function
--     menyalin ke profiles saat insert) BELUM diimplementasikan — follow-up terpisah.
--     Kolom ini disiapkan dulu agar skema siap sebelum wiring.
--   - CAC (biaya per akuisisi) tetap butuh data biaya iklan per kanal dari luar DB;
--     kolom ini hanya memberi pembagi (jumlah pendaftar per kanal), bukan CAC penuh.

alter table public.profiles
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

comment on column public.profiles.utm_source is
  'Kanal akuisisi pendaftar (mis. google, instagram, tiktok, referral). Diisi saat signup dari cookie landing; BUTUH wiring penangkapan (belum diimplementasikan). Bukan PII.';
comment on column public.profiles.utm_medium is
  'Medium akuisisi (mis. cpc, social, organic, email). Lihat utm_source.';
comment on column public.profiles.utm_campaign is
  'Nama kampanye iklan/konten. Lihat utm_source.';

-- Agregasi "pendaftar per kanal" di /admin/overview memakai indeks ini.
create index if not exists profiles_utm_source_created_idx
  on public.profiles (utm_source, created_at desc)
  where utm_source is not null;
