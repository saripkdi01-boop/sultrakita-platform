# Changelog

## 2026-08-29 — Facebook-style UI v3

SultraKita homepage mendapatkan visual layer baru yang terinspirasi pola interaksi Facebook/Meta: topbar fixed tiga zona, tab navigasi desktop dengan active underline, sidebar adaptif, right rail untuk widget komunitas, kartu feed yang lebih ringan, serta mobile bottom tab bar dan bottom-sheet menu.

Perubahan ini sengaja dibuat sebagai **progressive override** melalui `public/fb-theme.css`. Struktur dan perilaku lama tetap dipertahankan sehingga seluruh fetch yang sudah ada di `public/app.js`, termasuk search, filter, pagination, favorites, comments, donation, OTP, onboarding seller, compare, dan recently viewed, tetap aktif.

Mode gelap tetap memakai key `sultra-dark`; preferensi lain tetap memakai key existing (`sultra-favs`, `sultra-recently-viewed`, `sultra-compare`, `sultra-reactions`, `sultra-radius`, `sultra-view`, `sultra-rfq`, dan `sultra-seller-onboarding-draft`). Ditambahkan interaksi menu mobile yang aksesibel dengan overlay, Escape-to-close, focus ke tombol tutup, dan koneksi langsung ke dialog jualan existing.

### Validasi

`npm run lint` dan `npm run build` harus tetap dijalankan sebelum merge. Test suite saat audit memiliki satu kegagalan pre-existing pada kontrak versi asset admin (`admin.css?v=4` di test, sedangkan implementasi memakai `v=5`); kegagalan ini tidak menyentuh homepage atau perubahan branch ini.

## 2026-08-31 — Forensic P0 security increment

Authorization for conversations and messages now binds buyer/sender identity to the authenticated session, with reusable conversation-membership middleware. Public seller verification badges use canonical `verification_status` only, and an additive Supabase migration backfills, constrains, and indexes the canonical state. Added security regression coverage and forensic execution status documentation.
