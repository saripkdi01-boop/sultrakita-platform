# SultraKita Biggest Update — Marketplace Foundation

## Ringkasan

Rilis ini menerjemahkan prioritas prompt referensi menjadi foundation marketplace end-to-end yang nyata: dashboard akun, profil, alamat, keranjang, checkout, estimasi logistik, tawar-menawar, notifikasi, dan review. Seluruh mutation baru mewajibkan session Bearer dan query yang menyangkut kepemilikan membatasi akses berdasarkan user yang sedang login.

## Kontrak API

| Area | Endpoint | Status |
|---|---|---|
| Akun | `GET /api/me`, `PATCH /api/me` | Aktif |
| Alamat | `GET/POST /api/me/addresses` | Aktif |
| Keranjang | `GET /api/cart`, `POST /api/cart/items`, `PATCH/DELETE /api/cart/items/:id` | Aktif |
| Checkout | `POST /api/checkout`, `GET /api/orders`, `GET /api/orders/:id` | Aktif; pembayaran provider masih pending/manual |
| Logistik | `POST /api/shipping/quotes` | Aktif sebagai estimasi; belum booking provider |
| Negosiasi | `POST /api/offers`, `PATCH /api/offers/:id` | Aktif |
| Notifikasi | `GET /api/notifications`, `POST /api/notifications/:id/read` | Aktif |
| Review | `POST /api/orders/:id/reviews` | Aktif setelah order delivered/completed |

## Database

Migration `database/migrations/002_marketplace_upgrade.sql` menambahkan kolom profil dan tabel `user_addresses`, `carts`, `cart_items`, `orders`, `order_items`, `shipping_quotes`, `shipments`, `offers`, `reviews`, serta `notifications`. Migration sudah diterapkan ke project Supabase production `ibvcfdfsjpytwpnxgylm` dan schema fallback SQLite telah diselaraskan untuk test lokal.

## Logistik dan pembayaran

JNE, J&T, dan GoSend disediakan melalui adapter estimasi dengan penanda `is_estimate: true`. Nilai tersebut tidak boleh dianggap sebagai booking, label, resi, atau tracking resmi. Aktivasi booking dan tracking harus menunggu kredensial API resmi, kontrak endpoint provider, webhook/callback, retry, idempotency, dan owner operasional. Checkout saat ini membuat order dan menahan status escrow secara internal, tetapi provider pembayaran belum diaktifkan; jangan mengiklankan escrow atau pembayaran QRIS sebagai settlement nyata sebelum integrasi provider diselesaikan.

## Deployment dan sinkronisasi

Source of truth adalah repository GitHub canonical `saripkdi01-boop/sultrakita-platform` pada branch `main`. Vercel terhubung ke repository tersebut dan menggunakan environment variables `DATABASE_URL`, `DATABASE_SSL=true`, dan `DATABASE_POOL_MAX=5`. Setiap perubahan database wajib memiliki migration yang committed, diterapkan ke Supabase, lalu diuji melalui deployment Vercel.

## Quality gate

Perintah yang digunakan: `npm run lint`, `npm test`, `npm run build`, dan `npm run test:security`. Regression suite mencakup enam test dan seluruhnya lulus setelah upgrade. Endpoint live `/api/health` digunakan sebagai smoke test deployment.

## Rollback

Rollback kode dilakukan melalui revert commit di branch `main` dan redeploy Vercel. Rollback database tidak boleh menghapus tabel atau data tanpa backup; gunakan migration korektif yang idempoten. Sebelum migration destruktif pada masa depan, buat backup PostgreSQL dan lakukan uji di branch database Supabase.
