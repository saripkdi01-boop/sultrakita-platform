# Riset integrasi sumber eksternal

## Shopee

Shopee Open Platform menyediakan dokumentasi developer dan resource listing/shop untuk aplikasi partner. Akses produksi bergantung pada registrasi developer, aplikasi partner, autentikasi/signature, serta scope yang disetujui; repository tidak memiliki kredensial Shopee. Karena itu SultraKita tidak akan melakukan scraping halaman Shopee atau memakai endpoint publik tidak resmi. Integrasi produk akan memakai feed/API resmi yang dikonfigurasi oleh pemilik akun, dengan URL produk asli, label sumber, dan waktu observasi.

Sumber resmi: https://open.shopee.com/developer-guide/4 dan https://open.shopee.com/.

## Instagram / Meta

Dokumentasi Meta menyatakan Instagram Graph API berfokus pada akun Instagram profesional (Business/Creator). Business Discovery dapat mengambil metadata dasar dan metrik akun profesional lain yang diizinkan; media API bekerja pada media yang dimiliki akun profesional, bukan akun personal secara umum. Karena itu lowongan kerja dari Instagram hanya boleh masuk melalui akun bisnis/creator yang memberikan otorisasi, feed resmi, atau URL submission yang jelas. SultraKita tidak akan mengambil posting dari akun personal, melewati login, atau memirror foto/caption tanpa izin.

Sumber resmi: https://developers.facebook.com/documentation/instagram-platform/overview, https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/business-discovery, dan https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media.

## Keputusan sumber lowongan

Untuk lowongan kerja, tahap awal sebaiknya memakai RSS/API/feed resmi dari perusahaan, portal kerja yang mengizinkan reuse, atau submission manual dari admin. Setiap record wajib menyimpan `source_url`, `source_label`, `observed_at`, `provenance`, dan `expires_at`/tanggal penutupan bila tersedia. Lowongan Instagram tanpa otorisasi tidak diimpor otomatis.
