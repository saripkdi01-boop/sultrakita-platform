# Arsitektur SUKI Apps (sukiapps.web.id)

Dokumen ini adalah sumber kebenaran arsitektur backend SUKI Apps per **Fase 0 stabilisasi (2026-10-01)**.
Tujuan: menghentikan kebingungan "backend ganda" — hanya SATU backend yang kanonis dan di-deploy.

## Backend kanonis (yang di-deploy)

**Supabase Postgres + Server Actions di `next-app/`**

- **Database**: Supabase Postgres (60+ tabel, 49 migrasi di `supabase/migrations/`), dengan Row Level Security (RLS).
- **Auth**: Supabase Auth (email + OAuth Google/Facebook), dipakai via `@supabase/ssr`.
- **Logika server**: Next.js Server Actions di `next-app/lib/actions/` + 7 Route Handler di `next-app/app/api/`
  (`csrf`, `feed`, `health`, `interactions`, `listings`, `profile/avatar`, `referral`).
- **Upload**: R2/S3 (`@aws-sdk/client-s3`), Gemini AI untuk fitur cerdas, Resend untuk email.
- **Deploy**: Vercel me-render **hanya direktori `next-app/`** (diatur via *rootDirectory* di dashboard Vercel).
  Tidak ada bagian lain repo ini yang ikut ter-deploy.

Aturan keamanan (dari master prompt upgrade): setiap Server Action / Route Handler adalah endpoint publik —
wajib cek auth, validasi Zod `safeParse`, dan otorisasi kepemilikan/peran. Jangan hanya mengandalkan middleware.

## LEGACY — tidak di-deploy, jangan dikembangkan

Direktori/file berikut adalah sisa arsitektur lama. **Vercel tidak me-render-nya** (rootDirectory = `next-app`).
Dibiarkan di repo untuk referensi/arsip; rencana: diarsipkan permanen di fase berikutnya.

| Path | Status |
|---|---|
| `server.js` (Express, root repo) | LEGACY — server monolit lama, tidak di-deploy |
| `realtime/server.js` | LEGACY — gateway WebSocket chat lama, tidak di-deploy |
| `database/` | LEGACY — skrip/SQL lama, migrasi aktif ada di `supabase/migrations/` |
| `automation/` | LEGACY — skrip otomasi lama |
| `mobile/` | LEGACY — eksperimen mobile lama |
| `modernization/` | LEGACY — dokumen modernisasi lama |
| `n8n/` | LEGACY — workflow n8n lama (OTP WhatsApp kini via server action, bukan n8n) |

## Chat realtime — status: DINONAKTIFKAN SEMENTARA (Fase 0)

**Fakta**: `next-app/lib/realtime/chat-socket.ts` dulu default ke `ws://127.0.0.1:8090` dengan
`userId: 'demo-user'` hardcoded — chat **mati total di produksi** dan menampilkan pengalaman rusak.

**Keputusan Fase 0 (2026-10-01)**:
- Entry point `/chat` **disembunyikan dari seluruh navigasi/UI** (header, sidebar, top nav, profile hub,
  dashboard, profil marketplace). Kode chat TIDAK dihapus (`app/chat/`, `components/chat/*`, `lib/realtime/*`).
- Akses langsung ke `/chat` menampilkan halaman jujur: **"Fitur chat segera hadir"**.
- `NEXT_PUBLIC_CHAT_WS_URL` dikosongkan di `.env.example` (sebelumnya default localhost yang menyesatkan).

**Cara mengaktifkan kembali** (nanti, setelah infrastruktur siap):
1. Host gateway WebSocket chat di server terpisah (bukan di Vercel — Vercel serverless tidak mendukung koneksi WS persisten).
2. Set `NEXT_PUBLIC_CHAT_WS_URL=wss://<host-chat>` di environment Vercel (production).
3. Ganti `userId: 'demo-user'` di `lib/realtime/chat-socket.ts` dengan ID user Supabase yang sedang login
   (ambil dari sesi `@supabase/ssr`, kirim token auth saat subscribe).
4. Kembalikan entry point navigasi (cari komentar `Fase 0` di `Header.tsx`, `TopNavBar.tsx`, `LeftSidebar.tsx`,
   `ProfileHub.tsx`, `app/dashboard/page.tsx`, `app/marketplace/profile/page.tsx`) dan render ulang
   `ChatPageClient` di `app/chat/page.tsx` (uncomment baris yang ditandai).
