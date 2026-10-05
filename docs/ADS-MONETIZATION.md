# ADS-MONETIZATION.md — Infrastruktur Space Iklan SUKI Apps (T-ADS)

> Status: branch `upgrade/launch-ad-monetization`. Slot iklan terpasang dan aman
> tanpa konfigurasi (reserve ruang, zero CLS, tanpa error). Untuk MENGAKTIFKAN
> iklan sungguhan: (1) jalankan migrasi SQL ke Supabase, (2) aktifkan provider
> per placement di `/admin/ads`.

Arsitektur agnostik-provider: **Google AdSense** ATAU **jaringan lain** (via house-ads
kreatif kustom) ATAU **sponsor langsung** (UMKM lokal Kendari — margin lebih tinggi),
diatur per placement di `/admin/ads` (provider: `adsense` / `house` / `off`).

---

## 1. Tabel ukuran per placement

| Placement | Lokasi | Ukuran IAB | Frekuensi | Label |
|---|---|---|---|---|
| `feed-infeed` | Feed /beranda, di antara postingan | FLUID responsif (`data-ad-format="auto"`, `data-full-width-responsive="true"`) | Tiap 8 postingan (~12,5% densitas) | Iklan / Bersponsor |
| `marketplace-leaderboard` | Marketplace, di atas hasil pencarian | 728×90 (fallback 970×90) | 1/halaman, desktop ≥1024px saja | Iklan |
| `sidebar-desktop` | Bawah sidebar desktop utama | 300×250 (fallback 300×600 bila sidebar tinggi) | 1/halaman, desktop ≥1024px saja | Iklan |
| `marketplace-grid` | Interstitial antar kartu listing | FLUID native menyerupai kartu | Setelah kartu ke-9 | Iklan / Bersponsor |
| `mobile-banner` | Marketplace, atas konten | 320×50 (fallback 320×100) | Maks 1/viewport, ≤780px saja, TIDAK sticky, dismissible | Iklan |
| `properti-detail-sidebar` | Kolom kanan detail properti | 300×250 | 1/halaman detail | Iklan |
| `jobs-list` | Bawah daftar lowongan /jobs | FLUID native | 1 setelah daftar | Iklan / Bersponsor |
| `beranda-popup` | Modal popup interstitial di /beranda | ~336×280 fluid responsif ATAU kode HTML/JS kustom | Maks 1×/24 jam/pengunjung, delay 5 dtk, dismissible (✕ / ESC / backdrop) | Iklan / Bersponsor |

Placement yang terintegrasi di kode (langsung tampil saat diaktifkan):
`feed-infeed` ✓, `marketplace-leaderboard` ✓, `sidebar-desktop` ✓,
`marketplace-grid` ✓, `mobile-banner` ✓, `properti-detail-sidebar` ✓,
`jobs-list` ✓, `news-infeed` ✓, `beranda-popup` ✓ (popup, khusus /beranda).

Cara menambah slot baru di halaman mana pun:

```tsx
import { AdSlot } from '@/components/ads/AdSlot';
<AdSlot placementId="feed-infeed" />            // lazy via IntersectionObserver
<AdSlot placementId="marketplace-leaderboard" eager /> // di atas fold
```

## 2. Cara daftar Google AdSense

1. Buka <https://www.google.com/adsense/start/> → daftar dengan akun Google SUKI.
2. Masukkan URL situs: `https://sukiapps.web.id`.
3. Tempel kode verifikasi / pasang `ads.txt` — file `/ads.txt` SUDAH otomatis
   terisi dari env (lihat §3) setelah publisher ID di-set.
4. Tunggu **approval Google (biasanya beberapa hari)**. Syarat umum: konten
   orisinal & cukup, navigasi jelas, tanpa pelanggaran kebijakan.
5. Setelah disetujui: buat **Ad unit** per ukuran di dashboard AdSense, salin
   **Ad slot ID** (angka), lalu isi di `/admin/ads` per placement.

## 3. Di mana menaruh publisher ID

**HANYA lewat environment variable** — tidak pernah di kode:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

