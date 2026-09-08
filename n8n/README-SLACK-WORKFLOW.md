# Workflow SultraKita → Slack

Workflow ini mengambil event `QUEUED` dari `public.workflow_events` Supabase setiap menit, mengklaim event secara conditional, mengirim ringkasan ke Slack Incoming Webhook, lalu menandai event sebagai `SUCCEEDED`.

## Mengapa Slack cukup untuk MVP?

Slack cukup untuk **operasional internal**: notifikasi seller verification baru, moderation, kegagalan pemrosesan media, dan error backend. Slack belum cukup sebagai kanal pengguna akhir. Notifikasi kepada seller/buyer tetap sebaiknya memakai kanal yang sudah disiapkan SultraKita, seperti WhatsApp atau email, melalui `notification_outbox`.

## Cara memasang

1. Import `sultrakita-slack-workflow.json` dari menu **Workflows → Import from File** di n8n.
2. Set environment variables pada instance n8n:
   - `SUPABASE_URL=https://ibvcfdfsjpytwpnxgylm.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<service-role-key Supabase>`
   - `SLACK_WEBHOOK_URL=<Incoming Webhook URL channel admin>`
3. Jalankan workflow manual sekali untuk smoke test.
4. Pastikan pesan masuk ke channel Slack admin.
5. Aktifkan workflow setelah smoke test berhasil.

Jangan memakai anon/publishable key untuk membaca dan mengubah outbox karena tabel orchestration memang dibatasi untuk akses server-side. Jangan menaruh service-role key di frontend atau repositori.

## Kontrak event yang digunakan

Workflow memakai tabel `public.workflow_events` yang telah diverifikasi pada project `sultrakita-platform`, dengan status:

`QUEUED → PROCESSING → SUCCEEDED`

Jika Slack gagal, execution n8n akan gagal dan event akan tetap `PROCESSING`. Untuk produksi, tambahkan error branch yang mengubah event menjadi `FAILED`, mengisi `last_error_code`/`last_error_message`, dan menerapkan retry/backoff sebelum `DEAD_LETTER`.

## Event yang sebaiknya diproduksi aplikasi

Prioritaskan event berikut:

- seller verification baru;
- listing moderation baru atau berubah ke rejected;
- listing media processing failed;
- import katalog/jobs gagal;
- error webhook pembayaran atau WhatsApp;
- anomali signup/OTP/security yang membutuhkan review admin.

Hindari mengirim setiap `page_view`, pesan chat biasa, atau data pribadi lengkap ke Slack. Payload sebaiknya berisi ID, tipe event, status, district, dan ringkasan tanpa dokumen KTP, OTP, token, atau nomor telepon penuh.

## Catatan keamanan dan reliabilitas

Workflow memakai polling satu menit karena tabel `workflow_events` sudah menjadi outbox kanonik dan belum ada webhook Supabase yang dikonfigurasi untuk n8n. Query `PATCH ...&status=eq.QUEUED` berfungsi sebagai claim conditional sederhana sehingga dua eksekusi paralel tidak semestinya mengirim event yang sama. Tetap batasi concurrency workflow menjadi satu jika instance n8n sering overlap.