5. Uji end-to-end: dua user login, kirim pesan, pastikan terkirim dan tercatat.

## URL kanonis (Fase 0)

- `/marketplace` adalah halaman marketplace kanonis. `/suki-marketplace` me-redirect ke `/marketplace`
  (sudah ada di `next-app/app/suki-marketplace/page.tsx`).
- `/komunitas` → 308 redirect ke `/groups` (komunitas hidup di `/groups`; diatur di `next-app/next.config.mjs`).

## Marketplace discovery (Fase 2)

- `/marketplace` tetap SSR (Server Component) + ISR 120 dtk; filter tersinkron URL
  (`?q=&district=&category=&condition=&minPrice=&maxPrice=&sort=`, alias pendek
  `cat/min/max/kondisi`) via `router.push` + `useTransition` di `page-client.tsx` —
  shareable, tombol back browser benar.
- Sort server-side (`terbaru|termurah|termahal`) di `lib/listings-query.ts`
  (`fetchPublicListings`) dan diteruskan `/api/listings`.
- Kartu listing (`components/marketplace/MarketplaceCard.tsx`): `next/image`
  lazy + anti-CLS (SafeImage dengan fallback `<img>` untuk host tak dikenal),
  harga `Intl id-ID IDR`, badge kondisi, chip seller + rating asli, badge tier
  dari `lib/seller-trust.ts` (diturunkan dari `verification_status` &
  `rating_count`, ambang Official = 50 ulasan), galeri multi-foto, hover lift
  hanya `@media (hover:hover)`.
- Galeri multi-foto memakai tabel `listing_media` (kolom baru `listing_uuid`,
  migrasi `supabase/migrations/20261001070000_marketplace_fase2_discovery.sql`);
  upload langsung ke R2 via presigned POST (`createListingMediaUpload`) +
  konfirmasi owner-only (`confirmListingMedia`, otorisasi `canEditListing`).
- Wishlist optimistis (`useWishlist.ts`) + `LoginSheet` saat belum login;
  aksi tertunda dilanjutkan otomatis setelah login (localStorage pending key).
- Etalase toko publik: `/marketplace/toko/[id]` (SSR + metadata + notFound).
- Simpan pencarian & alert: tabel `saved_searches` (migrasi yang sama) +
  server actions (`saveSearchAlert`, `listSavedSearches`, `deleteSavedSearch`,
  `setSearchAlertEnabled`) + cron per jam `app/api/cron/saved-search-alerts`
  (dijadwalkan di `vercel.json`; skip graceful bila `CRON_SECRET` belum diset;
  notifikasi via tabel `notifications`).
- JSON-LD `ItemList > Product` di `/marketplace`: hanya harga asli integer IDR,
  tanpa klaim ketersediaan palsu.

## Properti map-first ala Zillow (Fase 3)
- Halaman `/properti`: layout desktop split 57% (daftar) / 43% (peta sticky);
  mobile memakai tab Daftar/Peta. Peta Leaflet client-only (`ssr: false`) dengan
  tile CARTO Voyager + markercluster + pin harga ala Zillow.
- Deep link `?lat=&lng=&zoom=` diperbarui saat peta digeser (debounce 600 mdtk,
  `history.replaceState`). Tombol "Lokasi saya" memakai Geolocation API — karena
  itu `Permissions-Policy` di `next.config.mjs` mengizinkan `geolocation=(self)`.
- Hover kartu listing menyorot pin di peta; klik pin scroll ke kartu.
- Fondasi geo: migrasi `20261001080000_properti_fase3_mapfirst.sql` — ekstensi
  PostGIS (defensif: dilewati bila tidak tersedia), kolom `geog geography`,
  trigger sinkronisasi lat/lng, index GIST, RPC `properties_in_bbox` dan
  `properties_nearby`. Server action `lib/actions/property-geo.ts` memakai RPC
  bila ada, fallback ke perbandingan latitude/longitude + haversine di JS.
- Geocode dilakukan SAAT SIMPAN (`createProperty` via Nominatim OSM dengan
  User-Agent + jeda 1100 mdtk), bukan saat search; kegagalan geocode tidak
  menggagalkan penyimpanan listing.
- Halaman detail: mini-map asli (fallback centroid kecamatan berlabel jujur
  "perkiraan" bila tanpa koordinat), seksi "Serupa di dekat sini", JSON-LD
  `RealEstateListing` hanya dengan data yang benar-benar ada.
