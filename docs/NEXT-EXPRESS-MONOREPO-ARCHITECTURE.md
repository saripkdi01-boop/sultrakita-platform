# Arsitektur Next.js dan Express.js dalam Satu Monorepo

## Prinsip utama

SultraKita menggunakan **Next.js sebagai web client** dan **Express.js sebagai API service**. Keduanya berada dalam satu repository, tetapi memiliki tanggung jawab yang berbeda. Next.js mengelola halaman, SEO, UI, dan pengalaman pengguna. Express.js menjadi batas server untuk autentikasi, database PostgreSQL, pembayaran, webhook, upload R2, rate limiting, dan endpoint yang juga dapat dipakai aplikasi mobile.

Pemisahan ini tidak berarti kedua aplikasi harus memiliki dua database atau dua kontrak berbeda. Kontrak API Express menjadi sumber kebenaran untuk operasi bisnis, sedangkan Next.js hanya memanggil endpoint tersebut melalui HTTP.

## Contoh struktur folder ideal

```text
sultrakita-platform/
├── apps/
│   ├── web/                         # Next.js App Router
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── dashboard/
│   │   │   ├── api/                 # Hanya BFF ringan bila benar-benar diperlukan
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── api/client.ts       # HTTP client menuju Express
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── api/                         # Express.js service
│       ├── src/
│       │   ├── app.js               # Express app tanpa listen, mudah dites
│       │   ├── server.js            # Entrypoint production
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── donations.service.js
│       │   │   ├── storage.service.js
│       │   │   └── notifications.service.js
│       │   ├── middleware/
│       │   ├── db/
│       │   └── config/
│       ├── test/
│       ├── package.json
│       └── .env.example
│
├── packages/
│   ├── api-contracts/                # Zod/OpenAPI types yang aman dibagi
│   ├── eslint-config/
│   ├── tsconfig/
│   └── ui/                           # Komponen UI bersama jika dibutuhkan
│
├── supabase/
│   ├── migrations/
│   └── schema.sql
├── scripts/
├── docs/
├── package.json                      # Workspace scripts
├── pnpm-workspace.yaml
└── turbo.json                        # Opsional, bila build membesar
```

Dalam migrasi bertahap dari repository saat ini, `next-app/` dapat dipertahankan sebagai `apps/web/` dan kode root Express secara bertahap dipindahkan ke `apps/api/`. Jangan menghapus `server.js` sebelum seluruh endpoint dan pengujian telah dipindahkan.

## Cara koneksi Next.js ke Express

Alur request yang direkomendasikan adalah:

```text
Browser
  │
  │  Next.js UI: postToApi('/api/donations', payload)
  ▼
Next.js web deployment
  │
  │  HTTPS + credentials: include
  ▼
Express API deployment
  │
  ├── validasi request
  ├── autentikasi/session
  ├── business service
  ├── PostgreSQL/Supabase
  ├── payment provider
  └── Cloudflare R2
```

Implementasi yang sekarang telah ditambahkan berada pada `next-app/lib/api/client.ts`. Komponen UI tidak lagi membuat request HTTP sendiri-sendiri. Mereka menggunakan helper bersama yang melakukan tiga hal penting: menggabungkan `NEXT_PUBLIC_API_BASE_URL` dengan path endpoint, meneruskan cookie untuk session ketika konfigurasi origin mengizinkan, dan mengubah response error Express menjadi `Error` yang dapat ditampilkan UI.

Contoh pemanggilan:

```ts
import { postToApi } from '@/lib/api/client';

await postToApi('/api/suggestions', {
  name,
  email,
  body: `Minat kemitraan dari organisasi: ${organization}`,
});
```

Untuk production, gunakan:

```env
NEXT_PUBLIC_API_BASE_URL=https://sultrakita-platform.vercel.app
```

Untuk local development, Next.js dapat menggunakan URL absolut ke server Express lokal:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Alternatif lain adalah reverse proxy melalui domain yang sama. Dalam pola tersebut, browser memanggil `/api/*`, lalu proxy meneruskan request ke Express. Pola ini mengurangi masalah CORS dan cookie lintas-origin, tetapi routing proxy harus diuji dengan hati-hati agar webhook dan endpoint admin tidak ikut terbuka secara tidak sengaja.

## Konfigurasi CORS dan cookie

Jika Next.js dan Express berada pada origin berbeda, Express harus mengizinkan origin web secara eksplisit, bukan menggunakan wildcard.

```env
CORS_ORIGINS=https://web.sultrakita.com,http://localhost:3000
```

Request frontend menggunakan `credentials: 'include'`. Artinya, cookie session hanya akan dikirim jika atribut cookie, HTTPS, SameSite, domain, dan CORS telah dikonfigurasi secara konsisten. Jangan menaruh token database, service-role key, R2 secret, atau payment server key dalam variabel `NEXT_PUBLIC_*`.

## Kontrak endpoint

| Fitur | Method | Path | Pemilik logika |
|---|---:|---|---|
| Donasi | POST | `/api/donations` | Express + PostgreSQL + payment provider |
| Saran kemitraan | POST | `/api/suggestions` | Express + PostgreSQL |
| Daftar listing | GET | `/api/listings` | Express + PostgreSQL |
| Favorit | POST | `/api/favorites` | Express + session authorization |
| Webhook pembayaran | POST | `/api/donation/webhook` | Express only |

Webhook, secret-bearing operation, dan operasi admin harus tetap berada di Express. Next.js boleh menyediakan UI untuk operasi tersebut, tetapi browser tidak boleh mengetahui credential provider atau service-role key.

## Strategi deployment

Tahap pertama yang aman adalah dua project Vercel yang terhubung ke satu repository: project API menggunakan root/konfigurasi Express yang sudah berjalan, sedangkan project web menggunakan Root Directory `next-app`. Keduanya deploy otomatis dari branch yang sama, tetapi memiliki environment variable dan log runtime masing-masing.

Tahap berikutnya dapat menambahkan preview deployment untuk kedua aplikasi, contract tests yang menjalankan request dari Next.js menuju API preview, serta smoke test terhadap endpoint read-only. Konsolidasi menjadi satu deployment Next.js hanya layak dilakukan setelah semua endpoint Express, webhook, worker, dan pengujian memiliki pengganti yang setara.

## Checklist implementasi

- [x] Helper HTTP bersama untuk Next.js.
- [x] Modal donasi memakai `POST /api/donations`.
- [x] Modal kemitraan memakai `POST /api/suggestions`.
- [x] API base URL terdokumentasi.
- [ ] Vercel Preview dan Production memiliki environment variable yang benar.
- [ ] Origin Next.js ditambahkan ke `CORS_ORIGINS` Express bila berbeda domain.
- [ ] Cookie/session lintas-origin diuji pada HTTPS.
- [ ] Contract test frontend-to-API dijalankan pada CI.
- [ ] Deployment API dan web dipantau secara terpisah.
