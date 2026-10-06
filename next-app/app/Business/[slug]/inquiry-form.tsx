'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function InquiryForm({
  businessId,
  businessName,
}: {
  businessId: string | number;
  businessName: string;
}) {
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [pesan, setPesan] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  async function getCsrfToken(): Promise<string> {
    const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
    if (!response.ok) throw new Error(b.bInqCsrfUnavailable);
    const payload = (await response.json()) as { csrfToken?: string };
    if (!payload.csrfToken) throw new Error(b.bInqCsrfInvalid);
    return payload.csrfToken;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
    if (!nama.trim() || !kontak.trim() || !pesan.trim()) {
      setStatus('error');
      setStatusMessage(b.bInqRequired);
      return;
    }
    setStatus('loading');
    setStatusMessage('');
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        `/api/businesses/${encodeURIComponent(String(businessId))}/inquiries`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          // Kontrak API: { name, contact, message } (zod: name min 2, contact min 5, message min 10).
          body: JSON.stringify({ name: nama.trim(), contact: kontak.trim(), message: pesan.trim() }),
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: { message?: string }; message?: string }
        | null;
      if (!response.ok) {
        throw new Error(
          payload?.error?.message || payload?.message || b.bInqSendFailed,
        );
      }
      setStatus('success');
      setStatusMessage(
        b.bInqSent.replace('{name}', businessName),
      );
      setNama('');
      setKontak('');
      setPesan('');
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Error ? error.message : b.bInqGenericError,
      );
    }
  }

  return (
    <form
      className="suki-business-inquiry-form"
      onSubmit={handleSubmit}
      aria-label={b.bInqFormAria.replace('{name}', businessName)}
    >
      <label htmlFor="inquiry-nama">
        {b.bInqName}
        <input
          id="inquiry-nama"
          type="text"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder={b.bInqNamePh}
          autoComplete="name"
          required
          maxLength={120}
          disabled={status === 'loading'}
        />
      </label>
      <label htmlFor="inquiry-kontak">
        {b.bInqContact}
        <input
          id="inquiry-kontak"
          type="text"
          name="kontak"
          value={kontak}
          onChange={(e) => setKontak(e.target.value)}
          placeholder={b.bInqContactPh}
          autoComplete="tel"
          required
          maxLength={160}
          disabled={status === 'loading'}
        />
      </label>
      <label htmlFor="inquiry-pesan">
        {b.bInqMessage}
        <textarea
          id="inquiry-pesan"
          name="pesan"
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder={b.bInqMessagePh.replace('{name}', businessName)}
          required
          minLength={10}
          maxLength={2000}
          disabled={status === 'loading'}
        />
      </label>
      <button
        type="submit"
        className="suki-business-inquiry-submit"
        disabled={status === 'loading'}
      >
        <Send size={15} aria-hidden="true" />
        {status === 'loading' ? b.bInqSending : b.bInqSend}
      </button>
      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          className={`suki-business-form-status ${
            status === 'success' ? 'is-success' : status === 'error' ? 'is-error' : ''
          }`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
