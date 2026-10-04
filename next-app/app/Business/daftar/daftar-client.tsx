'use client';

import { BadgeCheck, Network, Store } from 'lucide-react';
import BusinessHeader from '../_components/BusinessHeader';
import DaftarForm from './daftar-form';
import { containerNarrow, pageKicker, pageSubtitle, pageTitle } from '../_components/formStyles';
import type { CategoryOption } from '../_components/BusinessForm';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export default function DaftarClient({ categories }: { categories: CategoryOption[] }) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  const VALUE_PROPS = [
    { icon: BadgeCheck, title: b.bDaftarB1t, text: b.bDaftarB1d },
    { icon: Store, title: b.bDaftarB2t, text: b.bDaftarB2d },
    { icon: Network, title: b.bDaftarB3t, text: b.bDaftarB3d },
  ];

  return (
    <main className="suki-business-page">
      <BusinessHeader hideCta />
      <div style={containerNarrow}>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          {b.bDaftarKicker}
        </p>
        <h1 style={pageTitle}>{b.bDaftarTitle}</h1>
        <p style={pageSubtitle}>
          {b.bDaftarDesc}
        </p>

        <ul
          aria-label={b.bDaftarBenefitAria}
          style={{
            listStyle: 'none',
            margin: '0 0 30px',
            padding: 0,
            display: 'grid',
            gap: 10,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '14px 15px',
                borderRadius: 16,
                border: '1px solid var(--sb-line)',
                background: 'var(--sb-surface)',
                boxShadow: 'var(--theme-shadow-sm)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 36,
                  height: 36,
                  flex: 'none',
                  borderRadius: 11,
                  background: 'var(--sb-mint)',
                  color: 'var(--sb-teal)',
                }}
              >
                <Icon size={18} />
              </span>
              <span>
                <strong style={{ display: 'block', fontSize: 13, color: 'var(--sb-ink)' }}>{title}</strong>
                <span style={{ display: 'block', marginTop: 3, fontSize: 12, lineHeight: 1.6, color: 'var(--sb-muted)' }}>
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <DaftarForm categories={categories} />
      </div>
    </main>
  );
}
