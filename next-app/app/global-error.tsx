'use client';

import ErrorShell from '@/components/seo/ErrorShell';

/**
 * Global error boundary (P1-3 LAUNCH_AUDIT).
 *
 * Menggantikan root layout saat error fatal, jadi harus mandiri penuh:
 * - mendefinisikan <html> dan <body> sendiri,
 * - styling inline penuh (tanpa globals.css),
 * - tanpa next/link (pakai <a> biasa) agar tidak bergantung pada router context.
 *
 * TIDAK menampilkan stack trace ke pengguna.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        <ErrorShell
          code="500"
          title="Aplikasi mengalami gangguan"
          description={
            <>
              Maaf, SukiApps mengalami gangguan yang tidak terduga. Tim kami sudah menerima
              laporan otomatis. Silakan muat ulang halaman atau kembali lagi beberapa saat.
            </>
          }
          actions={[
            {
              label: 'Muat ulang halaman',
              href: typeof window !== 'undefined' ? window.location.href : '/',
              primary: true,
            },
            { label: 'Kembali ke Beranda', href: '/' },
          ]}
          footnote={
            error?.digest ? (
              <>
                Kode rujukan: <code style={{ fontFamily: 'monospace' }}>{error.digest}</code>
              </>
            ) : undefined
          }
        />
      </body>
    </html>
  );
}
