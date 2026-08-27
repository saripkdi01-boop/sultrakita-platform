# RBAC production QA

- Endpoint `GET https://sultrakita-platform.vercel.app/api/health` mengembalikan `success: true`, `api: up`, `db: up`, `storage: down`, build `b87fee07ac0faa536d0cd3938d0845756ee5aa00`.
- Route canonical `/admin` mengembalikan Operations Center dan marker `Akses akun` dari `admin-rbac.js`.
- Tanpa token, UI menampilkan status belum terverifikasi dan tidak memuat data sensitif. Panel data operasional disiapkan default-deny oleh `admin-rbac.js` sampai endpoint `/api/admin/rbac/me` sukses.
- Tampilan viewport browser desktop berhasil dimuat; validasi 375px khusus perlu dilakukan dengan browser/device emulation bila kredensial test role tersedia.
Live security check via curl juga mengonfirmasi `GET /api/admin/rbac/me` tanpa credential menghasilkan HTTP 401 dengan failure envelope, sedangkan `/admin` menghasilkan HTTP 200 dengan `Cache-Control: no-store, no-cache, must-revalidate`, CSP, X-Content-Type-Options, Referrer-Policy, dan Permissions-Policy tetap aktif.
