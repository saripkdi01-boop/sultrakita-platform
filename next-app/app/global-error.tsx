'use client';

import { useEffect } from 'react';
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
  // T5(c): laporkan error fatal ke log server via /api/log-error (fire-and-forget).
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        digest: error?.digest ?? null,
        message: String(error?.message ?? '').slice(0, 500),
        path: typeof window !== 'undefined' ? window.location.pathname.slice(0, 200) : null,
      });
      const blob = new Blob([payload], { type: 'application/json' });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/log-error', blob);
      } else {
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Abaikan — pelaporan tidak boleh mengganggu UI error.
    }
  }, [error]);

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
