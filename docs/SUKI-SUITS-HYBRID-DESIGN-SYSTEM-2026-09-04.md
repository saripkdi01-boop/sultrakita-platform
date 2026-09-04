# SUKI Suits — Hybrid Design System

## Tujuan

SUKI Suits memadukan kualitas visual marketplace premium dengan relevansi properti Indonesia dan trust yang dapat diverifikasi. Sistem ini menjadi lapisan presentasi untuk navigasi SultraKita: sidebar tetap efisien seperti pola Facebook, sementara halaman properti menggunakan pola Airbnb/Zillow/Rumah123/99.co/SiKumbang dan bahasa premium Compass/Sotheby’s.

## Prinsip desain

| Prinsip | Penerapan |
| --- | --- |
| **Photo-first** | Kartu properti memulai dengan imagery, carousel, counter/dots, dan heart untuk simpan. |
| **Search-first** | Pencarian lokasi/properti selalu mudah ditemukan; di halaman katalog tetap terlihat melalui sticky treatment. |
| **Local by default** | Harga memakai format `Rp 1,2 M`, `Rp 750 Juta`, dan rentang yang lazim di Indonesia; tab jual/sewa dan KPR menjadi konteks utama. |
| **Trust before conversion** | Status `Terverifikasi`, ID SiKumbang, pengembang/asosiasi, dan sisa unit tampil sebelum CTA. |
| **Premium restraint** | Komersial/proyek pilihan menggunakan ink gelap, champagne gold, foto besar, dan whitespace editorial. |
| **Progressive disclosure** | Sidebar grouped/collapsible; detail lanjutan berada dalam modal, drawer, atau halaman detail. |
| **Mobile-first** | Drawer, segmented control `Daftar/Peta`, target sentuh minimum 44px, dan transisi ringan. |

## Design tokens

```css
:root {
  --suki-ink: #12211F;
  --suki-forest: #0E6258;
  --suki-teal: #138A7D;
  --suki-mint: #E7F3EF;
  --suki-sand: #F8F6F1;
  --suki-gold: #C78B45;
  --suki-coral: #E76452;
  --suki-line: #DDE7E3;
  --suki-muted: #66736F;
  --suki-white: #FFFFFF;
  --suki-radius-control: 12px;
  --suki-radius-card: 20px;
  --suki-radius-feature: 28px;
  --suki-shadow-soft: 0 12px 30px rgba(18, 33, 31, .08);
  --suki-shadow-float: 0 20px 50px rgba(18, 33, 31, .13);
  --suki-motion-fast: 160ms;
  --suki-motion-standard: 220ms;
}
```

Typography uses **Plus Jakarta Sans** for UI and body copy, with optional editorial serif treatment only for premium hero headlines. Body copy remains 14–16px; labels use uppercase tracking sparingly.

## Komponen inti

| Komponen | Kontrak visual dan perilaku |
| --- | --- |
| **Sticky header** | Brand SUKI Suits, search, nav tabs, favorites, notifications, avatar/login, CTA pasang listing. |
| **Grouped sidebar** | Section Akun, SultraKita, Ekonomi & Marketplace, Bisnis, Dukung & Berkolaborasi; expanded 280px dan collapsed 72px. |
| **Mobile drawer** | Overlay, ESC/klik luar untuk menutup, animasi transform/opacity, touch target 44px. |
| **Property card** | Carousel 3–10 foto, swipe/manual arrow, dots + `1/6`, heart, status, harga Rupiah, LT/LB/kamar, lokasi. |
| **Trust row** | `Terverifikasi`, ID SiKumbang, pengembang/asosiasi, sisa unit, timestamp update. |
| **Split view** | Desktop: daftar kiri dan peta kanan; mobile: segmented `Daftar / Peta`. |
| **Agent card** | Avatar, nama, rating, pengalaman, area, CTA WhatsApp/lihat profil. |
| **KPR panel** | Harga, DP, tenor, estimasi cicilan; hasil diberi label estimasi. |
| **Commercial showcase** | Ink gelap, champagne accent, image-led composition, status eksklusif/featured. |
| **Feedback states** | Skeleton, empty state, toast, hover lift, press scale, focus ring, reduced-motion fallback. |

## Referensi dan pola yang diambil

[1]: https://www.airbnb.com/ "Airbnb"
[2]: https://www.zillow.com/ "Zillow"
[3]: https://www.rumah123.com/ "Rumah123"
[4]: https://www.99.co/id "99.co Indonesia"
[5]: https://sikumbang.tapera.go.id/ "SiKumbang TAPERA"
[6]: https://www.compass.com/ "Compass"
[7]: https://www.sothebysrealty.com/ "Sotheby’s International Realty"
[8]: https://mobbin.com/explore/web/app-categories/real-estate "Mobbin Real Estate Web"
[9]: https://mobbin.com/explore/mobile/app-categories/real-estate "Mobbin Real Estate Mobile"
[10]: https://dribbble.com/tags/real-estate-ui "Dribbble Real Estate UI"
[11]: https://dribbble.com/tags/real-estate-website "Dribbble Real Estate Website"
