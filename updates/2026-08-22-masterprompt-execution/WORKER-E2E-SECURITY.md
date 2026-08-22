# Worker Mutation Parity dan E2E Security Regression

## Endpoint parity

Cloudflare Worker sekarang memiliki authenticated mutation boundary untuk listing update/delete, favorites create/delete, comments create/read, reports create, conversation create, serta message read/write. Semua route mengambil user dari `Authorization: Bearer`, mencocokkan token hash dengan tabel `sessions`, memeriksa expiry, dan tidak mempercayai `user_id`, `buyer_id`, `seller_id`, atau `sender_id` yang tidak sesuai session.

Listing update/archive dibatasi kepada `seller_id` pemilik atau admin. Favorite mutation dibatasi kepada session user. Comment dan report menyimpan actor dari session. Conversation creation memastikan buyer berasal dari session dan seller sesuai listing. Message read/write memastikan user adalah buyer/seller conversation; sender selalu berasal dari session.

## E2E test script

File: `scripts/worker-security-e2e.js`

Safe production mode:

```bash
BASE_URL='https://sultrakita.aplikasi-cerdasku.workers.dev' \
npm run test:worker-security
```

Mode ini tidak membuat OTP, listing, favorite, comment, report, conversation, atau message. Mode ini hanya menguji public contract, invalid identifier, admin boundary, anonymous mutation denial, logout tanpa session, dan disclosure checks.

Full mutation mode hanya untuk staging atau local Worker dengan isolated database:

```bash
BASE_URL='https://staging-worker.example.workers.dev' \
WORKER_E2E_TARGET=staging \
WORKER_E2E_ALLOW_MUTATION=true \
npm run test:worker-security
```

Target staging harus mengaktifkan `OTP_DEV_MODE` hanya pada environment terisolasi dan tidak boleh memakai database production. Script menolak mutation suite pada HTTPS tanpa `WORKER_E2E_TARGET` sebagai safety guard.

## Verification policy

A production-safe pass tidak sama dengan full mutation pass. Release P0 hanya dapat ditandai lengkap bila safe suite production lulus dan mutation suite staging lulus. CI wajib menjalankan syntax check untuk script, sedangkan mutation suite dijalankan terhadap staging dengan secret/environment khusus dan database disposable.

## Current deployment checkpoint

Worker version terakhir yang diuji adalah `6941f470-b319-4d91-bbff-1c03f4c96b28`. Setelah parity mutation patch berikutnya, deploy version baru harus dicatat di sini bersama hasil safe production suite dan hasil full staging suite.
