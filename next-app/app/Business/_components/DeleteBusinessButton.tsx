'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBusiness } from './business-api';

type DeleteBusinessButtonProps = {
  id: string;
  name: string;
};

/** Tombol hapus bisnis: konfirmasi → DELETE dengan CSRF → refresh daftar. */
export default function DeleteBusinessButton({ id, name }: DeleteBusinessButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (deleting) return;
    setError(null);
    const confirmed = window.confirm(
      `Hapus "${name}" dari SUKI Business?\n\nBisnis yang dihapus tidak dapat dikembalikan.`,
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteBusiness(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Menghapus bisnis gagal. Silakan coba lagi.');
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
        aria-label={`Hapus bisnis ${name}`}
      >
        {deleting ? 'Menghapus…' : 'Hapus'}
      </button>
      {error && (
        <span role="alert" style={{ fontSize: 12, fontWeight: 600, color: '#b3261e', maxWidth: 240 }}>
          {error}
        </span>
      )}
    </span>
  );
}
