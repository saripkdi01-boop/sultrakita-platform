# Root Cause Audit Mobile/Tablet — 29 Agustus 2026

## Evidence
Current local renders were captured at 390x844 and 834x1194 using the existing runtime and real fallback/API data.

## Findings
Pada 390px, topbar sudah lebih stabil tetapi primary navigation masih memakan tinggi besar dan label terpotong di sisi kanan karena enam item dipaksa menjadi row tanpa mekanisme item visibility yang cukup. Main content kemudian dimulai tanpa context heading/greeting yang kuat. Composer dan discovery card masih terlalu tinggi; marketplace heading terpecah menjadi terlalu banyak baris karena tombol Sync/Filter ikut berebut ruang satu row. Kartu kategori memakai visual yang kuat tetapi tinggi dan ikon terlalu besar untuk mobile. Listing belum terlihat dalam viewport awal karena vertical density terlalu longgar.

Pada 834px, compact rail sudah tampil tetapi primary navigation tetap mengambil satu baris penuh dan layout main dimulai jauh ke kanan dengan ruang kosong kiri yang cukup besar. Composer dan discovery section terlihat baik namun masih oversized. Marketplace header dan action buttons terpisah secara visual, dan listing card memakai horizontal layout yang tinggi. Secara struktural tidak ditemukan page-level horizontal overflow pada hasil render, tetapi ada masalah **vertical economy**, navigasi rangkap, dan content priority.

## Root cause
Akar masalah bukan hanya breakpoint, melainkan kombinasi dari tiga hal: `icon-tabbar` masih diposisikan sebagai sistem global yang selalu hidup pada narrow viewport; content renderer memakai section cards dengan padding/height legacy yang tidak mengetahui density mobile; dan layout tablet menggunakan rail + centered main tanpa aturan lebar yang mengikat main content ke ruang efektif viewport. Selain itu, stylesheet tersebar pada `styles.css`, `theme-modern.css`, dan `rescue-upgrade.css`, sehingga specificity/override membuat perilaku tiap breakpoint sulit diprediksi.

## Riset teknis
Prinsip perbaikan mengikuti dokumentasi resmi MDN: layout responsive seharusnya memakai flexible grids, media queries pada titik ketika content mulai terlihat buruk, dan mobile-first reflow daripada fixed-width compression [1] [2]. Safe-area inset dipakai dengan fallback agar UI tidak tertutup notch atau home indicator [3].

## References
[1]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design "MDN Responsive web design"
[2]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries "MDN Media query fundamentals"
[3]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env "MDN env() CSS function"

## Before/after render verification

Render setelah patch pada 390px menunjukkan enam item primary navigation sekarang muat sebagai enam kolom konsisten tanpa label terpotong, dengan icon dan label terikat secara vertikal. Marketplace header tidak lagi memaksa tombol Sync/Filter berebut ruang satu baris; action turun ke baris terkontrol. Kartu kategori lebih pendek sehingga listing mulai terlihat lebih cepat.

Render 834px menunjukkan compact rail tetap berada di kiri, primary navigation tetap terbaca penuh dalam satu baris, main content tetap terpusat, dan listing card tidak melebar keluar viewport. Tidak terlihat indikasi horizontal page overflow pada kedua ukuran render.
