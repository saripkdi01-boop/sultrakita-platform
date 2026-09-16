# Audit Migration Remote dan Test RLS Staging — Feed Suki Apps

**Tanggal:** 17 September 2026  
**Project Supabase:** `sultrakita-platform`  
**Project ref:** `ibvcfdfsjpytwpnxgylm`  
**Mode:** read-only audit; tidak ada migration atau data mutation yang dijalankan

## 1. Kesimpulan

Audit terhadap Supabase remote menemukan bahwa migration Fase 2 belum diterapkan. Migration remote terakhir yang tercatat adalah versi `20260913115655` (`suki_chat_hardening_20260913193000`). Migration repository `20260917000000_feed_interactions_v1.sql` belum tercatat pada remote.

Temuan paling penting adalah **schema drift pada tabel komentar**. Migration Fase 2 sebelumnya menargetkan `public.comments`, tetapi pada remote:

- `public.comments` adalah tabel komentar marketplace lama dengan `listing_id bigint`, `body`, dan `status`;
- `public.post_comments` adalah tabel komentar sosial yang benar dengan `post_id uuid`, `user_id uuid`, `content`, `status`, dan timestamp;
- policy sosial remote juga sudah menggunakan `post_comments`.

Migration Fase 2 telah diperbaiki untuk menargetkan `public.post_comments`. API komentar juga telah diperbarui dari `.from('comments')` menjadi `.from('post_comments')`.

## 2. Status migration remote

| Pemeriksaan | Hasil |
|---|---|
| Supabase project | ACTIVE_HEALTHY |
| Database | PostgreSQL 17.6.1 |
| Migration Fase 2 `20260917000000` | Belum ada di remote |
| `saved_posts` | Belum ada di remote |
| `post_shares` | Belum ada di remote |
| `post_comments` | Ada di remote |
| `likes` | Ada di remote |
| `posts` | Ada di remote |
| RLS posts | Aktif |
| RLS likes | Aktif |
| RLS post_comments | Aktif |

## 3. Schema sosial remote yang terverifikasi

### `posts`

Kolom relevan:

- `id uuid`;
- `user_id uuid`;
- `content text`;
- `privacy text`;
- `status text`;
- `created_at timestamptz`;
- `idempotency_key text`.

### `likes`

Kolom dan constraint relevan:

- `post_id uuid`;
- `user_id uuid`;
- `created_at timestamptz`;
- primary key `(post_id, user_id)`.

### `post_comments`

Kolom relevan:

- `id uuid`;
- `post_id uuid`;
- `user_id uuid`;
- `content text`;
- `status text default 'visible'`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Kolom `idempotency_key` belum ada dan akan ditambahkan oleh migration Fase 2.

### Tabel yang belum ada

Migration Fase 2 akan menambahkan:

- `saved_posts`;
- `post_shares`.

## 4. Policy remote yang diverifikasi

### Posts

Remote memiliki policy untuk:

- membaca post publik yang `published`;
- membaca post milik sendiri;
- insert/update/delete milik sendiri.

### Likes

Remote memiliki policy untuk:

- membaca like pada post publik dan published;
- insert like apabila `user_id = auth.uid()` dan post publik/published;
- delete like milik sendiri.

### Post comments

Remote memiliki policy untuk:

- membaca komentar berstatus `visible` pada post publik/published;
- insert komentar ketika `user_id = auth.uid()` dan post publik/published;
- update/delete komentar milik sendiri.

Migration Fase 2 mempertahankan pola ini dan menambahkan idempotency index pada `post_comments`.

## 5. Test RLS staging yang disiapkan

File test baru:

```text
scripts/test-supabase-feed-rls.js
```

### Mode default: read-only preflight

```bash
SUPABASE_URL=https://<staging-ref>.supabase.co \
SUPABASE_ANON_KEY=<staging-anon-key> \
node scripts/test-supabase-feed-rls.js
```

Preflight memeriksa keberadaan endpoint:

- `posts`;
- `likes`;
- `post_comments`;
- `saved_posts`;
- `post_shares`.

Tabel baru boleh mengembalikan `404` sebelum migration diterapkan; setelah migration staging diterapkan, tabel tersebut harus mengembalikan `200` atau `206`.

### Mode write matrix

Mode write hanya boleh dijalankan pada project staging terisolasi dengan dua akun test khusus:

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

Matrix melakukan:

1. membuat post publik temporary;
2. membaca post sebagai anonymous;
3. membuat komentar owner;
4. membuat komentar member;
5. menolak spoofing `user_id` komentar;
6. membuat like member;
7. menolak spoofing `user_id` like;
8. membuat save member;
9. menolak spoofing `user_id` save;
10. membuat share member;
11. menolak spoofing `user_id` share;
12. memverifikasi member tidak dapat menghapus komentar owner;
13. membersihkan fixture post dan child rows.

## 6. Hasil static verification

| Pemeriksaan | Hasil |
|---|---|
| Fase 1 + Fase 2 contract test | 8/8 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| Migration target | `post_comments` sudah benar |
| API target | `.from('post_comments')` sudah benar |
| HTTP preflight dari sandbox | Tidak dijalankan karena anon key tidak tersedia |

Tidak ada secret yang diminta, disalin, atau ditulis ke repository.

## 7. Blocker sebelum staging

Migration belum boleh dijalankan sebelum dilakukan:

1. membuat atau memilih project staging terisolasi;
2. memastikan `post_comments` pada staging sama dengan schema remote yang diaudit;
3. memastikan extension `pgcrypto` aktif karena `gen_random_uuid()` dipakai;
4. menerapkan migration hanya pada staging;
5. menjalankan preflight setelah migration;
6. menjalankan write matrix dengan dua akun test;
7. memeriksa ulang policy dan index melalui SQL metadata;
8. menyimpan hasil test sebagai bukti release.

## 8. Keputusan

Status migration Fase 2: **BLOCKED untuk production, siap direview untuk staging setelah target staging dipastikan.**

Perubahan source penting yang sudah dilakukan:

- migration mengubah target dari `comments` menjadi `post_comments`;
- API komentar mengubah tabel target menjadi `post_comments`;
- contract test mengunci schema sosial tersebut;
- script `test-supabase-feed-rls.js` tersedia dengan write mode opt-in.

Langkah aman berikutnya:

> **Pilih atau siapkan project staging Supabase, lalu jalankan migration Fase 2 di staging.**

Jangan menjalankan script `--write` terhadap production.

## References

[1]: ./REVIEW-DIFF-FASE-2-2026-09-17.md "Review Diff Fase 2"

[2]: ./FASE-2-IMPLEMENTATION-INTERACTIONS-2026-09-17.md "Implementasi Fase 2 Feed Interactions"

[3]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security Documentation"

**Penulis:** Manus AI
