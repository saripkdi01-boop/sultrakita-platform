# Audit dan Upgrade Mobile-First — 29 Agustus 2026

## Temuan baseline

Situs menggunakan Express dengan frontend vanilla HTML/CSS/JavaScript, bukan SPA Vite. Repository sudah memiliki route API, integrasi Supabase/PostgreSQL melalui backend, drawer responsif, bottom navigation, listing fallback, dan beberapa audit sebelumnya. Production dapat diakses dan homepage merender, tetapi ketika data listing production kosong atau request berjalan lambat, pengalaman pengguna mudah terlihat seperti loading berkepanjangan.

Baseline verification: lint, unit test, dan build berhasil; suite unit mencatat 39 pass dan 7 skip. Security regression belum dapat berjalan penuh tanpa `DATABASE_URL`/`SUPABASE_DB_URL` lokal, dan tetap fail-closed saat database belum dikonfigurasi. Ini merupakan kebutuhan environment test, bukan alasan untuk membuka akses tanpa database.

## Perubahan batch ini

1. Menambahkan state filter `min_price`, `max_price`, dan `radius`.
2. Menambahkan sinkronisasi filter dan pencarian ke URL query string agar dapat dibagikan, dipulihkan saat refresh, dan dinavigasikan dengan tombol back/forward.
3. Menambahkan debounce 350 ms pada pencarian sehingga tidak mengirim request untuk setiap karakter.
4. Menambahkan tombol clear pencarian yang touch-friendly dan accessible.
5. Memperluas filter sheet dengan kategori, wilayah, radius, harga minimum/maksimum, sort, Reset, dan Terapkan Filter.
6. Menambahkan dukungan tombol Escape untuk menutup drawer dan bottom sheet.
7. Memastikan fallback listing ikut memfilter kata kunci dan distrik ketika API offline atau data production kosong.
8. Menampilkan status eksplisit `Mode offline: menampilkan contoh listing.` saat fallback digunakan.
9. Menambahkan layout responsive untuk kontrol harga dan sticky action bar pada filter sheet.

## Validasi browser

Homepage lokal merender empat fallback listing dengan metadata seller, harga, distrik, favorite, share, dan detail. Filter `scoopy`, harga minimum `1000000`, dan harga maksimum `30000000` menghasilkan satu listing Honda Scoopy dan URL `/?q=scoopy&min_price=1000000&max_price=30000000`. Filter sheet menampilkan seluruh kontrol yang diminta dan tetap usable pada viewport browser yang tersedia.
