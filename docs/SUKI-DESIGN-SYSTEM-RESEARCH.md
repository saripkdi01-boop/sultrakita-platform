# SUKI Suits — Ringkasan Riset UI/UX dan Design System

## Sintesis pola referensi

| Referensi | Pola yang diambil | Adaptasi untuk SUKI |
|---|---|---|
| Airbnb | Kartu photo-first, carousel swipe/manual, dots, counter, tombol heart, radius besar | Kartu listing menggunakan galeri 3–10 foto, kontrol panah + dots + counter, heart dengan state tersimpan, radius `20px` |
| Zillow | Search yang tetap terlihat, mode split list/map, filter dan status listing yang jelas | Header/search sticky, toggle `Daftar / Peta`, panel peta visual dengan pin, badge `Terverifikasi`, `Baru`, dan `Sisa unit` |
| Rumah123 | Konvensi label Indonesia, segmentasi jual/sewa, kalkulator KPR, kartu agen | Format harga `Rp 1,2 M`, tab Jual/Disewa, CTA `Simulasi KPR`, identitas agen pada kartu |
| 99.co Indonesia | Hirarki kategori properti, CTA pencarian, pembiayaan dan trust platform | Chips kategori, rentang harga lokal, shortcut KPR dan blok kepercayaan |
| SiKumbang TAPERA | ID lokasi/rumah, nama pengembang/asosiasi, supply unit | `ID SiKumbang`, asosiasi pengembang, total unit subsidi/komersil, sisa unit yang tampil eksplisit |
| Compass | Search hero minimal, curated/exclusives, neighborhood discovery, premium whitespace | Komposisi editorial premium untuk komersial dan proyek pilihan; tipografi bersih, whitespace lega |
| Sotheby’s Realty | Luxury visual language, image-led presentation, restraint | Panel komersial memakai dark ink, aksen champagne, foto besar, copy singkat |
| Mobbin / Dribbble real estate | Split-view, map integration, dashboard/listing card polish, micro-interaction | Hover lift halus, active states, skeleton/empty feedback, transisi <300ms, responsif mobile-first |

## Tokens

- **Warna:** `ink #12211F`, `forest #0E6258`, `teal #138A7D`, `mint #E7F3EF`, `sand #F8F6F1`, `gold #C78B45`, `coral #E76452`, `line #DDE7E3`.
- **Tipografi:** Plus Jakarta Sans untuk UI; ukuran display besar hanya pada hero; body 14–16px; label uppercase dengan tracking.
- **Radius:** `12px` controls, `20px` cards, `28px` hero/feature panels, pill untuk chips/status.
- **Elevation:** bayangan lembut untuk kartu; border tipis untuk struktur; tidak memakai shadow berat sebagai default.
- **Motion:** hover/press cepat 140–220ms; transform + opacity saja; hormati `prefers-reduced-motion`.

## Komponen inti

1. Sticky top navigation dengan brand SUKI Suits, pencarian lokasi, navigation tabs, favorites, dan CTA pasang listing.
2. Hero dengan copy lokal Sulawesi Tenggara, segmented search jual/sewa, chips lokasi, dan statistik trust.
3. Property card photo-first dengan 3–10 foto, swipe/tombol, dots/counter, heart, status badge, harga Rupiah, spesifikasi, dan trust row SiKumbang.
4. Split-view marketplace desktop: daftar di kiri, peta visual di kanan; pada mobile berubah menjadi toggle Daftar/Peta.
5. Trust strip yang menonjolkan ID SiKumbang, asosiasi, status supply, dan verifikasi.
6. Kartu agen dengan avatar, nama, rating, pengalaman, dan CTA WhatsApp/lihat profil.
7. Panel simulator KPR ringkas dengan harga, DP, tenor, dan estimasi cicilan.
8. Premium commercial showcase dengan foto besar, dark ink, dan aksen champagne.

## Sumber

[1]: https://www.airbnb.com/ "Airbnb"
[2]: https://www.zillow.com/ "Zillow"
[3]: https://www.rumah123.com/ "Rumah123"
[4]: https://www.99.co/id "99.co Indonesia"
[5]: https://sikumbang.tapera.go.id/ "SiKumbang TAPERA"
[6]: https://www.compass.com/ "Compass"
[7]: https://www.sothebysrealty.com/ "Sotheby's International Realty"
[8]: https://mobbin.com/search/real%20estate "Mobbin real estate search"
[9]: https://dribbble.com/search/real-estate "Dribbble real estate search"
