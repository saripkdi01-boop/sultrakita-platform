# Audit Live SultraKita — 29 Agustus 2026

## Sumber
- Production: https://sultrakita-platform.vercel.app/
- Repository: https://github.com/saripkdi01-boop/sultrakita-platform
- Supabase project URL: https://ibvcfdfsjpytwpnxgylm.supabase.co
- Browser screenshot: `/home/ubuntu/screenshots/sultrakita-platform__2026-08-29_13-44-58_4140.webp`

## Temuan visual
Production sudah memiliki fondasi app shell dengan topbar sticky, drawer/sidebar desktop, search, create action, tema gelap, marketplace feed, partner picks, donation, dan beberapa CTA yang terhubung. Namun tampilan masih terasa seperti dashboard gelap yang penuh container: sidebar, feed, dan right rail memakai banyak panel berbatas; hierarchy visual antar area belum cukup kuat; topbar dan main content belum terasa sebagai satu sistem; iconography masih campuran glyph/teks; dan listing di viewport audit menampilkan placeholder/asset image yang belum memberi nilai visual cukup.

Pada viewport sekitar desktop, halaman memakai tiga kolom sekaligus sehingga konten utama terasa sempit. Feed marketplace belum menjadi pusat perhatian karena terlalu banyak chrome di kiri dan kanan. Search, quick actions, kategori, filter, listing, seller suggestions, partner picks, dan donation hadir bersamaan tanpa ritme ruang yang cukup jelas.

## Struktur yang terdeteksi
- Topbar: menu, logo SultraKita, create, search, WhatsApp, theme, profile.
- Sidebar: Beranda, Komunitas Baru, Dasbor, Profil saya, Notifikasi, Donasi & bantuan, SultraKita Pro.
- Main: composer, pilihan warga, marketplace discovery, filter distrik/sort, listing cards.
- Right rail: partner picks dan gerakan hari ini.
- Aksi listing: Simpan, Bagikan, Lihat detail.
- Bahasa utama: Indonesia.

## Arah implementasi
Perubahan akan bersifat additive pada frontend existing, memakai token CSS 4/8px, satu bahasa visual untuk desktop/tablet/mobile, app shell mobile-first, bottom navigation maksimal lima item pada mobile, listing card dengan hierarchy image-title-price-location-seller, feed dan CTA yang lebih ringan, serta progressive enhancement untuk fitur backend existing. Tidak ada penghapusan route atau penggantian arsitektur backend tanpa kebutuhan yang terverifikasi.

## Catatan data
Repo menunjukkan backend Node/Express dan integrasi PostgreSQL/Supabase yang sudah luas, termasuk endpoint marketplace, donation, comments, reports, conversations/offers, dan auth-aware flows. Perubahan UI harus memanggil endpoint existing dan mempertahankan fallback/empty states ketika data atau storage tidak tersedia.

## QA lokal
Local runtime berhasil berjalan setelah dependensi di-install. Browser memuat listing demo terbaru dan menunjukkan app shell dengan background hijau gelap sesuai tema tersimpan, card lebih ringan, spacing lebih teratur, dan side rail yang lebih tertata. Tombol **Buat listing** tetap membuka bottom sheet `Buat postingan` dengan field judul, harga, kategori, distrik, deskripsi, upload foto, dan aksi submit; artinya kontrak UI existing tetap terjaga.

## Pemeriksaan statis
- `npm run lint`: lulus.
- `npm run build`: lulus, 31 artefak dan marker aplikasi terverifikasi.
- `git diff --check`: lulus.
- Perubahan source hanya menambah `public/rescue-upgrade.css`, memperbarui stylesheet link dan bottom navigation di `public/index.html`, serta menambahkan catatan audit.
