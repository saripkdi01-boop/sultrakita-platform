'use client';

import { useEffect } from 'react';
import ErrorShell from '@/components/seo/ErrorShell';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Halaman error 500 per-segmen (P1-3 LAUNCH_AUDIT).
 * Client component dengan tombol "Coba lagi" (reset()).
 * TIDAK menampilkan stack trace / pesan error mentah ke pengguna —
 * detail hanya dicatat ke console untuk diagnostik.
 */
export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Diagnostik internal saja; tidak dirender ke UI.
    console.error('[suki-apps] error boundary:', error.digest ?? '(tanpa digest)', error.message);
    // T5(c): laporkan ke log server (fire-and-forget) agar error client
    // tercatat di Vercel Runtime Logs via /api/log-error. Tanpa PII.
    try {
      const payload = JSON.stringify({
        digest: error.digest ?? null,
        message: String(error.message ?? '').slice(0, 500),
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
    <ErrorShell
      code="500"
      title="Terjadi kesalahan"
      description={
        <>
          Maaf, ada gangguan sesaat saat memuat halaman ini. Data Anda aman — silakan coba
          lagi dalam beberapa saat. Jika masalah berlanjut, beri tahu tim kami.
        </>
      }
      onRetry={reset}
      retryLabel="Coba lagi"
      actions={[
        { label: 'Kembali ke Beranda', href: '/' },
        { label: 'Hubungi Dukungan', href: '/support' },
      ]}
      footnote={
        error.digest ? (
          <>
            Kode rujukan: <code style={{ fontFamily: 'monospace' }}>{error.digest}</code> — sertakan
            kode ini saat menghubungi dukungan agar kami lebih cepat membantu.
          </>
        ) : (
          <>Sertakan waktu kejadian dan halaman yang Anda buka saat menghubungi dukungan.</>
        )
      }
    />
  );
}
