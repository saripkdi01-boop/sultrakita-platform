# KNOWN LIMITATIONS — World-Class Execution

Hal yang belum bisa aktif/selesai karena kredensial, provider, data, atau approval manusia.
Diperbarui: 2026-10-01.

## Push ke origin — TERSEDIA VIA PARENT (update 2026-10-01 ~12:57 WITA)
- Sarip memberikan GitHub PAT; push dijalankan oleh parent agent (koordinator utama), BUKAN oleh subagent ini.
- Alur: setelah branch `upgrade/worldclass-execution` siap (commit rapi, tsc/lint/build lolos), laporkan ke parent: nama branch persis, hash commit, ringkasan isi, hasil verifikasi. Parent yang push ke origin.
- Subagent ini tetap TIDAK mencari/menebak/memakai kredensial apa pun di environment-nya.

## Pembayaran nyata — NOT CONFIGURED
- `SUKI_BILLING_PROVIDER=sandbox`; `SUKI_BILLING_WEBHOOK_SECRET` kosong.
- Aktivasi live (Xendit/Midtrans/dll.) butuh: akun provider, API key, webhook secret, kebijakan refund, dan persetujuan eksplisit Sarip.

## Rate limiter in-memory — keterbatasan
- Tidak berbagi state antar instance (Vercel multi-instance). Untuk produksi multi-region, ganti dengan Redis/Upstash.
- Restart instance me-reset counter (acceptable untuk proteksi brute-force dasar).

## Migrasi database — BELUM diterapkan
- File migrasi `supabase/migrations/2026100114*.sql` (audit_events, site_settings, billing_*, analytics_events) ditulis & direview, tetapi BELUM dijalankan ke database Supabase manapun.
- Perlu dijalankan via Supabase dashboard/CLI oleh manusia (atau dengan secret key) ke staging dulu, lalu produksi. Lihat `docs/OPERATIONS_RUNBOOK.md`.

## Merge dengan Fase 1 — TERSEDIA, rekonsiliasi saat integrasi (update 2026-10-01 ~13:00 WITA)
- `origin/upgrade/fase-1-ssr-seo-fondasi` (commit `72c5679`) sudah di-fetch. Merge ke branch ini SETELAH semua slice commit.
- OVERLAP yang harus direkonsiliasi saat merge (jangan duplikasi):
  - `next-app/lib/rate-limit.ts` (Fase 1, teruji burst→429 di 5 API routes) vs `next-app/lib/security/rate-limit.ts` (Slice-A): jadikan milik Fase 1 kanonis; middleware Slice-A memakai ulang.
  - `next-app/lib/dal.ts` (Fase 1: requireUser/requireRole) vs `next-app/lib/admin/guards.ts` (Slice-B): pakai `dal.ts` sebagai basis, guards hanya menambah maskPII/util admin.
  - `next-app/lib/env.ts` (Fase 1: validasi Zod fail-fast): pastikan kunci billing baru Slice-C terdaftar/konsisten.
- File Fase 1 yang kini BOLEH dibaca untuk rekonsiliasi (tetap jangan diedit sembarang): daftar 45 file di commit 72c5679.

## Chat — dinonaktifkan (Fase 0)
- `/chat` menampilkan halaman "segera hadir". Mengaktifkan kembali butuh keputusan produk + audit WS yang rusak (temuan Fase 0).

## Data & klaim
- Tidak ada data demo di produksi (dihapus Fase 0). Dashboard menampilkan empty state jujur sampai ada data nyata.
- Tidak ada klaim pengguna/pendapatan/verifikasi/pembayaran di mana pun.

## E2E browser
- Playwright tersedia (`npm run e2e`) tapi belum dijalankan di sesi ini untuk slice baru (prioritas: tsc+lint). Dijadwalkan saat integrasi bila browser tersedia.

---

## Visual Transformation V1.0 (2026-10-03)

- **KL-01 — Screenshot before/after lokal memakai kunci Supabase dummy.**
  `next start` butuh `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`; kunci asli tidak
  diambil dari vault (aturan kredensial). Screenshot memakai URL proyek asli +
  `visual-qc-dummy-key` → fetch data gagal gracefully, halaman tampil dalam
  state kosong/error. Perbandingan visual tetap valid untuk perubahan program
  ini (hero, kartu, empty state, login) yang tidak bergantung data.
- **KL-02 — `next start` (build baseline) mengembalikan 500 di semua rute**
  dengan env dummy, sementara `next dev` 200. Penyebab belum dipastikan;
  kemungkinan terkait prerender produksi + env dummy. Perlu investigasi bila
  akan dipakai untuk smoke test produksi-lokal. Build `next build` sendiri
  tidak terdampak (baseline sukses).
- **KL-03 — Verifikasi visual aktual butuh browser live (delegasi ke parent).**
  Screenshot Playwright lokal menutupi: layout desktop/mobile, tanpa overflow,
  render ilustrasi SVG. Tidak menutupi: tampilan di device fisik, performa
  Lighthouse, perilaku di browser non-Chromium.
- **KL-04 — Temuan audit P0 di luar cakupan visual tidak diperbaiki:**
  data lokasi properti salah massal; counter "0 bisnis terdaftar"; /marketplace
  tanpa SSR; 35× "0 dilihat · 0 disimpan". Diteruskan sebagai rekomendasi.
