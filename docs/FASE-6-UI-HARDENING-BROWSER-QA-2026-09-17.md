# Fase 6 — UI Hardening dan Browser QA Feed Suki

**Tanggal:** 17 September 2026  
**Branch:** `suki-feed-preview-20260917`  
**Status:** Selesai pada source dan preview lokal; belum production

## Perubahan UI

Beranda sekarang menampilkan tab feed yang terhubung ke filter server:

- Rekomendasi;
- Mengikuti;
- Terbaru;
- Properti;
- Video.

Tab menggunakan semantic `tablist` dan `tab`, serta `aria-selected` untuk selected state.

Recommendation reason dari API diteruskan ke kartu feed dan ditampilkan sebagai label accessible:

- Dari akun yang kamu ikuti;
- Populer di Suki Apps;
- Baru di beranda.

Label hanya ditampilkan jika server memiliki sinyal deterministik. Nilai kosong tidak diberi label palsu.

## Temuan browser QA

Pada viewport mobile 375px, browser QA menemukan akses cepat Beranda melebar sekitar 2px melewati viewport. CSS hardening kemudian ditambahkan untuk:

- membatasi width menjadi 100%;
- menghapus margin kanan negatif pada mobile;
- menggunakan grid dua kolom dengan `minmax(0, 1fr)`;
- mencegah item aksi memperlebar dokumen;
- menambahkan ellipsis untuk label panjang.

Pengukuran DOM setelah perbaikan:

```json
{
  "viewport": 375,
  "documentScrollWidth": 375,
  "bodyScrollWidth": 375,
  "quick": {
    "left": 6,
    "right": 369,
    "width": 363,
    "scrollWidth": 363,
    "clientWidth": 363
  }
}
```

Hasil tersebut memastikan tidak ada horizontal overflow pada viewport 375px.

## Browser QA

Desktop accessibility snapshot berhasil menemukan:

- tablist `Jenis beranda`;
- tab Rekomendasi selected;
- tab Mengikuti;
- tab Terbaru;
- tab Properti;
- tab Video;
- semantic article untuk postingan feed;
- label aksi dan profile link yang dapat diakses.

Interaksi tab Terbaru berhasil dan selected state berubah menjadi:

```text
Terbaru [selected]
```

Mobile snapshot pada viewport 375px juga berhasil. Setelah patch overflow, pengukuran document scroll width sama dengan viewport width.

## Verifikasi teknis

| Pemeriksaan | Hasil |
|---|---|
| Contract test | 10/10 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| Next.js build | Lulus |
| `git diff --check` | Lulus |
| Desktop accessibility snapshot | Lulus |
| Tab interaction | Lulus |
| Mobile viewport 375px | Lulus |
| Horizontal overflow | Tidak ada |
| Production branch | Tidak disentuh |
| Production deployment | Tidak dilakukan |

## Langkah berikutnya

Checkpoint berikutnya adalah browser regression matrix untuk viewport 320, 375, 768, 1024, dan desktop wide, lalu pengujian authenticated interaction untuk like, save, comment, dan share pada staging.

**Penulis:** Manus AI
