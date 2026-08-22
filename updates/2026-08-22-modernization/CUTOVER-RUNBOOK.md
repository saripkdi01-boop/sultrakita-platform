# SultraKita PHP/React Cutover Runbook Tanpa Downtime

## Prinsip utama

Cutover tidak boleh berupa penggantian DNS satu kali. Runtime saat ini dan track PHP/React harus hidup berdampingan, memakai kontrak API yang sama, dan dapat dikembalikan ke Worker tanpa migrasi balik yang berisiko. Selama fase migrasi, database harus memiliki satu sumber kebenaran dan mutation write harus dikendalikan agar tidak terjadi konflik.

## Pilihan strategi

| Strategi | Trade-off | Kapan dipakai |
|---|---|---|
| Reverse proxy + feature flag | Kontrol sangat baik, tetapi membutuhkan routing dan observability yang disiplin | Pilihan utama untuk SultraKita |
| Blue-green penuh | Rollback cepat, tetapi membutuhkan dua environment dan sinkronisasi database matang | Setelah PHP parity stabil |
| Big-bang DNS switch | Paling sederhana secara teori, tetapi berisiko downtime dan rollback sulit | Tidak direkomendasikan |

## Tahap 0 — Contract freeze

Bekukan response envelope, status code, pagination, field listing, dan ownership rules. Buat contract tests yang harus lulus oleh Worker dan PHP. Jangan membiarkan PHP mengubah nama field atau semantik status selama dual-run.

## Tahap 1 — Database expand

Tambahkan tabel dan kolom secara backward-compatible. Jalankan migration terlebih dahulu tanpa menghapus field lama. Pastikan index dibuat online atau pada replica agar tidak menahan write production. Aktifkan backup dan point-in-time recovery sebelum migration.

## Tahap 2 — Shadow read

Deploy PHP API di hostname internal atau route tersembunyi. Untuk request GET, salin request secara asynchronous ke PHP tanpa mengirim response PHP kepada user. Bandingkan status, schema, jumlah item, ordering, dan hash field nonvolatile. Jangan shadow mutation karena dapat menggandakan write.

## Tahap 3 — Dual-read dengan feature flag

Tambahkan flag server-side, misalnya `READ_RUNTIME=worker|php|compare`. Mulai dari `worker`, lalu `compare` untuk sebagian traffic. Response user tetap berasal dari Worker; PHP hanya dibandingkan. Toleransi perbedaan harus eksplisit dan error comparison tidak boleh membocorkan data ke client.

## Tahap 4 — Canary read PHP

Alihkan 1% traffic GET ke PHP melalui reverse proxy atau edge routing. Naikkan ke 5%, 25%, dan 50% hanya jika error rate, p95 latency, empty-result rate, dan pagination mismatch tetap di bawah threshold yang disepakati. Mutation tetap di Worker pada tahap ini.

## Tahap 5 — Mutation handoff per endpoint

Aktifkan mutation PHP satu endpoint pada satu waktu: create listing, update listing, archive listing, lalu favorites/comments/reports. Worker harus berhenti menerima mutation endpoint yang sudah dipindahkan, atau kedua runtime harus memakai idempotency key yang sama. Jangan menjalankan dual-write naif karena dapat menggandakan transaksi.

Untuk create/update/delete listing, gunakan idempotency key dari client atau gateway, simpan event mutation di tabel durable, dan pastikan retry menghasilkan response yang sama. Session cookie PHP dan bearer session Worker harus memiliki adapter yang memetakan identity ke user ID yang sama.

## Tahap 6 — React progressive delivery

React baru awalnya dirender hanya untuk internal users atau cookie feature flag. Setelah API PHP canary stabil, aktifkan 1% user, lalu 5%, 25%, 50%, dan 100%. Gunakan asset versioning immutable dan jangan menghapus bundle lama sampai semua cache TTL berakhir.

## Tahap 7 — Rollback

Rollback traffic dengan mengubah feature flag atau reverse-proxy target, bukan dengan menghapus database migration. Untuk mutation yang sudah berjalan di PHP, rollback hanya ke Worker jika Worker memahami schema baru dan semua write PHP tetap kompatibel. Jika tidak, hentikan mutation, pertahankan read-only, dan pulihkan dari event/idempotency log.

## Gate release

Cutover dapat dinaikkan hanya jika contract tests Worker/PHP lulus, security regression lulus untuk kedua runtime, p95 dan error rate stabil selama observation window, tidak ada duplicate mutation, ownership denial tetap benar, dan rollback drill berhasil pada staging. Production smoke test harus read-only; mutation E2E wajib memakai staging dengan database disposable.

## Checklist operasional

Sebelum cutover, catat commit SHA, migration version, feature flag default, dashboard metrics, on-call owner, rollback command, dan backup verification. Selama cutover, amati 401/403/409/5xx, session failures, CSRF failures, duplicate idempotency keys, database locks, dan mismatch Worker/PHP. Setelah 100% cutover, pertahankan Worker sebagai fallback sampai minimal satu retention window dan satu rollback drill production-like selesai.
