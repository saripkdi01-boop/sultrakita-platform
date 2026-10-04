'use client';

import Link from 'next/link';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import DeleteBusinessButton from './DeleteBusinessButton';
import BusinessInquiries from '../dashboard/inbox';
import { card } from './formStyles';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export type BusinessCardData = {
  id: string;
  nama: string;
  status: string | null;
  kategoriLabel?: string;
  kota?: string;
};

/** Kartu satu bisnis milik pengguna di dashboard: status, aksi, dan pertanyaan masuk. */
export default function BusinessCard({ business }: { business: BusinessCardData }) {
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  const meta = [business.kategoriLabel, business.kota].filter(Boolean).join(' · ');

  return (
    <article style={card} aria-labelledby={`biz-${business.id}-name`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2 id={`biz-${business.id}-name`} style={{ margin: 0, fontSize: 18, letterSpacing: '-.02em', color: 'var(--sb-ink)' }}>
            {business.nama}
          </h2>
          {meta && (
            <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: 'var(--sb-muted)' }}>{meta}</p>
          )}
        </div>
        <StatusBadge status={business.status} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <Link
          href={`/Business/dashboard/${business.id}/edit`}
          className="suki-business-button suki-business-button-light"
          aria-label={b.bCardEditAria.replace('{name}', business.nama)}
        >
          {b.bCardEdit}
        </Link>
        <DeleteBusinessButton id={business.id} name={business.nama} />
      </div>

      <details style={{ marginTop: 18, borderTop: '1px solid var(--sb-line)', paddingTop: 4 }}>
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 13,
            color: 'var(--sb-forest)',
            padding: '12px 0',
            listStyle: 'revert',
          }}
        >
          {b.bCardInquiries}{inquiryCount !== null ? ` (${inquiryCount})` : ''}
        </summary>
        <div style={{ paddingBottom: 6 }}>
          <BusinessInquiries businessId={business.id} onCount={setInquiryCount} />
        </div>
      </details>
    </article>
  );
}
