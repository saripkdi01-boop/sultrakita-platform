# AI Listing Assistant

Fitur AI Listing Assistant menganalisis foto produk pertama pada modal **Pasang iklan gratis**. Hasilnya mengisi judul, deskripsi, kategori, dan harga awal; seller tetap wajib memeriksa serta mengedit hasil sebelum menerbitkan listing.

## Environment Vercel

Tambahkan variabel berikut pada **Project Settings → Environment Variables** untuk environment Production, Preview, dan Development sesuai kebutuhan:

```text
GEMINI_API_KEY=<Google Gemini API key>
GEMINI_MODEL=gemini-2.0-flash
```

`GEMINI_API_KEY` harus server-only. Jangan memakai prefix `NEXT_PUBLIC_`, jangan menaruhnya di `next-app/.env.example` dengan nilai asli, dan jangan mengirimnya ke browser.

## Alur UI

Seller membuka **Pasang iklan gratis**, memilih foto JPG, PNG, atau WebP berukuran maksimal 8 MB, lalu menekan **Generate Otomatis dengan AI**. `AiListingAssistant` mengirim data URL gambar melalui Server Action `generateListingFromImage`. Server Action memvalidasi MIME type dan ukuran, memanggil Gemini Vision, membersihkan JSON, lalu mengirim hasil terstruktur kembali ke komponen client. Tombol **Edit Manual** mengingatkan seller untuk meninjau hasil AI sebelum publish.

Video tidak dikirim ke Gemini; foto pertama yang dipilih digunakan sebagai sumber analisis. Jika AI tidak aktif atau mengalami kegagalan, modal tetap dapat dipakai dengan pengisian manual dan pesan error yang ramah.

## Prompt sistem

> Kamu adalah asisten listing marketplace lokal Sulawesi Tenggara. Analisis foto produk secara hati-hati. Jangan mengarang merek, kondisi, ukuran, atau spesifikasi yang tidak terlihat; gunakan bahasa yang jujur dan tandai hal yang perlu dikonfirmasi seller. Pertimbangkan konteks Kendari, Buton, Konawe, Wakatobi, dan daerah Sultra untuk istilah lokal yang relevan. Perkirakan rentang harga wajar dalam Rupiah Indonesia berdasarkan visual dan kategori, bukan kepastian harga. Kembalikan hanya JSON valid dengan `title` maksimal 60 karakter, `description` maksimal 300 karakter, `category` dari daftar kategori yang diizinkan, `estimated_price_min`, `estimated_price_max`, dan `suggested_tags`.

## Database analytics

Migrasi `supabase/migrations/20260905100000_add_ai_listing_tracking.sql` menambahkan `is_ai_assisted` dan `ai_generation_timestamp` ke `public.listings`. Integrasi publish berikutnya dapat mengisi kedua kolom tersebut setelah seller menyimpan hasil AI.
