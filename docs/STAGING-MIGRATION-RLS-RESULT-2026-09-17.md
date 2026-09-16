# Hasil Migration Fase 2 dan RLS Staging — Suki Apps

**Tanggal:** 17 September 2026  
**Project:** `sultrakita-platform`  
**Project ref:** `ibvcfdfsjpytwpnxgylm`  
**Status:** Migration staging berhasil; write matrix menunggu dua akun test staging

## 1. Migration berhasil diterapkan

Migration diterapkan menggunakan Supabase MCP dengan nama:

```text
feed_interactions_v1
```

Remote migration history sekarang mencatat:

```text
20260916203116 — feed_interactions_v1
```

Migration dijalankan hanya pada project yang telah dikonfirmasi sebagai staging. Tidak ada migration production yang dijalankan.

## 2. Schema staging terverifikasi

### `post_comments`

Kolom baru terverifikasi:

```text
idempotency_key text nullable
```

### `saved_posts`

Tabel terverifikasi dengan kolom:

- `post_id uuid`;
- `user_id uuid`;
- `created_at timestamptz`.

Primary key `(post_id, user_id)` aktif.

### `post_shares`

Tabel terverifikasi dengan kolom:

- `id uuid`;
- `post_id uuid`;
- `user_id uuid`;
- `channel text`;
- `idempotency_key text`;
- `created_at timestamptz`.

Unique constraint `(post_id, user_id, idempotency_key)` aktif.

## 3. Policy RLS terverifikasi

### `post_comments`

Aktif:

- `post_comments_public_read`;
- `post_comments_owner_read`;
- `post_comments_owner_insert`;
- `post_comments_owner_update`;
- `post_comments_owner_delete`.

Public read mensyaratkan komentar `visible` dan post `published`, dengan privacy `public` atau post milik user aktif.

### `saved_posts`

Aktif:

- `saved_posts_select_own`;
- `saved_posts_insert_own`;
- `saved_posts_delete_own`.

### `post_shares`

Aktif:

- `post_shares_select_own`;
- `post_shares_insert_own`.

## 4. Index terverifikasi

Index penting yang sudah ada:

- `post_comments_user_idempotency_idx`;
- `post_comments_post_created_idx`;
- `saved_posts_pkey`;
- `saved_posts_user_created_idx`;
- `post_shares_post_created_idx`;
- unique index `post_shares_post_id_user_id_idempotency_key_key`.

## 5. Source alignment setelah staging audit

Pemeriksaan remote menemukan bahwa `post_comments` tidak memiliki foreign key langsung ke `profiles`. Karena itu API komentar diperbaiki agar tidak memakai embedded relation:

```text
profiles(display_name,username,avatar_url)
```

API sekarang memilih field komentar inti saja:

```text
id, post_id, user_id, content, status, created_at
```

Dengan demikian route tidak bergantung pada relationship PostgREST yang tidak tersedia.

## 6. Verifikasi source

| Pemeriksaan | Hasil |
|---|---|
| Contract test Fase 1 + Fase 2 | 8/8 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| `git diff --check` | Lulus |
| Source target komentar | `post_comments` |
| Migration target | `post_comments`, `saved_posts`, `post_shares` |

## 7. Write matrix RLS

Script tersedia di:

```text
scripts/test-supabase-feed-rls.js
```

Write matrix **belum dijalankan** karena environment sandbox tidak memiliki anon key dan belum ada dua kredensial akun test staging yang dikonfigurasi. Tidak ada secret yang diminta atau ditulis ke repository.

Perintah untuk pemilik project ketika dua akun test staging tersedia:

```bash
SUPABASE_TEST_ALLOW_WRITES=true \
SUPABASE_URL=https://<staging-ref>.supabase.co \
SUPABASE_ANON_KEY=<staging-anon-key> \
SUPABASE_TEST_OWNER_EMAIL=<owner-test-email> \
SUPABASE_TEST_OWNER_PASSWORD=<owner-test-password> \
SUPABASE_TEST_MEMBER_EMAIL=<member-test-email> \
SUPABASE_TEST_MEMBER_PASSWORD=<member-test-password> \
node scripts/test-supabase-feed-rls.js --write
```

Jalankan perintah tersebut hanya terhadap staging.

## 8. Status release

| Area | Status |
|---|---|
| Migration staging | **Berhasil** |
| Schema verification | **Berhasil** |
| Policy verification | **Berhasil** |
| Index verification | **Berhasil** |
| Static source tests | **Berhasil** |
| Anonymous/authenticated HTTP preflight | Tertunda anon key |
| Two-user write RLS matrix | Tertunda akun test |
| Production migration | **Belum dijalankan** |
| Production deployment | **Belum dijalankan** |

## 9. Langkah berikutnya

1. Sediakan dua akun test khusus staging.
2. Jalankan write matrix RLS.
3. Verifikasi fixture dibersihkan.
4. Tambahkan viewer state dan aggregate feed query.
5. Buat preview deployment.
6. Uji API pada preview.
7. Baru pertimbangkan release production setelah review terpisah.

**Keputusan saat ini:** staging migration aman secara schema/policy, tetapi belum dapat dinyatakan lulus penuh secara behavioral sampai write matrix dua akun dijalankan.

## References

[1]: ./AUDIT-MIGRATION-REMOTE-RLS-STAGING-2026-09-17.md "Audit Migration Remote dan RLS Staging"

[2]: ./REVIEW-DIFF-FASE-2-2026-09-17.md "Review Diff Fase 2"

[3]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security Documentation"

**Penulis:** Manus AI
