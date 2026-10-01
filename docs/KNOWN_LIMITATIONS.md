# KNOWN LIMITATIONS — World-Class Execution

Hal yang belum bisa aktif/selesai karena kredensial, provider, data, atau approval manusia.
Diperbarui: 2026-10-01.

## Push ke origin — PENDING (butuh manusia)
- Branch `upgrade/worldclass-execution` hanya di-commit lokal di worktree ini.
- Push ke `origin` membutuhkan PAT GitHub sekali pakai dari Sarip (tidak ada kredensial di environment subagent; JANGAN akali).
- Setelah push: buat PR draft ke `main` untuk review (jangan merge langsung).

## Pembayaran nyata — NOT CONFIGURED
- `SUKI_BILLING_PROVIDER=sandbox`; `SUKI_BILLING_WEBHOOK_SECRET` kosong.
- Aktivasi live (Xendit/Midtrans/dll.) butuh: akun provider, API key, webhook secret, kebijakan refund, dan persetujuan eksplisit Sarip.

## Rate limiter in-memory — keterbatasan
- Tidak berbagi state antar instance (Vercel multi-instance). Untuk produksi multi-region, ganti dengan Redis/Upstash.
- Restart instance me-reset counter (acceptable untuk proteksi brute-force dasar).

## Migrasi database — BELUM diterapkan
- File migrasi `supabase/migrations/2026100114*.sql` (audit_events, site_settings, billing_*, analytics_events) ditulis & direview, tetapi BELUM dijalankan ke database Supabase manapun.
- Perlu dijalankan via Supabase dashboard/CLI oleh manusia (atau dengan secret key) ke staging dulu, lalu produksi. Lihat `docs/OPERATIONS_RUNBOOK.md`.

## Merge dengan Fase 1 — PENDING
- Branch `upgrade/fase-1-ssr-seo-fondasi` (SSR/SEO) masih dikerjakan paralel. Setelah ia commit & push, lakukan merge/rebase ke `upgrade/worldclass-execution` dan selesaikan konflik (diprediksi minim karena file disjoint).

## Chat — dinonaktifkan (Fase 0)
- `/chat` menampilkan halaman "segera hadir". Mengaktifkan kembali butuh keputusan produk + audit WS yang rusak (temuan Fase 0).

## Data & klaim
- Tidak ada data demo di produksi (dihapus Fase 0). Dashboard menampilkan empty state jujur sampai ada data nyata.
- Tidak ada klaim pengguna/pendapatan/verifikasi/pembayaran di mana pun.

## E2E browser
- Playwright tersedia (`npm run e2e`) tapi belum dijalankan di sesi ini untuk slice baru (prioritas: tsc+lint). Dijadwalkan saat integrasi bila browser tersedia.
