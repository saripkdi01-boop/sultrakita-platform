# Dokumentasi Revisi Beranda dan Header SUKI

**Tanggal:** 8 September 2026  
**Ruang lingkup:** Beranda SUKI Platforms, header utama, dan responsivitas tablet/mobile.

## Ringkasan

Revisi ini menindaklanjuti area yang ditandai pada referensi visual. Blok pengantar besar pada sesi Beranda dihapus agar pengguna langsung melihat filter feed, stories, dan composer. Header juga dirapikan agar fungsi utama lebih jelas dan konsisten secara visual.

## Perubahan fungsional

| Area | Sebelum | Sesudah |
|---|---|---|
| Pengantar Beranda | Menampilkan label “RUANG WARGA”, judul “Beranda”, dan deskripsi panjang yang mengambil ruang vertikal | Dihapus; area feed dimulai dari filter konten dengan opsi Beranda tetap tersedia melalui navigasi utama |
| Ikon header pertama | Ikon toko/Marketplace dengan tautan ke Marketplace | Ikon lonceng untuk notifikasi dengan badge jumlah notifikasi |
| Ikon header kedua | Ikon lonceng untuk notifikasi | Trigger ikon profil yang membuka menu ProfileHub dan fitur profil |
| Marketplace di header | Shortcut berada di header utama | Tetap tersedia melalui Quick Navigation “SUKI Marketplace”, sehingga fitur tidak hilang dan tidak bercampur dengan notifikasi |
| Search tablet/mobile | Search bar penuh mengambil ruang header | Diganti ikon kaca pembesar; klik ikon membuka search bar sementara yang tetap dapat diakses |

## Perubahan visual dan aksesibilitas

Ketiga kontrol header menggunakan gaya tombol yang sama dengan icon set lain: ukuran area sentuh konsisten, bentuk lingkaran, warna mengikuti token tema, dan memiliki `aria-label`. Badge notifikasi tetap menggunakan label aksesibel. Tombol pencarian memiliki `aria-expanded` untuk menyatakan status buka/tutup kepada screen reader.

Pada tablet dan mobile, search bar default disembunyikan untuk menjaga header tetap ringkas. Ketika ikon kaca pembesar ditekan, search bar dibuka secara overlay di bawah header. Pada desktop, search bar tetap tampil seperti sebelumnya.

## File yang direvisi

- `next-app/app/beranda/page.tsx` — menghapus blok pengantar besar pada Beranda.
- `next-app/components/layout/Header.tsx` — mengubah urutan dan fungsi ikon header serta menambahkan toggle search responsive.
- `next-app/app/globals.css` — menambahkan aturan responsive untuk search icon dan spacing Beranda.

## Dampak dan kompatibilitas

Perubahan ini tidak mengubah binding data Supabase, route Marketplace, callback ProfileHub, atau mekanisme feed. Shortcut Marketplace tetap dapat diakses dari Quick Navigation. Search desktop tetap dipertahankan; hanya mode tablet/mobile yang berubah menjadi ikon ringkas.

## Validasi

Validasi yang dilakukan:

- TypeScript check: `npx tsc --noEmit`
- Production build: `npm run build`
- Pemeriksaan whitespace Git: `git diff --check`

Build Next.js berhasil dan seluruh route yang ada tetap dapat dikompilasi.
