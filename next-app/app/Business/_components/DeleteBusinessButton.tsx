'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBusiness } from './business-api';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

type DeleteBusinessButtonProps = {
  id: string;
  name: string;
};

/** Tombol hapus bisnis: konfirmasi → DELETE dengan CSRF → refresh daftar. */
export default function DeleteBusinessButton({ id, name }: DeleteBusinessButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  async function handleClick() {
    if (deleting) return;
    setError(null);
    const confirmed = window.confirm(
      b.bDeleteConfirm.replace('{name}', name),
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteBusiness(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : b.bDeleteError);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <span style={{ display: 'inline-grid', gap: 6, justifyItems: 'start' }}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={deleting}
        className="suki-business-button suki-business-button-light"
        aria-label={b.bDeleteAria.replace('{name}', name)}
      >
        {deleting ? b.bDeleting : b.bDelete}
      </button>
      {error && (
        <span role="alert" style={{ fontSize: 12, fontWeight: 600, color: 'var(--sb-danger)', maxWidth: 240 }}>
          {error}
        </span>
      )}
    </span>
  );
}
