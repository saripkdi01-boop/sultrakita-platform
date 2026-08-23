# OTP Email SultraKita

## Status implementasi

SultraKita mendukung dua channel autentikasi, yaitu WhatsApp dan email. Frontend menyediakan pilihan channel pada login akun dan form seller. Endpoint yang dipakai adalah `POST /api/auth/request-otp` dan `POST /api/auth/verify-otp` dengan body `channel: "email"` serta alamat email yang valid.

Server menghasilkan OTP enam digit dengan `crypto.randomInt`, hanya menyimpan hash kode dan hash tujuan, memberi expiry lima menit, menghapus challenge lama untuk tujuan yang sama, membatasi lima percobaan verifikasi, dan memakai perbandingan timing-safe. Challenge baru disimpan di tabel PostgreSQL `auth_otp_challenges`; tabel legacy `otp_challenges` dipertahankan untuk kompatibilitas dan rollback historis, tetapi tidak dipakai untuk penulisan challenge baru. Pada production, kode tidak pernah dikembalikan sebagai response. `OTP_DEV_MODE=true` hanya boleh dipakai pada local/staging untuk mendapatkan `dev_code` saat provider belum dikonfigurasi.

## Provider email yang dapat langsung dihubungkan

Implementasi menyediakan dua mode. Mode `resend` memakai endpoint resmi Resend secara langsung dan menerima `RESEND_API_KEY`. Mode `generic` memakai endpoint HTTP pada `EMAIL_PROVIDER_URL` dengan Bearer token opsional; mode ini cocok untuk gateway transactional email lain yang menerima payload JSON dengan field `from`, `to`, `reply_to`, `subject`, `text`, dan `html`.

Untuk Resend, buat API key pada dashboard Resend, verifikasi domain pengirim, lalu masukkan variabel berikut ke Vercel Project Settings pada Environment yang akan digunakan. Nilai rahasia harus dimasukkan sebagai secret deployment, bukan ke repository.

```dotenv
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=SultraKita <no-reply@domain-yang-sudah-diverifikasi.id>
EMAIL_REPLY_TO=halo@domain-yang-sudah-diverifikasi.id
OTP_DESTINATION_PEPPER=nilai-acak-panjang-yang-hanya-ada-di-server
OTP_DEV_MODE=false
```

Jika memakai provider generik, gunakan konfigurasi berikut dan isi URL sesuai dokumentasi provider tersebut.

```dotenv
EMAIL_PROVIDER=generic
EMAIL_PROVIDER_URL=https://provider.example/v1/send
EMAIL_PROVIDER_TOKEN=token-rahasia-provider
EMAIL_FROM=SultraKita <no-reply@domain-yang-sudah-diverifikasi.id>
EMAIL_REPLY_TO=halo@domain-yang-sudah-diverifikasi.id
OTP_DESTINATION_PEPPER=nilai-acak-panjang-yang-hanya-ada-di-server
OTP_DEV_MODE=false
```

`EMAIL_FROM` harus berasal dari domain atau alamat yang sudah diverifikasi provider. Jangan menaruh API key pada frontend, file `.env` yang di-commit, parameter URL, atau log. `OTP_DESTINATION_PEPPER` dianjurkan diisi dengan nilai acak yang panjang; menggantinya akan membuat challenge OTP lama tidak dapat diverifikasi, sehingga lakukan rotasi dengan terencana.

## Migration PostgreSQL

Jalankan migration runner terhadap database production sebelum traffic autentikasi diarahkan ke deployment baru. Migration `004_email_otp.sql` membuat kompatibilitas pada tabel lama, sedangkan `005_auth_channels_google.sql` membuat `auth_otp_challenges`, tabel one-time `auth_login_exchanges`, kolom identitas Google, dan index terkait. Jangan mengubah file migration yang telah tercatat di ledger karena runner memeriksa checksum.

Sebagai perlindungan terhadap database production yang tertinggal, endpoint request/verify OTP juga menjalankan **compatibility bootstrap idempoten**. Bootstrap memastikan `users.email`, `users.email_verified`, `otp_challenges.email`, `otp_challenges.channel`, dan tabel `auth_otp_challenges` tersedia sebelum query OTP dijalankan. Mekanisme ini membantu pemulihan deployment lama, tetapi tidak menggantikan migration runner karena migration tetap diperlukan untuk ledger, Google OAuth, dan kontrol perubahan schema yang terukur. Database user harus memiliki izin DDL yang diperlukan; jalankan migration runner secara eksplisit sebagai langkah release utama.

## Pengujian

Untuk local atau staging, aktifkan `OTP_DEV_MODE=true` hanya sementara. Kirim request berikut.

```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H 'content-type: application/json' \
  -d '{"channel":"email","email":"alamat-uji@example.com"}'
```

Pastikan response memiliki `channel: "email"`, destination yang tersamarkan, dan `dev_code`. Pada production, response tidak boleh mengandung `dev_code`; `delivered: true` hanya dikembalikan setelah provider memberi response sukses.

Verifikasi dengan kode yang diterima pada local/staging atau inbox production.

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H 'content-type: application/json' \
  -d '{"channel":"email","email":"alamat-uji@example.com","code":"123456","role":"buyer","district":"Kendari"}'
```

Checklist minimum mencakup expiry lima menit, kode salah lima kali, penggunaan ulang, rate limit, provider timeout, provider belum dikonfigurasi, alamat email tidak valid, dan database unavailable. Pastikan migration `004_email_otp.sql` dan `005_auth_channels_google.sql` telah dijalankan sebelum channel email diaktifkan pada production.
