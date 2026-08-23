# SultraKita — Launch Checklist

## Data dan infrastruktur

| Pemeriksaan | Status target | Bukti |
|---|---|---|
| Supabase/Postgres transaction pooler aktif | Wajib | `GET /api/health` mengembalikan `healthy` |
| Migrasi `001_initial.sql` diterapkan | Wajib | Migration history dan query tabel |
| Foto tersimpan di R2/object storage | Wajib untuk upload | Posting foto, redeploy, buka ulang URL foto |
| Backup harian dan restore drill | Wajib | File backup dan log restore terbaru |
| `PUBLIC_SITE_URL` mengarah domain final | Wajib | Canonical dan sitemap |
| OTP provider produksi | Wajib sebelum publik | OTP diterima pada nomor uji |

## Konten awal yang autentik

Sebelum promosi, onboarding **50 listing awal dari mitra UMKM nyata** di Kendari dan kabupaten sekitar. Setiap mitra harus menyetujui penggunaan foto, nama usaha, nomor kontak, lokasi, harga, dan deskripsi. Jangan mengisi database dengan listing dummy yang terlihat seperti aktivitas warga.

## SEO dan distribusi

Daftarkan domain live ke [Google Search Console](https://search.google.com/search-console), kirim `/sitemap.xml`, uji beberapa URL listing dengan URL Inspection, dan verifikasi bahwa canonical serta `og:image` menggunakan URL absolut. Buat serta verifikasi [Google Business Profile](https://www.google.com/business/) untuk identitas usaha SultraKita, jam layanan, area Kendari, dan tautan situs. Bagikan listing melalui WhatsApp dan Facebook setelah seller menyetujui teks promosi.

## Keamanan dan operasi

Pastikan `ADMIN_TOKEN`, payment secret, OTP token, database URL, dan object storage token hanya berada di secret manager Vercel. CORS harus berupa daftar domain eksplisit. Uji akses anonim ke endpoint pribadi, upload file MIME palsu, rate limit OTP/listing/report, webhook signature invalid, serta hak akses seller terhadap listing orang lain.

## Penerimaan pascadeploy

Posting satu listing uji dengan foto, lakukan redeploy, lalu pastikan listing dan foto tetap ada. Buka URL `/listing/{slug}-{id}` dari browser anonim, validasi metadata dengan Rich Results Test, cek `robots.txt` dan sitemap, lalu pantau error log, statistik nyata homepage, webhook, dan antrean moderasi selama 24 jam pertama.
