# P0 Design — Session Middleware dan Ownership Matrix SultraKita

## Sasaran Keamanan

Tujuan utama adalah menghilangkan kepercayaan terhadap `user_id`, `seller_id`, `buyer_id`, dan `sender_id` yang dikirim client. Client hanya mengirim token session; server mengambil identitas user dari session yang tervalidasi, lalu memeriksa hak akses terhadap resource yang diminta.

> Prinsip inti: **identity berasal dari session server-side, sedangkan ownership selalu diverifikasi di server sebelum mutation atau pembacaan data privat.**

## 1. Model Session yang Disarankan

Schema existing sudah memiliki `sessions(token_hash PRIMARY KEY, user_id, expires_at, created_at)`. Pertahankan pola ini dan jangan menyimpan raw token di database.

Alur login:

1. OTP berhasil diverifikasi.
2. Generate token acak kriptografis minimal 32 byte.
3. Simpan hanya `sha256(token)` ke tabel `sessions` dengan expiry.
4. Kembalikan token melalui HTTPS kepada client.
5. Pada setiap request protected, baca `Authorization: Bearer <token>`.
6. Hash token dengan SHA-256, ambil session yang belum expired, lalu join ke `users`.
7. Simpan user terverifikasi pada `req.user`.
8. Jika token tidak ada, invalid, atau expired, jawab `401` dengan error generik.

Token tidak boleh muncul di log, response error, analytics, atau URL query string. Tambahkan logout yang menghapus hash session aktif. Pertimbangkan rotasi token setelah login ulang dan batas jumlah session aktif per user.

## 2. Middleware Express

Buat helper terpisah, misalnya `auth.js`, agar `server.js` tidak menjadi lebih besar.

```js
const crypto = require('node:crypto');
const { query, run } = require('./database');

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

async function authenticate(req, _res, next) {
  try {
    const header = req.get('authorization') || '';
    const match = header.match(/^Bearer\\s+([A-Za-z0-9_-]{40,})$/);
    if (!match) return next();

    const [user] = await query(
      `SELECT u.id, u.name, u.phone, u.role, u.district,
              u.phone_verified, u.verification_status
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      [hashToken(match[1]), Date.now()]
    );
    if (user) req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Akses tidak diizinkan' });
    return next();
  };
}

