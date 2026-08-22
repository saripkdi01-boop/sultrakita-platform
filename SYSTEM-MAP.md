# SultraKita — Current System Map

Tanggal audit: 22 Agustus 2026

## Runtime dan Deployment

| Layer | Implementasi | Catatan |
|---|---|---|
| Frontend | Static HTML/CSS/JavaScript di `public/` | Homepage, admin, dan chat tersedia; sebagian besar UI dipadatkan dalam file single-page |
| Express API | `server.js` | Local/Vercel-style runtime; mengekspor `app` dan memakai `app.listen` hanya saat dijalankan langsung |
| Worker API | `worker.js` | Jalur Cloudflare Worker terpisah dengan implementasi bisnis yang lebih minimal |
| Database | `database.js` menggunakan `sql.js` dan SQLite file lokal | Cocok untuk local/demo; belum menjadi persistence durable multi-instance |
| Authentication | OTP challenge + hashed session token | Endpoint mutation belum konsisten menegakkan session/ownership |
| Storage | Local `uploads/`; optional remote upload melalui env R2-style adapter | Production perlu object storage durable dan validasi signature file |
| Third-party | Optional OTP provider, WhatsApp Cloud API, optional remote object storage | Provider belum boleh dianggap aktif tanpa env dan smoke test |
| Observability | `/api/health`, analytics event, console logging | Belum ada request ID dan structured operational log yang seragam |
| Deployment config | `wrangler.toml`, `wrangler-short.toml`, `vercel.json` | Express dan Worker perlu compatibility matrix agar tidak drift |

## Data Domain

Domain utama yang tersedia adalah `users`, `categories`, `listings`, `listing_images`, `favorites`, `comments`, `reports`, `suggestions`, `donations`, `sessions`, `otp_challenges`, `seller_verifications`, `analytics_events`, `conversations`, dan `messages`.

## Risiko Utama Terverifikasi

Pertama, beberapa endpoint menerima identitas user dari request body sehingga authorization dan ownership belum menjadi sumber kebenaran server. Kedua, schema menyimpan `is_verified` dan juga menambahkan `verification_status`; query listing memakai kolom legacy `is_verified`, sedangkan proses moderasi memperbarui `verification_status`. Ketiga, persistence file lokal dan upload lokal tidak durable untuk scale-out Worker. Keempat, `AUDIT.md` sebelumnya tidak lagi merepresentasikan kondisi aktual karena menyatakan frontend, test, validasi, dan upload belum tersedia. Kelima, Express dan Worker memiliki jalur implementasi berbeda sehingga setiap perbaikan harus diuji terhadap keduanya.

## Baseline Test

Perintah `npm test` pada clone bersih lulus dengan 4 test dan 0 failure pada audit awal. Coverage masih belum memadai untuk authorization, OTP abuse, ownership, upload validation, conversation membership, migration, dan critical frontend journeys.
