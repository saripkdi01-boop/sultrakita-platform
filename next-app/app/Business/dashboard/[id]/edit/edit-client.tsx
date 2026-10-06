'use client';

import Link from 'next/link';
import BusinessHeader from '../../../_components/BusinessHeader';
import EditBusinessForm from './edit-form';
import type { BusinessFormData, CategoryOption } from '../../../_components/BusinessForm';
import { backLink, containerNarrow, pageKicker, pageSubtitle, pageTitle } from '../../../_components/formStyles';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export default function EditClient({
  businessId,
  initial,
  categories,
  businessName,
  notFound,
}: {
  businessId: string;
  initial: BusinessFormData | null;
  categories: CategoryOption[];
  businessName: string;
  notFound: boolean;
}) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  if (notFound || !initial) {
    return (
      <main className="suki-business-page">
        <BusinessHeader />
        <div style={containerNarrow}>
          <h1 style={pageTitle}>{b.bEditNotFound}</h1>
          <p style={pageSubtitle}>
            {b.bEditNotFoundD}
          </p>
          <Link href="/Business/dashboard" className="suki-business-button suki-business-button-dark">
            {b.bEditNotFoundCta}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="suki-business-page">
      <BusinessHeader />
      <div style={containerNarrow}>
        <Link href="/Business/dashboard" style={backLink}>
          <span aria-hidden="true">←</span> {b.bEditBack}
        </Link>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          {b.bEditKicker}
        </p>
        <h1 style={pageTitle}>{businessName}</h1>
        <p style={pageSubtitle}>{b.bEditDesc}</p>
        <EditBusinessForm businessId={businessId} initial={initial} categories={categories} />
      </div>
    </main>
  );
}