module.exports = { authenticate, requireAuth, requireRole, hashToken };
```

Pasang `app.use(authenticate)` sebelum route API. Jangan menjadikan autentikasi global untuk GET publik; gunakan `requireAuth` secara eksplisit pada route protected agar boundary terlihat saat code review.

Untuk Worker, buat fungsi `authenticate(request, env)` yang membaca header Bearer, hash token menggunakan Web Crypto, lalu query D1 yang sama. Jangan hanya memperbaiki Express karena production memakai Worker.

## 3. Ownership Matrix

| Resource/endpoint | Read publik | Actor wajib | Rule ownership/role |
|---|---:|---|---|
| `GET /api/categories`, `/locations`, `/listings` | Ya | Tidak ada | Hanya data publik dan status active |
| `GET /api/listings/:id` | Ya | Tidak ada | Jangan bocorkan phone seller bila tidak perlu |
| `POST /api/listings` | Tidak | Authenticated seller | `seller_id` diambil dari `req.user.id`; abaikan/reject body `seller_id` |
| `PATCH /api/listings/:id` | Tidak | Seller/admin | `listing.seller_id = req.user.id` atau role admin |
| `DELETE /api/listings/:id` | Tidak | Seller/admin | Sama; soft-delete/archive lebih aman daripada hard delete |
| `POST/DELETE /api/favorites` | Tidak | Authenticated user | `user_id` diambil dari `req.user.id`; listing harus ada |
| `POST /api/comments` | Tidak | Authenticated user atau guest policy eksplisit | Jika authenticated, `user_id` dan author berasal dari session |
| `POST /api/reports` | Tidak | Authenticated user | Simpan reporter dari session; cegah report ke listing tidak ada |
| `POST /api/seller-verifications` | Tidak | Authenticated seller | `user_id = req.user.id`; user tidak boleh mengajukan untuk orang lain |
| `POST /api/conversations` | Tidak | Authenticated buyer/seller | Buyer/seller harus sesuai listing; seller tidak boleh dipalsukan |
| `GET /api/conversations/:id/messages` | Tidak | Conversation member/admin | `buyer_id = req.user.id` atau `seller_id = req.user.id` |
| `POST /api/conversations/:id/messages` | Tidak | Conversation member | `sender_id = req.user.id`; conversation harus open |
| `GET /api/users/:id` | Terbatas | Authenticated atau publik profile | Redact phone/private fields untuk user lain |
| `/api/admin/*` | Tidak | Admin | `requireRole('admin')` plus admin audit log |
| `/api/analytics/summary` | Tidak | Admin | Admin role atau separate admin secret; jangan hanya header statis |

## 4. Aturan Implementasi Route

Jangan menerima ID identitas dari client sebagai sumber kebenaran. Untuk compatibility sementara, body ID dapat ditolak dengan `422` ketika berbeda dari `req.user.id`; jangan diam-diam memakai ID client.

Sebelum mutation, gunakan query ownership atomik bila memungkinkan. Contoh update listing:

```sql
UPDATE listings
SET title = ?, description = ?, price = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND seller_id = ? AND status != 'archived';
```

Periksa affected row. Jika nol, jawab `404` atau `403` sesuai policy tanpa memberi tahu apakah resource milik user lain. Untuk conversation:

```sql
SELECT id, listing_id, buyer_id, seller_id, status
FROM conversations
WHERE id = ? AND (buyer_id = ? OR seller_id = ?);
```

Gunakan hasil query tersebut sebagai authorization proof sebelum membaca atau menulis message.

## 5. Migration dan Konsistensi Data

Tidak perlu migration schema untuk middleware dasar karena tabel `sessions` sudah ada. Migration tambahan yang disarankan adalah index:

```sql
CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry
ON sessions(user_id, expires_at);
```

Bersihkan session expired secara periodik dengan job yang aman. Untuk verification, pilih `verification_status` sebagai canonical field dan pertahankan `is_verified` hanya sebagai compatibility field sampai seluruh reader sudah dipindahkan. Pada approval admin, update keduanya dalam satu transaction atau satu unit kerja yang dapat diverifikasi.

## 6. Urutan Implementasi Aman

1. Tambahkan helper auth dan unit test untuk missing, malformed, valid, expired, dan revoked token.
2. Pasang `authenticate` global setelah body parser, tetapi belum mengubah route publik.
3. Lindungi admin endpoint dengan `requireRole('admin')`.
4. Lindungi conversations/messages dengan membership check.
5. Lindungi favorites, comments, reports, dan verification dengan `req.user`.
6. Lindungi create/edit/archive listing dan hapus semua penggunaan `seller_id` dari body sebagai identity.
7. Terapkan pola yang sama pada Worker.
8. Tambahkan migration index dan cleanup session expired.
9. Jalankan test regression, API smoke, dan manual checklist.
10. Deploy staging/canary; production hanya setelah parity Worker lulus.

## 7. Test Wajib

Minimal test cases:

| Test | Expected |
|---|---|
| Request protected tanpa header | `401` |
| Bearer malformed | `401` |
| Token random | `401` |
| Token expired | `401` |
| Token revoked | `401` |
| User A mengirim `user_id` User B | Ditolak; server tetap memakai User A |
| User A mengedit listing User B | `403` atau safe `404` |
| User A membaca message conversation User B | Ditolak |
| User A mengirim message dengan `sender_id` User B | Ditolak/diabaikan; sender server = User A |
| Buyer palsu membuat conversation memakai seller lain | Ditolak |
| Non-admin membuka admin endpoint | `403` |
| Public listing read | Tetap `200` |
| OTP challenge setelah lima kesalahan | Tetap ditolak |

## Definition of Done P0

P0 belum selesai bila masih ada route mutation yang mempercayai identity dari body, conversation dapat dibaca tanpa membership, admin hanya diamankan oleh token header tanpa policy yang jelas, Worker berbeda dengan Express, atau test hanya memeriksa status `200` tanpa membuktikan ownership denial.

Release P0 harus menyertakan ownership matrix yang diperbarui, test untuk setiap row berisiko tinggi, migration/index note, diff route, hasil local verification, hasil staging smoke, dan rollback plan.

## Status Implementasi Checkpoint

Checkpoint saat ini sudah menerapkan helper session pada `auth.js`, optional request authentication pada Express, logout token revocation, admin role boundary, seller ownership untuk listing image upload, session-derived seller identity saat membuat listing, ownership checks untuk update/archive listing, session identity pada favorites/comments/reports, serta conversation membership dan sender identity checks.

Regression test sekarang mencakup login OTP lokal, binding `seller_id` ke session, penolakan edit listing milik seller lain, logout revocation, dan penolakan mutation setelah token dicabut.

Masih terbuka: penyamaan middleware pada Worker untuk seluruh mutation route, magic-byte validation upload, rate limit khusus auth/session, refresh-token policy, redaction phone pada seluruh public response, dan migration formal untuk index session. Karena itu checkpoint ini belum boleh diberi label “P0 selesai penuh” sebelum Worker dan seluruh route mutation memiliki test denial yang ekuivalen.
