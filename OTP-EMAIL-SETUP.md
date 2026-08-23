# OTP Email SultraKita

## Status implementasi

SultraKita sekarang mendukung dua channel autentikasi: WhatsApp dan email. Frontend menyediakan pilihan channel pada login akun dan form seller. Endpoint yang dipakai adalah `POST /api/auth/request-otp` dan `POST /api/auth/verify-otp` dengan body `channel: "email"` serta `email` yang valid.

Server menghasilkan OTP enam digit dengan `crypto.randomInt`, hanya menyimpan hash SHA-256, memberi expiry lima menit, menghapus challenge lama untuk email yang sama, membatasi lima percobaan verifikasi, dan memakai perbandingan timing-safe. Pada production, kode tidak pernah dikembalikan sebagai response. `OTP_DEV_MODE=true` hanya boleh dipakai pada local/staging untuk mendapatkan `dev_code` saat provider belum dikonfigurasi.

## Provider email

Implementasi memakai HTTP transactional email API generik. Provider yang memiliki endpoint kompatibel dengan payload `{ from, to, reply_to, subject, text, html }` dapat dipakai. Resend adalah contoh paling sederhana dengan endpoint `https://api.resend.com/emails` dan header `Authorization: Bearer <API_KEY>`.

Set environment pada Vercel Project Settings untuk Production dan Preview sesuai kebutuhan:

```dotenv
EMAIL_PROVIDER_URL=https://api.resend.com/emails
EMAIL_PROVIDER_TOKEN=re_xxxxxxxxx
EMAIL_FROM=SultraKita <no-reply@domain-yang-sudah-diverifikasi.id>
EMAIL_REPLY_TO=halo@domain-yang-sudah-diverifikasi.id
OTP_DEV_MODE=false
```

Alamat `EMAIL_FROM` harus berasal dari domain atau alamat yang sudah diverifikasi pada provider. Jangan pernah menyimpan token provider pada frontend, `.env` yang di-commit, atau log. Gunakan secret manager deployment.

## Alur pengujian

Untuk local/staging, jalankan database yang sudah dimigrasikan dan aktifkan `OTP_DEV_MODE=true`. Kirim request berikut:

```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H 'content-type: application/json' \
  -d '{"channel":"email","email":"alamat-uji@example.com"}'
```

Pastikan response memiliki `channel: "email"`, destination email tersamarkan, dan `dev_code`. Pada production, response yang sama tidak boleh mengandung `dev_code` dan harus melaporkan `delivered: true` hanya setelah provider menerima response sukses.

Verifikasi dengan:

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H 'content-type: application/json' \
  -d '{"channel":"email","email":"alamat-uji@example.com","code":"123456","role":"buyer","district":"Kendari"}'
```

Uji expiry lima menit, OTP salah lima kali, penggunaan ulang, rate limit, provider timeout, email tidak valid, dan database unavailable. Pastikan database production sudah menjalankan `database/migrations/004_email_otp.sql` sebelum channel email diaktifkan. Migrasi tersebut membuat phone nullable untuk akun email-only, menambah `email_verified`, email challenge, channel challenge, index, dan constraint destination.
