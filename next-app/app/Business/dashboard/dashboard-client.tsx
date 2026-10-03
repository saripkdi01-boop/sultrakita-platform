'use client';

import Link from 'next/link';
import BusinessHeader from '../_components/BusinessHeader';
import BusinessCard, { type BusinessCardData } from '../_components/BusinessCard';
import { backLink, containerWide, pageKicker, pageSubtitle, pageTitle, successBanner } from '../_components/formStyles';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export default function DashboardClient({
  cards,
  justSubmitted,
}: {
  cards: BusinessCardData[];
  justSubmitted: boolean;
}) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  return (
    <main className="suki-business-page">
      <BusinessHeader />
      <div style={containerWide}>
        <Link href="/Business" style={backLink}>
          <span aria-hidden="true">←</span> {b.bDashBack}
        </Link>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          {b.bDashKicker}
        </p>
        <h1 style={pageTitle}>{b.bDashTitle}</h1>
        <p style={pageSubtitle}>
          {b.bDashDesc}
        </p>

        {justSubmitted && (
          <div role="status" style={successBanner}>
            {b.bDashSubmitted}
          </div>
        )}

        <div style={{ marginBottom: 26 }}>
          <Link href="/Business/daftar" className="suki-business-button suki-business-button-teal">
            {b.bDashNew}
          </Link>
        </div>

        {cards.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--sb-line)',
              borderRadius: 20,
              background: 'var(--sb-surface)',
              padding: '48px 28px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: 'var(--sb-ink)' }}>
              {b.bDashEmptyT}
            </p>
            <p style={{ margin: '0 0 22px', fontSize: 13, color: 'var(--sb-muted)', lineHeight: 1.7 }}>
              {b.bDashEmptyD}
            </p>
            <Link href="/Business/daftar" className="suki-business-button suki-business-button-dark">
              {b.bDashEmptyCta}
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
            {cards.map((business) => (
              <li key={business.id}>
                <BusinessCard business={business} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
