# Telegram Governance dan Aulaa Payments

## Status implementasi

SultraKita sekarang memiliki jalur server-side untuk provider Aulaa dan bot Telegram admin. Fitur ini tidak mengambil alih akun Telegram pengguna, tidak meminta password, dan tidak menaruh token pada frontend.

## Aulaa

Dokumentasi Aulaa yang diberikan mendefinisikan REST API pada `https://api.aulaa.co/v1`, autentikasi Bearer menggunakan API key project, pembuatan pembayaran melalui `POST /payments`, payment link hosted pada `https://payment.aulaa.co/pay/{ID}`, dan webhook flat dengan header `X-Webhook-Signature`. SultraKita mengaktifkan provider melalui `PAYMENT_PROVIDER=aulaa`.

Alur donasi adalah sebagai berikut. SultraKita membuat row donasi berstatus pending dengan `transaction_id` internal, lalu backend membuat payment Aulaa dengan `order_id` yang sama. Pengguna dialihkan ke payment link Aulaa. Ketika Aulaa mengirim webhook, server menghitung HMAC-SHA256 dari raw body menggunakan `AULAA_WEBHOOK_SECRET`, membandingkan `order_id` dan nominal, lalu mengubah donasi menjadi success secara idempoten.

Webhook Aulaa harus diarahkan ke:

```text
https://sultrakita-platform.vercel.app/api/donation/webhook/aulaa
```

Environment server yang diperlukan:

```text
PAYMENT_PROVIDER=aulaa
AULAA_API_BASE=https://api.aulaa.co/v1
AULAA_API_KEY=<secret project Aulaa>
AULAA_WEBHOOK_SECRET=<secret webhook project Aulaa>
AULAA_VA_METHOD=bca_va
```

Gunakan mode Sandbox Aulaa terlebih dahulu. Aktifkan Live hanya setelah KYC, callback, dan pengujian webhook selesai. Nilai `AULAA_API_KEY` dan `AULAA_WEBHOOK_SECRET` hanya disimpan pada Vercel Environment Variables.

Refund Aulaa sengaja tidak dijalankan otomatis dari SultraKita karena dokumentasi yang diperiksa hanya menyediakan create, status, dan cancel. Refund dilakukan dari dashboard Aulaa sampai endpoint refund resmi dan kontraknya diverifikasi.

## Telegram admin bot

Telegram Bot API mendukung outgoing webhook melalui `setWebhook` dan mengirim header `X-Telegram-Bot-Api-Secret-Token` bila `secret_token` dikonfigurasi. SultraKita memverifikasi header ini, lalu membatasi perintah pada chat admin dan, bila diisi, Telegram user ID admin.

Endpoint webhook:

```text
https://sultrakita-platform.vercel.app/api/telegram/webhook
```

Endpoint pengaturan webhook yang dipanggil dari dashboard admin:

```text
POST /api/admin/telegram/set-webhook
```

Environment server:

```text
TELEGRAM_BOT_TOKEN=<secret dari BotFather>
TELEGRAM_ADMIN_CHAT_ID=<chat id privat/grup admin>
TELEGRAM_ADMIN_USER_ID=<opsional, user id admin>
TELEGRAM_WEBHOOK_SECRET=<secret acak 1-256 karakter>
```

Perintah yang tersedia adalah `/overview`, `/status SK-...`, `/donasi`, `/verifikasi`, `/setujui ID`, `/laporan`, `/selesaikan-laporan ID`, dan `/webhook`. Hanya chat yang cocok dengan `TELEGRAM_ADMIN_CHAT_ID` dan user ID yang diizinkan yang dapat menjalankan perintah. Update Telegram dideduplikasi berdasarkan `update_id` dan dicatat pada `telegram_admin_audit`.

Notifikasi pembayaran sukses Aulaa dikirim ke `TELEGRAM_ADMIN_CHAT_ID` bila bot telah dikonfigurasi. Kegagalan Telegram tidak membatalkan atau membalikkan status pembayaran yang telah diverifikasi; status pembayaran tetap ditentukan oleh webhook Aulaa.

## Aktivasi aman

1. Buat bot menggunakan BotFather dan simpan token hanya pada Vercel.
2. Tambahkan seluruh environment Telegram dan Aulaa pada Production, lalu redeploy.
3. Jalankan `npm run db:migrate` terhadap database production agar migration `011_telegram_admin_audit.sql` tercatat.
4. Set callback Aulaa ke endpoint di atas melalui dashboard Aulaa.
5. Masuk ke `/admin.html`, lalu panggil tombol/endpoint set webhook Telegram menggunakan session bearer dan admin token.
6. Uji transaksi Aulaa Sandbox dengan nominal yang sesuai, validasi webhook success dan retry, lalu periksa `/donasi` dan `/status` pada Telegram.
7. Setelah hasil sandbox benar, lakukan review dan aktivasi Live pada Aulaa.

### References

[1]: https://aulaa.co/dokumentasi "Dokumentasi API Aulaa"
[2]: https://core.telegram.org/bots/api "Telegram Bot API"
