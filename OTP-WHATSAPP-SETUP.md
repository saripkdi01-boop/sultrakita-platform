# OTP WhatsApp SultraKita

## Alur yang telah diimplementasikan

Pengguna memasukkan nomor Indonesia dengan format `08xxxxxxxxxx`. Server memvalidasi format, membuat OTP enam digit menggunakan `crypto.randomInt`, menyimpan hanya hash SHA-256 ke `otp_challenges`, memberi masa berlaku lima menit, menghapus challenge lama untuk nomor yang sama, dan membatasi percobaan verifikasi maksimal lima kali. Verifikasi memakai perbandingan timing-safe, menandai challenge terpakai, lalu menerbitkan session token yang disimpan dalam bentuk hash.

Pada production, pengiriman diprioritaskan melalui WhatsApp Cloud API menggunakan template pesan yang telah disetujui Meta. Jika `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, dan `WHATSAPP_OTP_TEMPLATE_NAME` belum lengkap, endpoint menolak dengan error terukur dan tidak pernah mengembalikan kode OTP. `OTP_DEV_MODE=true` hanya boleh digunakan lokal/staging; pada mode itu kode dikembalikan sebagai `dev_code` untuk pengujian.

## Konfigurasi Meta

Buat atau gunakan WhatsApp Business Platform Cloud API, verifikasi nomor pengirim, dan buat message template kategori Authentication dengan satu placeholder body untuk OTP. Contoh isi template: `Kode verifikasi SultraKita Anda adalah {{1}}. Kode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.` Setelah template berstatus approved, masukkan nama template persis seperti di Meta ke `WHATSAPP_OTP_TEMPLATE_NAME`.

Isi environment berikut pada deployment secret manager, bukan pada repository:

```dotenv
WHATSAPP_API_VERSION=v23.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_OTP_TEMPLATE_NAME=sultrakita_otp
WHATSAPP_OTP_TEMPLATE_LANGUAGE=id
OTP_DEV_MODE=false
```

Alternatif provider yang kompatibel dapat digunakan melalui `OTP_PROVIDER_URL` dan `OTP_PROVIDER_TOKEN`, tetapi payload yang dikirim adalah `{ phone, code, channel: "whatsapp" }`. Provider harus menerima nomor internasional tanpa tanda plus, misalnya `6281234567890`.

## Pengujian

Uji lokal yang aman dapat dilakukan dengan `OTP_DEV_MODE=true` dan database staging, lalu pastikan response mengandung `channel: "whatsapp"`, `delivered: false`, dan `dev_code`. Untuk production, `OTP_DEV_MODE` harus `false`, response tidak boleh memiliki `dev_code`, dan kode hanya boleh diterima dari pesan WhatsApp. Uji juga expiry lima menit, kode salah sampai percobaan kelima, kode terpakai ulang, rate limit request/verify, nomor tidak valid, serta provider timeout.

Jangan mencatat OTP, access token, isi pesan sensitif, atau nomor telepon lengkap ke log. Dashboard provider Meta perlu dipantau untuk delivery failure dan template quality. Deep-link `wa.me` pada listing adalah fitur chat gratis yang berbeda dari pengiriman OTP resmi; OTP memerlukan template WhatsApp Business yang disetujui.
