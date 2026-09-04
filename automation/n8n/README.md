# SultraKita n8n Automation

Direktori ini berisi template workflow n8n yang dapat di-import ke instance n8n staging atau production. Template sengaja tidak menyimpan credential, token, API key, atau webhook secret.

## Workflow

| File | Tujuan | Trigger |
|---|---|---|
| `workflows/01-user-registration-otp.json` | Validasi request OTP, persist challenge melalui Express, kirim ke provider WhatsApp/SMS, simpan delivery status | Webhook POST |
| `workflows/02-listing-media-processing.json` | Claim event media, verifikasi object R2, panggil media processor, dan update status listing | Webhook POST |
| `workflows/03-seller-verification-admin-notification.json` | Claim verification, membuat review link singkat, mengirim notifikasi admin, dan menyimpan status | Webhook POST |
| `workflows/04-new-listing-moderation-notification.json` | Claim listing baru secara idempotent, mengubah status menjadi menunggu review, dan memberi tahu moderator | Webhook POST |

## Contoh alur listing baru

Workflow `04-new-listing-moderation-notification.json` menggunakan urutan berikut:

```text
Webhook listing.created
  → Code: validasi event_id, listing_id, seller_id, title, dan status
  → Express: claim idempotency event
  → IF: duplicate → safe no-op
  → Express: set workflow_status = AWAITING_REVIEW
  → Telegram: notify moderator
  → Express: simpan notification status
  → Respond: 202 Accepted
```

Workflow tidak otomatis mengubah listing menjadi `ACTIVE`. Persetujuan tetap harus dilakukan oleh moderator melalui jalur admin yang terautorisasi.

## Import

1. Import masing-masing JSON melalui menu **Workflows → Import from File**.
2. Pastikan workflow masih **inactive** setelah import.
3. Buat credential staging untuk Header Auth webhook, internal API header, provider WhatsApp/SMS, dan Telegram.
4. Set environment variable n8n berikut pada instance n8n:

```env
SULTRAKITA_API_BASE_URL=https://sultrakita-platform.vercel.app
R2_PUBLIC_BASE_URL=https://assets.sultrakita.com
R2_BUCKET_NAME=sultrakita-assets
OTP_DEV_MODE=false
OTP_PROVIDER_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
```

5. Konfigurasikan `SULTRAKITA_API_BASE_URL` ke backend Express yang benar. Jika Vercel masih menyajikan root Express, gunakan domain root tersebut; jangan menunjuk ke `next-app` kecuali Next.js sudah menjadi deployment yang aktif.
6. Aktifkan workflow hanya setelah test URL berhasil, production webhook URL telah dicatat, dan smoke test staging lulus.

## Credential policy

Credential disimpan pada credential store n8n, bukan pada JSON workflow atau repository. Gunakan credential berbeda untuk staging dan production. R2 secret hanya dipakai oleh Express/media service; workflow tidak boleh meneruskan secret tersebut ke browser.

## Webhook verification

Webhook n8n wajib menggunakan Header Auth atau JWT Auth. Untuk request dari Express, tambahkan HMAC signature pada body raw dengan timestamp dan `event_id`. Reject request yang timestamp-nya lebih tua dari lima menit atau `event_id` yang sudah sukses.

## File upload policy

Browser tidak mengirim multipart binary besar ke n8n. Express membuat presigned PUT URL R2, browser mengunggah langsung ke R2, lalu Express mengirim event `{ event_id, object_key, listing_id, content_type, byte_size }` ke workflow. Pola ini menghindari batas payload webhook dan mengurangi beban instance n8n.

## Failure handling

Semua workflow harus memiliki error workflow global. Error path wajib memperbarui `workflow_events` atau tabel status yang relevan, menambah `attempt_count`, menyimpan `n8n_execution_id`, dan memindahkan event ke `DEAD_LETTER` setelah batas retry. Jangan mengaktifkan **Continue On Fail** tanpa node berikutnya yang memeriksa error.

## Deployment note

Template ini dapat di-import ke instance n8n setelah konektor terotorisasi. Import ke staging terlebih dahulu, lakukan smoke test, dan biarkan workflow inactive sampai credential, endpoint internal, signature, dan failure path tervalidasi.