- Lokal: `.env.local` di `next-app/`.
- Production: Vercel → Project Settings → Environment Variables (Production).
- Bila kosong: loader `pagead2.googlesyndication.com` TIDAK dimuat sama sekali,
  `AdSenseUnit` me-render null, slot tetap reserve ruang rapi — tanpa error.

Per placement, isi **Ad slot ID** (angka) di `/admin/ads` → kartu placement →
kolom "AdSense ad slot ID". Tanpa slot ID, placement AdSense otomatis fallback
ke house ad bila ada, atau nonaktif.

## 4. Onboarding sponsor langsung (UMKM)

Margin lebih tinggi karena tanpa potongan jaringan iklan.

1. Buka `/admin/ads` (khusus admin).
2. Isi formulir **House ad baru**: pilih placement → pilih **template ukuran**
   (mis. 728×90 untuk leaderboard) → judul → URL gambar → URL tujuan →
   periode tayang (opsional) → Aktif.
3. **Validasi dimensi otomatis**: saat URL gambar di-blur, sistem memuat gambar
   dan mengecek `naturalWidth/naturalHeight` terhadap template placement
   (toleransi ±3%). Gambar ditolak bila rasio tidak cocok — ukuran template:
   728×90, 970×90, 300×250, 300×600, 320×50, 320×100, native 16:9, native 1:1.
4. Di kartu placement, set provider = **House ads (sponsor langsung)**.
5. House ad tampil dengan label **"Bersponsor"** + link `rel="sponsored"`.

Tips harga: mulai dari paket mingguan per placement (mis. leaderboard desktop),
beri laporan tayang manual dari data internal.

## 5. Checklist kebijakan AdSense

- [ ] Label "Iklan" tampil di setiap unit AdSense; "Bersponsor" di house ads.
- [ ] Tidak ada iklan di `/admin/*`, `/billing/*`, `/checkout/*` (ditegakkan di `AdSlot`).
- [ ] Tidak ada iklan di halaman login/signup/auth callback (tidak dipasang di sana).
- [ ] Densitas sehat: feed tiap 8 post (~12,5%), maks ~15% viewport — jauh di bawah 30%.
- [ ] Mobile banner TIDAK sticky dan bisa ditutup (UX + kebijakan penempatan mobile).
- [ ] Jarak aman dari tombol aksi (Simpan, filter, CTA seller) — cegah klik tidak valid.
- [ ] `ads.txt` terisi otomatis dari env.
- [ ] Konten: tanpa data palsu/demo di sekitar iklan; house ads hanya sponsor nyata.
- [ ] **Consent (UU PDP)**: default `npa=1` (non-personalized). Personalisasi HANYA
      bila `suki-consent-ads=granted` (diatur banner consent T6 via `setAdConsent`).

## 6. Mengaktifkan / mematikan per placement

`/admin/ads` → kartu placement → pilih provider:

- **Nonaktif** — slot reserve ruang kosong (zero CLS), tanpa request iklan.
- **Google AdSense** — butuh env publisher ID + ad slot ID per placement.
- **House ads** — butuh minimal 1 house ad aktif dalam periode untuk placement tsb.

Perubahan berlaku ≤60 detik (cache API `/api/ads/slot`, `revalidate = 60`).

## 7. Migrasi database (WAJIB sebelum aktivasi)

File: `supabase/migrations/20261002081000_house_ads.sql` — **FILE-ONLY, BELUM
dijalankan**. Jalankan manual via SQL editor dashboard Supabase, lalu verifikasi:

```sql
select placement, provider from public.ad_placements; -- 8 baris, semua 'off'
```

File tambahan: `supabase/migrations/20261005183000_popup_ads.sql` — menambah
kolom `house_ads.html_snippet` (kode HTML/JS jaringan iklan manapun; bila diisi
menggantikan gambar+link), membuat `link_url` nullable, dan me-seed placement
`beranda-popup` + `news-infeed`. **FILE-ONLY, BELUM dijalankan.**

Tanpa migrasi, `/api/ads/slot` mengembalikan `provider: 'off'` secara defensif
dan `/admin/ads` menampilkan pesan bahwa migrasi belum dijalankan.

