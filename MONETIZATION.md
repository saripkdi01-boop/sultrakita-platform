# SultraKita — Monetization Plan

SultraKita mempertahankan akses listing dasar yang gratis, lalu menambahkan pendapatan berlapis yang relevan untuk seller lokal. Semua fitur berbayar dipasang di belakang tabel `feature_flags` agar dapat diuji per wilayah tanpa mengubah kode inti.

## Paket dan harga awal

| Produk | Harga awal | Nilai untuk seller | Flag |
|---|---:|---|---|
| Boost 3 hari | Rp15.000 | Posisi lebih tinggi di kategori dan wilayah | `boost_listing` |
| Boost 7 hari | Rp30.000 | Visibilitas satu minggu | `boost_listing` |
| Boost 30 hari | Rp90.000 | Promosi jangka panjang | `boost_listing` |
| Toko UMKM | Rp99.000/bulan | Kuota listing, halaman toko, badge, statistik | `store_subscription` |
| Verifikasi seller | Rp25.000 sekali bayar | Review identitas dan badge kepercayaan | `paid_verification` |
| Lowongan kerja | Rp35.000/30 hari | Distribusi lowongan ke pencari kerja lokal | `paid_jobs` |
| Banner lokal | Mulai Rp250.000/bulan | Slot iklan tersegmentasi wilayah | konfigurasi admin |
| Komisi escrow | 2% transaksi | Perlindungan transaksi kirim | `escrow_commission` |

## Proyeksi skenario sederhana

Proyeksi ini adalah **model perencanaan, bukan jaminan pendapatan**. Asumsi: 5% listing membayar boost rata-rata Rp30.000 per bulan, 1% seller berlangganan Toko UMKM, dan 0,5% listing baru memakai verifikasi berbayar. Pendapatan donasi dan banner belum dihitung.

| Listing aktif | Boost | Langganan toko | Verifikasi | Estimasi bruto/bulan |
|---:|---:|---:|---:|---:|
| 100 | Rp150.000 | Rp99.000 | Rp12.500 | **Rp261.500** |
| 1.000 | Rp1.500.000 | Rp990.000 | Rp125.000 | **Rp2.615.000** |
| 10.000 | Rp15.000.000 | Rp9.900.000 | Rp1.250.000 | **Rp26.150.000** |

Aktifkan fitur setelah alur order dan webhook stabil. Urutan yang disarankan adalah boost, toko, verifikasi, lowongan, banner, kemudian escrow. Refund, idempotensi webhook, pencatatan payment, dan rekonsiliasi harian wajib selesai sebelum uang pengguna ditahan.

## Pengaktifan

Admin dapat mengubah `enabled` pada `feature_flags` melalui database terproteksi atau endpoint admin yang akan ditambahkan bersama payment ledger. Jangan mengaktifkan escrow hanya karena provider pembayaran sudah terhubung; aktifkan setelah status order, dispute, settlement, dan refund lolos uji integrasi.
