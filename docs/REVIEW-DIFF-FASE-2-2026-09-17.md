# Review Diff Fase 2 — Feed Interactions Suki Apps

**Tanggal:** 17 September 2026  
**Status review:** Lulus dengan catatan staging  
**Mode:** review source dan migration; tidak ada perubahan database atau deployment

## 1. Kesimpulan

Diff Fase 2 secara umum sudah aman untuk dilanjutkan ke **review migration pada staging**, tetapi belum siap diterapkan ke production. Implementasi telah memiliki session check, CSRF validation, RLS additive, idempotency key, validasi komentar, dan regression test.

Dua temuan yang ditemukan saat review telah diperbaiki:

1. Policy baca komentar lama masih terlalu publik dan tidak memeriksa status/privasi post.
2. Cursor komentar hanya menggunakan `created_at`, sehingga row dengan timestamp sama berisiko terlewati atau terduplikasi.

## 2. Perbaikan yang diterapkan saat review

### 2.1 RLS komentar

Migration sekarang mengganti `comments_public_read` dengan policy yang mensyaratkan post terkait:

- berstatus `published`; dan
- memiliki privacy `public`, atau merupakan post milik user yang sedang login.

Policy insert komentar juga memeriksa post published dan visibility yang sama. Policy update/delete tetap dibatasi kepada pemilik komentar.

**Catatan:** aturan follower-only masih bersifat konservatif. Follower graph belum dipakai untuk membuka komentar kepada follower. Ini mencegah kebocoran, tetapi perlu disempurnakan setelah relasi follow dan policy-nya siap.

### 2.2 Cursor komentar

Route `GET /api/comments` sekarang meng-encode cursor berisi:

```text
version + createdAt + id
```

Query memakai kondisi:

```text
created_at > cursor.createdAt
OR (created_at = cursor.createdAt AND id > cursor.id)
```

Perubahan ini konsisten dengan pagination feed utama.

## 3. Pemeriksaan keamanan dan correctness

| Area | Hasil review |
|---|---|
| Session | Semua mutation memanggil `auth.getUser()` server-side |
| CSRF | POST/DELETE interaction dan comment memerlukan header-cookie match |
| Save visibility | User hanya dapat membaca, membuat, dan menghapus save miliknya |
| Share visibility | User hanya dapat membaca share miliknya; insert dibatasi ke user aktif |
| Like idempotency | Unique key `(post_id, user_id)` tetap digunakan |
| Save idempotency | Upsert dengan conflict `(post_id, user_id)` |
| Share idempotency | Unique `(post_id, user_id, idempotency_key)` |
| Comment idempotency | Unique partial index pada `(post_id, user_id, idempotency_key)` |
| Comment validation | Trim, normalisasi whitespace, panjang maksimum 1.000 karakter |
| Rate limiting | Route interaction memiliki rate limit memory-based per IP |
| Error leakage | Error database tidak dikembalikan mentah ke client |
| Pagination | Feed dan komentar memakai timestamp plus ID |
| Source of truth | Save tidak lagi memakai localStorage |

## 4. Regression verification

| Pemeriksaan | Hasil |
|---|---|
| Fase 1 + Fase 2 contract test | 8/8 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| `git diff --check` | Lulus |

Tidak ada perubahan pada `package.json`, lockfile, atau `vercel.json`.

## 5. Risiko yang masih terbuka

### 5.1 Viewer state belum diambil dari server

Kontrak feed sudah menyediakan `viewer.saved` dan `viewer.liked`, tetapi query feed belum mengisi status tersebut dari database. Saat ini FeedPost menginisialisasi status simpan sebagai `false` dan tidak lagi memakai localStorage. Akibatnya, save yang sudah ada dapat terlihat belum tersimpan setelah reload sampai query viewer state ditambahkan.

**Tindakan Fase berikutnya:** tambahkan query viewer state untuk user authenticated dan aggregate terkontrol untuk likes/comments/shares/saves.

### 5.2 Migration belum diuji terhadap schema remote

Migration belum dijalankan pada staging. Nama tabel, grants, publication, dan migration history remote harus dibandingkan terlebih dahulu.

### 5.3 Share intent dan share success

Native share dicatat setelah `navigator.share()` berhasil. Clipboard dan WhatsApp dicatat setelah tindakan client dimulai. Ini cukup untuk event awal, tetapi metrik share tetap perlu dibedakan antara intent, keberhasilan membuka channel, dan pembatalan user.

### 5.4 Cursor komentar belum memakai HMAC

Cursor komentar menggunakan base64url tanpa signature. Cursor hanya memengaruhi posisi baca dan tidak membuka data privat, tetapi untuk konsistensi keamanan dapat ditandatangani pada hardening berikutnya.

### 5.5 Rate limit memory-based

Rate limit route interaction tersimpan di memory instance. Pada deployment serverless, pembatasan ini tidak global antar instance. Untuk production traffic yang lebih besar, perlu rate limit terdistribusi atau kontrol Supabase/edge yang sesuai.

## 6. Keputusan review

**Keputusan:** Fase 2 source code dapat diteruskan ke staging migration review, dengan dua syarat:

1. jangan menjalankan migration production;
2. tambahkan viewer state dan aggregate query sebelum menganggap Feed Suki selesai secara product-level.

Langkah aman berikutnya:

> **Jalankan audit migration remote dan siapkan test RLS staging.**

Bukan:

> menerapkan migration langsung ke production.

## References

[1]: ./FASE-2-IMPLEMENTATION-INTERACTIONS-2026-09-17.md "Laporan Audit Deployment dan Implementasi Fase 2"

[2]: ./FASE-1-IMPLEMENTATION-FEED-CONTRACT-2026-09-17.md "Laporan Implementasi Fase 1 — Kontrak Data Feed Suki Apps"

[3]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security Documentation"

[4]: https://supabase.com/docs/guides/database/postgres/column-level-security "Supabase Database Security Documentation"

**Penulis:** Manus AI
