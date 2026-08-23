# Audit dan arah redesign onboarding seller SultraKita

## Audit runtime saat ini

SultraKita saat ini memakai Node.js/CommonJS + Express + PostgreSQL pada backend dan HTML/CSS/JavaScript vanilla pada frontend. Form seller berada di `public/index.html` sebagai satu dialog panjang, dengan satu submit utama yang menggabungkan verifikasi OTP, pembuatan session seller, pembuatan listing, lalu upload foto. Alur ini sudah memiliki OTP WhatsApp/email, kompresi foto, presign upload, fallback upload multipart, kategori, wilayah, harga, kondisi, dan deskripsi.

Friction terbesar adalah semua keputusan diminta sekaligus sebelum pengguna melihat hasil: judul, OTP, wilayah, deskripsi, harga, kondisi, kategori, dan foto berada dalam satu permukaan. Form juga tidak menyimpan progress, belum memiliki resume state, belum memiliki draft listing, dan belum memberikan preview atau bantuan pengisian foto. OTP masih menjadi gerbang yang bercampur dengan detail listing sehingga kegagalan provider dapat terasa seperti kegagalan pembuatan iklan. Field KTP/selfie tidak akan dijadikan wajib pada aktivasi pertama karena data biometrik/identitas memerlukan dasar hukum, consent, penyimpanan aman, dan provider verifikasi yang benar-benar dikonfigurasi.

## Temuan referensi Meta

Meta menjelaskan bahwa fitur Marketplace pada Maret 2026 dapat membuat draft listing dari foto, mengisi detail, dan menyarankan harga berdasarkan barang serupa di area pengguna. Sumber yang sama juga menyebut auto-reply AI untuk pertanyaan pembeli dan rangkuman profil seller.[1]

Pada 24 Juli 2026 Meta memperkenalkan aplikasi Seller untuk seller Marketplace di Amerika Serikat, dengan seller home, AI listing creation, bulk listing, inventory management, unified inbox, dan performance insights seperti views, clicks, message threads, serta sold listings.[2]

Referensi tersebut dipakai sebagai inspirasi capability, bukan sebagai alasan untuk menyalin seluruh produk Meta. SultraKita akan memprioritaskan onboarding singkat, listing pertama yang cepat, state resume, dan AI assistant yang fail-safe; inbox dan insights tetap memanfaatkan fitur existing/roadmap yang sudah ada.

## Gap analysis

| Area | Kondisi SultraKita | Pola benchmark | Keputusan redesign |
|---|---|---|---|
| Aktivasi seller | OTP dan detail listing berada dalam satu dialog panjang | Seller flow memisahkan pekerjaan inti dan bantuan | Wizard 4 langkah dengan state tersimpan |
| Listing dari foto | Upload terjadi setelah listing dibuat | Foto menjadi input awal untuk draft AI | Foto produk dipindah ke langkah Produk Pertama dan diberi preview |
| AI assistance | Belum ada endpoint suggestion | Meta mengisi judul, deskripsi, harga, kategori | Endpoint optional server-side + heuristic fallback, tanpa secret frontend |
| Progress | Tidak dapat dilanjutkan setelah reload | Seller home menampilkan pekerjaan yang perlu perhatian | `seller_onboarding_progress` dengan resume |
| Verifikasi | OTP sudah tersedia; KTP/selfie belum menjadi workflow aman | Verifikasi dapat dipakai untuk trust | OTP tetap aktivasi; KTP/selfie hanya tahap lanjutan opsional |
| Mobile UX | Dialog panjang dan banyak field | Flow seller dedicated dan task-oriented | Step maksimal 3–4 field, tombol sticky, preview, focus/validasi |
| Bulk/inbox/insights | Inbox existing; bulk belum ada; analytics dasar tersedia | Seller menyatukan inventory, inbox, insights | CTA onboarding mengarah ke dashboard/produk berikutnya; tidak membuat klaim fitur yang belum ada |

## Scope implementasi

Implementasi tahap ini menambahkan wizard seller progressive di halaman utama dengan empat step: Akun & Verifikasi, Toko, Produk Pertama, dan Selesai. Backend mendapat tabel progress, endpoint GET/PATCH progress, endpoint suggestion AI yang aman, dan endpoint finalize yang membuat listing melalui session seller existing. Upload foto tetap memakai endpoint storage existing setelah listing dibuat. Fallback lokal memastikan fitur tetap bisa dipakai saat AI provider belum dikonfigurasi.

## Referensi

[1]: https://about.fb.com/news/2026/03/facebook-marketplace-new-meta-ai-tools-make-selling-faster-and-easier/ "Facebook Marketplace’s New Meta AI Tools Make Selling Faster and Easier"
[2]: https://about.fb.com/news/2026/07/introducing-seller-app-facebook-marketplace/ "Introducing Seller, an App for Facebook Marketplace Sellers"
