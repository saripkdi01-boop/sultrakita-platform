# Deployment Instructions — Support System

## Database

Buka Supabase Dashboard untuk project `ibvcfdfsjpytwpnxgylm`, masuk ke SQL Editor, dan jalankan isi `supabase/migrations/20260908000000_support_system.sql`. Verifikasi bahwa tabel `help_articles`, `support_tickets`, `security_logs`, `trusted_devices`, dan `legal_documents` sudah terbentuk. Alternatifnya, gunakan pipeline Supabase CLI yang dipakai project.

## Seed artikel

Set environment `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` hanya pada mesin/CI yang aman, kemudian jalankan:

```bash
npm run seed:help
```

## Build dan deployment

```bash
cd next-app
npm run build
cd ..
git add .
git commit -m "fix: support system integration"
git push origin main
```

Vercel akan melakukan deployment otomatis. Setelah deployment READY, verifikasi `/security-center`, `/help-center`, `/support`, `/legal/terms`, dan `/admin/support-tickets`.

## n8n

Import `automation/n8n/15_support_ticket_auto_response.json` dan `automation/n8n/16_support_ticket_status_update.json`. Isi credential Supabase/Resend, test webhook dengan data non-produksi, lalu aktifkan workflow hanya setelah endpoint dan kebijakan notifikasi diverifikasi.