## 8. Slot popup beranda (`beranda-popup`)

Komponen: `next-app/components/ads/PopupAd.tsx` — dipasang di
`/beranda` (`app/beranda/page-client.tsx`). Ikut sistem provider yang sama
(`adsense` / `house` / `off`, dikonfigurasi di `/admin/ads`), default
`'off'` — tidak ada popup tampil sebelum diaktifkan.

Perilaku:
- Muncul **maks 1× per 24 jam per pengunjung** (frequency cap via `localStorage`),
  setelah **delay 5 detik** — pengunjung sempat membaca halaman dulu.
- Dismissible: tombol ✕, tombol ESC, atau klik area gelap (backdrop).
- Overlay fixed → **zero layout shift**; hormat `prefers-reduced-motion`;
  scroll body dikunci saat terbuka; dark mode via token tema.
- `house` dengan **gambar+link** → kreatif sponsor langsung seperti biasa.
- `house` dengan **kode HTML/JS** → kolom `html_snippet` di `/admin/ads`
  (textarea, hanya admin). `<script>` di dalam kode **dijalankan** agar tag
  jaringan iklan (MGID, Adsterra, dsb) bekerja. Peringatan keamanan tampil
  di form: hanya tempel kode dari jaringan terpercaya.

⚠️ **KEBIJAKAN AdSense — penting**: JANGAN set provider `adsense` di
placement popup ini untuk unit AdSense biasa. Membungkus unit AdSense dalam
popup/popunder kustom **melanggar kebijakan AdSense** (risiko suspend akun).
Untuk iklan layar-penuh yang patuh kebijakan, aktifkan **Vignette ads**
di menu Auto ads dashboard AdSense — itu popup resmi dari Google.

## 9. File-file T-ADS

| File | Peran |
|---|---|
| `next-app/lib/ads/config.ts` | Registry placement, template rasio, `validateAdImageRatio`, env reader |
| `next-app/lib/ads/consent.ts` | Consent defensif (default npa), titik integrasi banner T6 |
| `next-app/components/ads/AdSlot.tsx` | Slot agnostik-provider: reserve anti-CLS, lazy IO, blokir path sensitif |
| `next-app/components/ads/PopupAd.tsx` | Slot popup interstitial `beranda-popup`: modal, delay 5 dtk, cap 1×/24 jam, executor kode HTML/JS jaringan iklan |
| `next-app/components/ads/AdSenseUnit.tsx` | Unit AdSense (`data-ad-client/slot`, npa) |
| `next-app/components/ads/HouseAd.tsx` | Kreatif sponsor langsung berlabel "Bersponsor" |
| `next-app/components/ads/AdSenseScript.tsx` | Loader pagead2 via `next/script` (hanya bila env di-set) |
| `next-app/components/ads/ads.module.css` | Gaya slot: reserve per placement, dark mode, reduced-motion |
| `next-app/app/api/ads/slot/route.ts` | Resolusi provider per placement (publik, defensif) |
| `next-app/app/ads.txt/route.ts` | ads.txt otomatis dari env |
| `next-app/lib/actions/ads.ts` | Server actions admin (CRUD house ads + placement) |
| `next-app/app/admin/ads/` | Halaman admin: CRUD + toggle provider + validasi dimensi gambar |
| `supabase/migrations/20261002081000_house_ads.sql` | Skema `house_ads` + `ad_placements` (FILE-ONLY) |
| `supabase/migrations/20261005183000_popup_ads.sql` | Kolom `html_snippet`, `link_url` nullable, seed `beranda-popup` + `news-infeed` (FILE-ONLY) |

## 10. Keterbatasan & follow-up

- Banner consent cookie (track T6) belum ada → default `npa=1` sampai T6
  memanggil `setAdConsent('granted'|'denied')` (lihat `lib/ads/consent.ts`).
- Tidak ada tracking view/click iklan internal — gunakan laporan AdSense /
  dashboard sponsor manual untuk saat ini.
- House ads memakai URL gambar eksternal (belum ada upload ke storage).
