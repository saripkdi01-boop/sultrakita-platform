# Migrasi Runtime SultraKita ke Next.js

Runtime interface utama SultraKita kini tersedia pada `next-app/` menggunakan Next.js App Router. Halaman root Next.js memindahkan pengalaman utama dari `public/index.html` ke komponen React interaktif, termasuk navigasi Beranda, Reels, Marketplace, Grup, modal Pasang Iklan, draft lokal, preview multi-media, dan bantuan AI listing.

## Parity yang sudah dipindahkan

| Area | Implementasi Next.js |
|---|---|
| Shell dan navigasi | `next-app/components/layout/AppLayout.tsx` dan `next-app/components/layout/Header.tsx` |
| Beranda sosial | `next-app/app/page.tsx` — `HomeTab` |
| Reels vertikal | `next-app/app/page.tsx` — `ReelsTab` dan `ReelCard` |
| Marketplace | `next-app/app/page.tsx` — `MarketTab` |
| Grup komunitas | `next-app/app/page.tsx` — `GroupsTab` |
| Pasang Iklan | `next-app/app/page.tsx` — `ListingModal` |
| API video | `GET /api/videos`, dengan fallback demo |
| Bantuan AI | `POST /api/ai/listing-assist` melalui `NEXT_PUBLIC_API_BASE_URL` |

`public/index.html` tetap dipertahankan sebagai compatibility runtime sampai deployment Next.js baru melewati QA dan cutover. Ini mencegah endpoint Express lama ikut terputus selama proses migrasi.

## Deployment yang direkomendasikan

Buat atau gunakan project Vercel terpisah dengan **Root Directory** `next-app`, build command `npm run build`, dan output Next.js default. API Express tetap berjalan pada deployment backend yang sudah ada. Isi environment berikut pada Preview dan Production:

```env
NEXT_PUBLIC_API_BASE_URL=https://sultrakita-platform.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<public-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-supabase-anon-key>
NEXT_PUBLIC_R2_BUCKET_URL=<public-cdn-url>
```

`GEMINI_API_KEY` tetap hanya berada di environment server Express yang menjalankan `/api/ai/listing-assist`; jangan menaruhnya pada `next-app` dengan prefix `NEXT_PUBLIC_`.

## Verifikasi lokal

```bash
cd next-app
npm ci
npm run build
npm start -- --port 3330
```

QA browser harus memeriksa root page, navigasi Reels, dua kartu video demo, kontrol play/mute, interaksi like/comment/follow, modal Pasang Iklan, tombol draft, input multi-media, dan tombol bantuan AI.
