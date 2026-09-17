# Uji Responsif Marketplace — 2026-09-17

Pengujian Playwright dilakukan pada viewport 320x740, 360x800, 390x844, 414x896, dan 430x932.

Hasil structural check halaman nyata: `document.documentElement.scrollWidth` sama dengan `innerWidth` pada semua viewport; tidak ada horizontal overflow. Toolbar filter berada dalam batas viewport. Kategori mobile berada dalam batas viewport.

Data listing API lokal tidak tersedia saat pengujian (`Listing sementara belum tersedia`), sehingga kartu aktual tidak dirender.

Untuk menguji CSS product card, dibuat fixture DOM sementara di dalam scope `.marketplace-page`. Hasil fixture: tidak ada overflow pada semua viewport; card width berturut-turut 143, 163, 178, 190, dan 198 px; action row tetap satu baris dengan grid dua kolom; tinggi action row 33 px pada viewport 360–430 px. Pada 320 px action tetap dua kolom dengan total lebar 129 px.

Fixture hanya hidup di browser dan tidak mengubah source code aplikasi.
