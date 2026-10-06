'use client';

import { useEffect } from 'react';
import ErrorShell from '@/components/seo/ErrorShell';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Halaman error 500 per-segmen.
 * Client component dengan tombol "Coba lagi" (reset()).
 * TIDAK menampilkan stack trace / pesan error mentah ke pengguna —
 * detail hanya dicatat ke console untuk diagnostik.
 */
export default function Error({ error, reset }: ErrorPageProps) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);

  useEffect(() => {
    // Diagnostik internal saja; tidak dirender ke UI.
    console.error('[suki-apps] error boundary:', error.digest ?? '(tanpa digest)', error.message);
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
      title={t.errTitle}
      description={t.errDesc}
      onRetry={reset}
      retryLabel={t.errRetry}
      actions={[
        { label: t.errBackHome, href: '/' },
        { label: t.errSupport, href: '/support' },
      ]}
      footnote={
        error.digest ? (
          <>
            {t.errRefCode} <code style={{ fontFamily: 'monospace' }}>{error.digest}</code> — {t.errRefHelp}
          </>
        ) : (
          <>{t.errNoDigest}</>
        )
      }
    />
  );
}
