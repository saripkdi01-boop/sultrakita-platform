# Marketplace Visual QA Findings

## Deployment yang diuji

URL: https://sultrakita-platform-kpn5vpu70-saripkdi01-boops-projects.vercel.app  
Route yang diuji: `/marketplace` dan `/marketplace/profile`  
Akses: berhasil setelah login Vercel Deployment Protection.

## Temuan sementara

Halaman Marketplace production berhasil dimuat dengan title SEO yang sesuai, navigasi utama, search field, tab marketplace, dropdown lokasi, Deal of the Day, kategori, filter distrik, kartu listing, tombol Quick View, tombol Bandingkan, dan section rekomendasi. Data demo listing tampil dan struktur halaman terlihat konsisten pada viewport desktop.

Halaman profil Marketplace berhasil dimuat dengan hero profil, quick actions, section Pencarian Tersimpan, section Jual di Marketplace, serta Preferensi & akun. Empty state Pencarian Tersimpan tampil dengan benar ketika belum ada data localStorage.

Belum ada error runtime yang terlihat dari hasil render browser pada dua route ini. Pemeriksaan Seller Tools dan interaksi modal/filter masih perlu dilanjutkan.


Seller Tools production juga berhasil dimuat. Hero seller, tombol Buat listing, state analytics yang meminta login, quick actions, link Kelola listing, Pengaturan toko, dan tips seller tampil tanpa error runtime yang terlihat. State unauthenticated tampil sesuai ekspektasi.

## Status QA visual

| Route | Status | Catatan |
|---|---|---|
| `/marketplace` | ✅ Lulus pemeriksaan render | Navigasi, search, deal, kategori, filter, cards, compare, rekomendasi terlihat |
| `/marketplace/profile` | ✅ Lulus pemeriksaan render | Profil, quick actions, saved searches empty state, pengaturan terlihat |
| `/marketplace/seller-tools` | ✅ Lulus pemeriksaan render | Seller hero, analytics login state, quick actions dan tips terlihat |
| Interaksi modal/filter | ⏳ Belum diuji penuh | Memerlukan langkah klik/input lanjutan |
| Lighthouse | ⏳ Belum dijalankan | Memerlukan audit browser khusus |


## Interaction QA

- Filter panel: ✅ berhasil dibuka.
- Harga minimum: ✅ query URL berubah menjadi `minPrice=200000`.
- Kondisi: ✅ query URL berubah menjadi `condition=new` dan listing terfilter; listing terawat menghilang.
- Quick View: ✅ modal terbuka dengan detail produk, harga, lokasi, kondisi, status verifikasi, dan link detail.
- Quick View close: ✅ modal berhasil ditutup melalui tombol close.
- Compare selection: ✅ listing pertama berubah menjadi state `Dipilih` dan compare bar muncul.
- Compare panel full: ⏳ belum selesai dibuka karena selection kedua memerlukan interaction lanjutan.
- Mobile breakpoint dan Lighthouse: ⏳ belum diuji.


## QA lanjutan

Compare Listings berhasil diuji end-to-end melalui browser production. Dua listing dapat dipilih sehingga keduanya berubah ke state `Dipilih`, Compare Bar menampilkan CTA, dan klik CTA membuka satu elemen dialog (`role="dialog"`) untuk perbandingan. Pemeriksaan DOM mengonfirmasi kedua judul produk tetap tersedia di panel.

Pada viewport browser saat ini (`1422px` lebar, `1222px` tinggi), document scroll width tidak melebihi viewport secara horizontal (`1405px`), sehingga tidak ditemukan horizontal overflow pada desktop. Tool browser yang tersedia tidak menyediakan pengubahan viewport langsung untuk deployment production; karena itu breakpoint mobile belum dapat dinyatakan lulus melalui browser production dan masih perlu diverifikasi dengan device emulation/Lighthouse.


## Lighthouse final

Audit dijalankan pada production build lokal di port terisolasi setelah proses lama pada port audit dibersihkan. Skor final valid adalah sebagai berikut:

| Mode | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Desktop | 97 | 89 | 100 | 100 |
| Mobile | 91 | 89 | 96 | 100 |

Audit masih menandai cumulative layout shift, color contrast, beberapa atribut ARIA legacy, unused CSS/JavaScript, dan sebagian metrik mobile sebagai peluang perbaikan lanjutan. Tidak ada isu canonical, title, language, viewport, atau meta description pada audit valid terakhir.

Laporan JSON tersimpan di `qa/lighthouse/marketplace-desktop.json` dan `qa/lighthouse/marketplace-mobile.json`. Skrip reproducible tersedia di `scripts/run-marketplace-lighthouse.sh`.
