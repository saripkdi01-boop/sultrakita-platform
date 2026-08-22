# SultraKita P0 Hardening Checkpoint

Checkpoint ini menerapkan lanjutan dari rancangan session/ownership dan menyelaraskan perilaku keamanan Express dengan Worker sejauh didukung runtime produksi saat ini.

## Perubahan yang diterapkan

| Area | Implementasi |
|---|---|
| OTP abuse control | Rate limit berbasis IP untuk request/verify OTP pada Express dan Worker, tetap mempertahankan batas lima percobaan per challenge. |
| Session lifecycle | Cleanup session dan challenge kedaluwarsa terjadwal pada Express dan Worker, ditambah index session untuk lookup user/expiry. |
| Admin boundary | Endpoint admin Worker kini membutuhkan session user ber-role `admin` sekaligus `ADMIN_TOKEN`; Express tetap memakai kedua lapisan tersebut. |
| Listing ownership | Create/update listing mengambil identity seller dari session; `city` dipatok ke Kendari; body tidak lagi menjadi sumber identity. |
| Conversation ownership | History, message mutation, dan SSE stream Express memerlukan membership conversation; Worker sudah memakai membership check pada endpoint message. |
| Data privacy | Nomor telepon tidak lagi dikirim pada public user profile atau public listing detail Express; Worker public listing detail tidak memilih nomor telepon. |
| Resource validation | Favorite hanya dapat menunjuk listing active; report wajib menunjuk listing yang ada; suggestion memakai user dari session bila authenticated. |
| Upload boundary | Upload gambar Express kini membutuhkan session, memeriksa magic bytes JPEG/PNG/WEBP, dan membersihkan file lokal saat terjadi error. |
| Test durability | Smoke test donasi memakai campaign fixture unik agar dapat diulang terhadap database persisten tanpa false failure. |

## Verifikasi lokal

Perintah berikut lulus pada checkpoint ini:

```bash
npm run verify:local
node --input-type=module --check < worker.js
git diff --check
```

Regression suite mencakup admin boundary, validasi identifier, OTP lockout, session identity binding, ownership denial, conversation membership, PII redaction, upload boundary, logout revocation, report validation, dan safe error envelope.

## Batas yang masih eksplisit

Worker belum memiliki durable image upload karena akun Cloudflare mengembalikan respons bahwa R2 harus diaktifkan melalui Dashboard. Jangan mengaktifkan jalur upload Worker sampai binding R2 resmi tersedia. Endpoint external listings tetap synthetic fixture dan live third-party synchronization tetap disabled by design; sinkronisasi nyata memerlukan credential dan akses partner resmi.

Deployment Cloudflare belum dipublish pada checkpoint ini sampai verifikasi binding dan secret production selesai. Deployment Vercel dapat mengikuti push repository karena `vercel.json` telah menunjuk `server.js`, tetapi secret production harus tetap dikonfigurasi pada environment Vercel, bukan di repository.
