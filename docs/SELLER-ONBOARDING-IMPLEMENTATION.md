# Seller Onboarding v2 — API, motion, dan eksperimen

## API contract

Semua endpoint di bawah memakai envelope existing `{ success, data }` atau `{ success: false, code, error }`. Endpoint protected membutuhkan header `Authorization: Bearer <session-token>` yang diterbitkan oleh OTP atau Google OAuth.

| Method | Endpoint | Kegunaan |
|---|---|---|
| `GET` | `/api/seller/onboarding` | Mengambil progress seller yang sedang login. Jika belum ada row, server mengembalikan state awal tanpa membuat data sensitif. |
| `PATCH` | `/api/seller/onboarding` | Menyimpan `current_step`, `account_data`, `store_data`, `product_data`, dan `completed_steps`. Server membatasi panjang teks dan jumlah array. |
| `POST` | `/api/seller/onboarding/suggest` | Membuat draft title, description, price, dan category dari metadata produk. Jika `OPENAI_API_KEY` tersedia, server memakai provider OpenAI-compatible; jika tidak, server memakai fallback lokal yang dapat ditinjau seller. |
| `POST` | `/api/seller/onboarding/finalize` | Memvalidasi state seller, menyimpan `store_name`/`store_description`, membuat listing pertama, dan menandai progress completed. Foto tetap diunggah melalui endpoint storage existing setelah listing dibuat. |

Contoh payload progress:

```json
{
  "current_step": 3,
  "account_data": { "name": "Rina Aulia", "phone": "08xxxxxxxxxx" },
  "store_data": {
    "store_name": "Rina Gadget Kendari",
    "store_category": "elektronik",
    "store_description": "Gadget pilihan dengan transaksi aman.",
    "district": "Kendari"
  },
  "product_data": {
    "title": "iPhone 13 128GB",
    "description": "Kondisi mulus, lokasi Kendari.",
    "price": "6500000",
    "category_id": "2",
    "condition": "second",
    "shipping_methods": ["pickup", "jne"],
    "photo_names": ["iphone-13.jpg"]
  },
  "completed_steps": [1, 2]
}
```

## Data protection decisions

OTP tetap menjadi mekanisme aktivasi. KTP dan selfie tidak dijadikan field wajib pada activation path karena implementasi yang aman memerlukan consent, purpose limitation, encryption, retention policy, akses reviewer, dan vendor verifikasi yang nyata. Migration onboarding hanya menyimpan progress JSON terstruktur; file foto tidak disimpan sebagai byte di database. API suggestion tidak menerima atau mencetak secret provider dan selalu mengembalikan fallback jika provider AI gagal.

## Motion guideline

| State | Motion | Batasan |
|---|---|---|
| Pindah step | `opacity` + `translateY(8px)` selama 220ms | Tidak menganimasikan layout atau ukuran elemen |
| Progress | Garis amber mengisi secara linear selama 240ms | Tetap terbaca saat reduced motion |
| Focus | Amber ring dan scale 1.012 | Tidak mengubah posisi field |
| AI loading | Shimmer pada status inline | Tidak mengunci seluruh halaman |
| Error | Shake 300ms pada field pertama yang invalid | Pesan error tetap tersedia sebagai teks |
| Success | Toast dan summary state | Tidak memakai confetti berat di mobile |

Semua motion non-esensial dinonaktifkan melalui `prefers-reduced-motion: reduce`. Target sentuh minimal 44px diterapkan pada action button dan input.

## Rencana A/B testing

Eksperimen awal membandingkan form legacy dengan wizard onboarding v2, bukan mengubah semua traffic sekaligus. Randomisasi dapat dilakukan melalui feature flag server atau assignment cookie yang tidak memuat data pribadi. Kelompok A melihat form lama; kelompok B melihat wizard. Kedua kelompok tetap memakai OTP dan API listing yang sama.

| Metrik | Definisi | Target awal |
|---|---|---:|
| Start rate | `onboarding_start / seller_cta_view` | +10% vs baseline |
| Step completion | Seller yang menyelesaikan setiap step dibagi seller yang memulai | >80% pada step 1–3 |
| Time to first listing | Waktu dari start sampai listing `201` | <3 menit median |
| Photo adoption | Listing pertama dengan minimal satu foto | >70% |
| AI acceptance | Draft suggestion yang tetap dipakai setelah review | Diukur, bukan diasumsikan |
| Activation | Seller dengan listing aktif dan/atau percakapan pertama dalam 7 hari | +15% vs baseline |

Eksperimen dihentikan bila error rate meningkat, OTP/provider failure meningkat, atau seller melaporkan kebingungan. Analisis harus dipisahkan berdasarkan channel OTP, mobile/desktop, wilayah, dan status provider AI. Tidak ada klaim completion rate industri yang dipakai sebagai fakta tanpa baseline internal SultraKita.
