'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BusinessForm, { type BusinessFormData, type CategoryOption } from '../_components/BusinessForm';
import { buildBusinessPayload, createBusiness } from '../_components/business-api';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

/** Wrapper client untuk halaman pendaftaran: submit → POST /api/businesses → dashboard. */
export default function DaftarForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  async function handleSubmit(data: BusinessFormData) {
    setSubmitting(true);
    setServerError(null);
    try {
      await createBusiness(buildBusinessPayload(data));
      router.push('/Business/dashboard?baru=1');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : b.bDaftarError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BusinessForm
      mode="create"
      categories={categories}
      onSubmit={(data) => handleSubmit(data)}
      submitting={submitting}
      serverError={serverError}
    />
  );
}
