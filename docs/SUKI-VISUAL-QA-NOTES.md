# SUKI Suits — Catatan QA Visual

## Pemeriksaan desktop awal

Halaman root memuat dengan status HTTP 200. Hero menampilkan brand SUKI, copy lokal, search panel empat kolom, dan visual hunian dengan stamp SiKumbang. Trust strip menampilkan tiga pola kepercayaan serta CTA pemilik properti. Pada section explore, kartu tampil dalam grid dua kolom dan panel peta berada sticky di sisi kanan. Setiap kartu menampilkan status badge, tombol heart, foto bergeser, indikator dots/counter, harga Rupiah, spesifikasi, ID lokasi, dan sisa unit.

Pada screenshot browser, struktur visual terbaca baik pada viewport desktop. Aset foto eksternal termuat dan memberi variasi visual; karena file data SiKumbang asli tidak ikut tersedia di shared files, halaman memakai curated fallback delapan listing dengan ID SiKumbang yang dipetakan ke contoh area Kendari dan akan mencoba `/api/listings?limit=50` saat runtime tersedia.

## Catatan tindak lanjut

Uji berikutnya mencakup carousel manual, favorit, filter komersial, mode peta, modal detail/KPR, submit newsletter, dan responsive mobile. Jika backend tidak memiliki kredensial database di lingkungan lokal, status fallback sample dianggap jalur yang valid dan tidak boleh menyebabkan halaman gagal.

## Hasil interaksi desktop

Tombol heart pada kartu pertama berhasil mengubah state menjadi `♥`, menampilkan badge `1` pada ikon tersimpan di header, dan menampilkan toast konfirmasi. Tombol foto berikutnya berhasil mengubah counter dari `3 / 3` menjadi `1 / 3` lalu carousel mengikuti state baru; timer otomatis juga tetap berjalan. Hover pada kartu menampilkan kontrol panah dengan jelas.

## Hasil filter dan explore

Filter `Komersial premium` berhasil menyaring hasil menjadi dua listing, yaitu Villa Pesisir Nambo dan Ruko Boulevard Teluk, sambil memperbarui ringkasan hasil serta jumlah listing pada peta. Mode daftar/peta tetap menampilkan struktur map panel dan marker harga sehingga split-view siap digunakan pada desktop serta dapat berubah menjadi peta penuh pada breakpoint responsif.

## Hasil modal detail

Modal detail berhasil terbuka dari kartu melalui klik pada area non-kontrol. Dialog menampilkan foto utama, label status/tipe, harga, judul, lokasi, rating agen, deskripsi, ID data lokasi, sisa unit, serta aksi `Hubungi agen` dan `Simpan`. Dialog juga berhasil ditutup melalui tombol close.

## Hasil simulator dan lower sections

Section agen dan simulator KPR tampil bersebelahan pada desktop. Simulator memiliki field harga properti, uang muka, tenor, output cicilan, dan catatan bahwa angka bersifat indikatif. Tombol pembuka simulator tersedia untuk dialog lanjutan. Closing newsletter dan footer juga tampil pada akhir halaman dengan kontras yang memadai.

## Hasil simulator KPR

Pemicu langsung pada tombol `Buka simulator KPR` berhasil membuka modal `SIMULASI KPR SUKI`. Dialog memuat input harga, pilihan uang muka, tenor, tombol hitung, dan hasil estimasi awal sekitar Rp 3,8 jt per bulan. Modal menggunakan backdrop blur dan dapat ditutup dengan tombol `×`.

## Catatan tambahan

Pemicu langsung pada tombol view map tidak mengubah tampilan screenshot saat filter komersial aktif, sehingga mode map tetap dipertahankan sebagai fitur yang perlu diverifikasi pada viewport breakpoint yang tepat. Dialog KPR berhasil dipastikan tampil melalui pemicu langsung dan tidak mengganggu halaman setelah ditutup.

## Deployment Vercel

Deployment dari commit `4a8b7bd` berstatus `READY`. URL preview standar mengarah ke login Vercel karena deployment protection tim aktif. Tautan shareable sementara berhasil membuka halaman publik tanpa login dan menampilkan title `SUKI Suits — Properti Terpercaya di Sulawesi Tenggara`, hero, search panel, trust SiKumbang, serta delapan kartu listing dengan kontrol interaktif.

## Frame demo

Screenshot bersih `00-04-18` dan `00-04-27` memperlihatkan kartu pertama dalam state carousel berbeda dengan counter `3 / 3` dan `2 / 3`, sekaligus memperlihatkan heart tersimpan dan panel peta. Frame ini dapat dipakai untuk dokumentasi visual slider.

## Verifikasi final production

Deployment `dpl_FSoN3ffR1VwvfFQF46pi62i1ceMk` berstatus `READY` dengan target `production` dan alias domain utama `sultrakita-platform.vercel.app`. Pemeriksaan langsung pada URL deployment terbaru menampilkan **8 listing** dan marker peta **8 listing di area ini**, sehingga fallback curated berjalan benar setelah seed demo non-properti dikeluarkan dari feed live.
