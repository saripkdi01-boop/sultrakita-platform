# SUKI Marketplace Design System

Dokumen ini mencatat pola visual dan komponen utama yang digunakan pada Marketplace SultraKita. Marketplace memakai pola eksplorasi Facebook Marketplace yang disesuaikan dengan identitas SUKI dan konteks lokal Sulawesi Tenggara.

## Prinsip desain

Marketplace memprioritaskan penemuan produk, kepercayaan, dan aksi yang cepat. Konten utama ditampilkan dalam grid kartu yang mudah dipindai, sementara filter, lokasi, dan pencarian tetap terlihat pada viewport desktop. Pada mobile, navigasi dan kartu berubah menjadi pola yang lebih ringkas tanpa menghilangkan akses ke filter utama.

## Design tokens

| Token | Nilai | Penggunaan |
|---|---|---|
| `--suki-ink` | `#12211F` | Teks utama dan heading |
| `--suki-forest` | `#0E6258` | CTA, active state, dan brand primary |
| `--suki-teal` | `#138A7D` | Accent, link, dan status terverifikasi |
| `--suki-mint` | `#E7F3EF` | Background active state dan icon container |
| `--suki-sand` | `#F8F6F1` | Surface sekunder dan filter panel |
| `--suki-gold` | `#C78B45` | Deal dan premium highlight |
| `--suki-line` | `#DDE7E3` | Border dan divider |

Komponen menggunakan radius antara 8–22px, shadow ringan untuk surface yang dapat diangkat, serta transisi singkat yang menghormati `prefers-reduced-motion`.

## Komponen

| Komponen | Lokasi | Tanggung jawab |
|---|---|---|
| `MarketplaceTopNav` | `next-app/components/marketplace/MarketplaceTopNav.tsx` | Navigasi global marketplace dan active state |
| `MarketplaceSubNav` | `next-app/components/marketplace/MarketplaceSubNav.tsx` | Search, autocomplete, tab, dropdown, dan lokasi |
| `MarketplaceCard` | `next-app/components/marketplace/MarketplaceCard.tsx` | Kartu listing, carousel gambar, wishlist, quick view, compare |
| `CategoryBrowser` | `next-app/components/marketplace/CategoryBrowser.tsx` | Quick links dan kategori populer |
| `DealOfTheDay` | `next-app/components/marketplace/DealOfTheDay.tsx` | Listing unggulan dan deal harian |
| `Recommendations` | `next-app/components/marketplace/Recommendations.tsx` | Kurasi rekomendasi berbasis listing aktif |
| `QuickViewModal` | `next-app/components/marketplace/QuickViewModal.tsx` | Detail listing tanpa navigasi |
| `CompareBar` | `next-app/components/marketplace/CompareBar.tsx` | Daftar listing yang dipilih untuk perbandingan |
| `ComparePanel` | `next-app/components/marketplace/ComparePanel.tsx` | Perbandingan maksimal tiga listing |
| `SavedSearches` | `next-app/components/marketplace/SavedSearches.tsx` | Daftar dan penghapusan pencarian tersimpan |

## State dan URL

Filter utama disimpan sebagai query parameter agar dapat dibagikan dan dipulihkan ketika pengguna kembali ke halaman. Parameter yang digunakan meliputi `q`, `district`, `minPrice`, `maxPrice`, `condition`, dan `radius`. Sorting tetap bersifat state tampilan karena tidak memerlukan perubahan dataset server.

Pencarian terakhir dan pencarian tersimpan saat ini menggunakan `localStorage` sebagai fallback yang aman sebelum persistence server untuk alert pencarian ditambahkan. Kunci storage yang digunakan adalah `suki-marketplace-recent-searches` dan `suki-marketplace-saved-searches`.

## Responsive behavior

Pada desktop, layout menggunakan sidebar kategori dan grid tiga kolom. Pada tablet, grid turun menjadi dua kolom. Pada mobile, kategori berubah menjadi quick links tiga kolom, kartu menggunakan grid dua kolom, dan section rekomendasi/deal menggunakan horizontal scroll.

Modal Quick View dan Compare Panel memakai overlay, dapat ditutup dengan tombol close, klik area overlay, atau tombol `Escape`. Semua kontrol interaktif memiliki label aksesibilitas yang relevan.

## Data dan integrasi

Halaman utama mengambil listing dari `/api/listings`, yang meneruskan filter query ke Supabase dan menyediakan fallback demo ketika database belum tersedia. Wishlist memakai `toggleWishlist` dari `next-app/lib/actions/marketplace.ts`. Seller Tools memakai `getSellerStats` dan komponen analytics existing.

## Validasi lokal

Jalankan perintah berikut dari direktori `next-app`:

```bash
npx tsc --noEmit
npm run build
```

Build yang tervalidasi menghasilkan seluruh route aplikasi tanpa error TypeScript atau compilation error. Warning workspace root Next.js tentang dua `package-lock.json` tidak memblokir build dan sebaiknya diselesaikan saat housekeeping dependency repository.
