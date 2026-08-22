# Cloudflare R2 and Worker Metrics Sources

- Cloudflare Workers API: https://developers.cloudflare.com/r2/get-started/workers-api/ — bucket dapat dibuat dengan `npx wrangler r2 bucket create <name>`, diverifikasi melalui `npx wrangler r2 bucket list`, lalu di-bind pada Wrangler menggunakan `[[r2_buckets]]`, `binding`, dan `bucket_name`.
- Cloudflare Workers metrics: https://developers.cloudflare.com/workers/observability/metrics-and-analytics/ — dashboard Workers menampilkan requests, successes, errors, subrequests, wall time, CPU time, memory, invocation status, dan request duration. Metrics dapat ditinjau sampai tiga bulan dengan increment maksimum satu minggu.
- Cloudflare GraphQL Workers metrics tutorial: https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/ — query dataset `workersInvocationsAdaptive` mendukung `sum.requests`, `sum.errors`, `sum.subrequests`, quantiles `cpuTimeP50`/`cpuTimeP99`, dan filter account/script/datetime. Data query maksimal satu bulan untuk tanggal sampai tiga bulan sebelumnya.

Status account saat pemeriksaan: `npx wrangler r2 bucket list` mengembalikan Cloudflare code `10042` dengan pesan agar R2 diaktifkan melalui Cloudflare Dashboard. Karena itu bucket dan binding belum dapat dibuat otomatis dari API/CLI sampai R2 diaktifkan pada account.
