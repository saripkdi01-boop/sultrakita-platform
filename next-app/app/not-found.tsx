'use client';

import ErrorShell from '@/components/seo/ErrorShell';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

/**
 * Halaman 404 ber-branding SukiApps.
 * Tanpa stack trace; selalu ada jalan keluar. Teks mengikuti bahasa aktif.
 */
export default function NotFound() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);

  const footnoteParts = t.nfFootnote.split(/(\{report\})/g);

  return (
    <ErrorShell
      code="404"
      title={t.nfTitle}
      description={t.nfDesc}
      actions={[
        { label: t.nfBackHome, href: '/', primary: true },
        { label: t.nfMarketplace, href: '/marketplace' },
        { label: t.nfJobs, href: '/jobs' },
        { label: t.nfSupport, href: '/support' },
      ]}
      footnote={
        <>
          {footnoteParts.map((part, i) =>
            part === '{report}' ? (
              <a key={i} href="/support" style={{ color: '#0e6258', fontWeight: 700 }}>{t.nfReportLink}</a>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </>
      }
    />
  );
}
