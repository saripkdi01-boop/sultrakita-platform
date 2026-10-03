# Alert Pencarian Tersimpan — SUKI Suits (/properti)

Status: **NON-AKTIF secara default.** Mengaktifkan butuh persetujuan eksplisit pemilik.

## Yang sudah disiapkan (kode, tanpa efek samping)

- `next-app/lib/property-saved-search.ts`
  - `savePropertySearchAlert` — menyimpan filter pencarian properti user ke tabel
    `saved_searches` (penanda `filters.target = 'properti'`). `alert_enabled`
    default **false**.
  - `listPropertySavedSearches` / `setPropertySearchAlertEnabled` /
    `deletePropertySavedSearch` — kelola milik user sendiri (RLS owner).
  - `runPropertySavedSearchAlerts` — matcher cron (service role): menghitung
    properti baru (`status` available/rented/sold, bukan demo, `created_at` >
    `last_notified_at`) yang cocok filter, lalu menulis satu notifikasi in-app
    per pencarian per periode (anti-spam, pola sama dengan marketplace).
- `next-app/components/property/PropertySavedSearchButton.tsx` — tombol
  "Simpan pencarian" di halaman /properti.
- `next-app/app/api/cron/saved-search-alerts/route.ts` — memanggil matcher
  properti berdampingan dengan matcher marketplace.
- `supabase/migrations/20261003110000_property_saved_search_alerts.sql` —
  **file saja, belum dijalankan**: indeks parsial opsional untuk query cron.

## Cara mengaktifkan (butuh persetujuan pemilik per langkah)

1. Jalankan `supabase/migrations/20261003110000_property_saved_search_alerts.sql`
   di Supabase SQL Editor (idempoten; hanya indeks, tanpa perubahan data/RLS).
2. Set environment variable `PROPERTI_SAVED_SEARCH_ENABLED=true` di Vercel
   (All Environments), lalu redeploy agar env terbaca.
3. Verifikasi cron `saved-search-alerts` terjadwal di `vercel.json` dan
   `CRON_SECRET` ter-set (401 tanpa header auth = ekspektasi sehat).
4. Uji: buat pencarian tersimpan properti dengan alert ON, tambahkan listing
   properti baru yang cocok, panggil endpoint cron manual dengan header
   `Authorization: Bearer <CRON_SECRET>` — harus ada notifikasi in-app.

## Perilaku saat nonaktif (default)

- Endpoint cron mengembalikan
  `{ ok: true, properti: { skipped: true, reason: 'PROPERTI_SAVED_SEARCH_ENABLED belum diaktifkan …' } }`.
- Tidak ada notifikasi yang dikirim, tidak ada query properti yang dijalankan.
- User tetap bisa menyimpan pencarian (tombol "Simpan pencarian"), tetapi
  alert-nya mati sampai langkah aktivasi di atas selesai.

## Keputusan desain

- Tidak menambah tabel baru: reuse `saved_searches` + kolom JSONB `filters`.
- Tidak ada estimasi/prediksi harga di notifikasi — hanya hitungan listing
  baru yang cocok (data nyata).
- Satu notifikasi ringkas per pencarian per periode, bukan per listing.
