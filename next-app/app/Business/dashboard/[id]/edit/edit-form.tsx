'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BusinessForm, { type BusinessFormData, type CategoryOption } from '../../../_components/BusinessForm';
import { buildBusinessPayload, updateBusiness } from '../../../_components/business-api';

type EditBusinessFormProps = {
  businessId: string;
  initial: BusinessFormData;
  categories: CategoryOption[];
};

/** Wrapper client untuk halaman ubah: submit → PATCH /api/businesses/[id] → dashboard. */
export default function EditBusinessForm({ businessId, initial, categories }: EditBusinessFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(data: BusinessFormData) {
    setSubmitting(true);
    setServerError(null);
    try {
      await updateBusiness(businessId, buildBusinessPayload(data));
      router.push('/Business/dashboard');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Menyimpan perubahan gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BusinessForm
      mode="edit"
      categories={categories}
      initial={initial}
      onSubmit={(data) => handleSubmit(data)}
      submitting={submitting}
      serverError={serverError}
    />
  );
}
