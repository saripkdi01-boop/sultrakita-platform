'use client';

import { useEffect } from 'react';
import ErrorShell from '@/components/seo/ErrorShell';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

/**
 * Global error boundary.
 *
 * Menggantikan root layout saat error fatal, jadi harus mandiri penuh:
 * - mendefinisikan <html> dan <body> sendiri,
 * - styling inline penuh (tanpa globals.css),
 * - tanpa next/link (pakai <a> biasa) agar tidak bergantung pada router context.
 *
 * TIDAK menampilkan stack trace ke pengguna. Teks mengikuti bahasa aktif.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);

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
    <html lang={language}>
      <body style={{ margin: 0 }}>
        <ErrorShell
          code="500"
          title={t.gerrTitle}
          description={t.gerrDesc}
          actions={[
            {
              label: t.gerrReload,
              href: typeof window !== 'undefined' ? window.location.href : '/',
              primary: true,
            },
            { label: t.gerrBackHome, href: '/' },
          ]}
          footnote={
            error?.digest ? (
              <>
                {t.errRefCode} <code style={{ fontFamily: 'monospace' }}>{error.digest}</code>
              </>
            ) : undefined
          }
        />
      </body>
    </html>
  );
}
