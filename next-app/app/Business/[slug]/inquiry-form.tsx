'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

async function getCsrfToken(): Promise<string> {
  const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Token keamanan belum tersedia. Silakan coba lagi.');
  const payload = (await response.json()) as { csrfToken?: string };
  if (!payload.csrfToken) throw new Error('Token keamanan tidak valid. Silakan coba lagi.');
  return payload.csrfToken;
}

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
    if (!nama.trim() || !kontak.trim() || !pesan.trim()) {
      setStatus('error');
      setStatusMessage('Mohon lengkapi nama, kontak, dan pesan Anda.');
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
          payload?.error?.message || payload?.message || 'Pertanyaan gagal dikirim. Silakan coba lagi.',
        );
      }
      setStatus('success');
      setStatusMessage(
        `Pertanyaan Anda terkirim ke ${businessName}. Mereka akan menghubungi Anda melalui kontak yang diberikan.`,
      );
      setNama('');
      setKontak('');
      setPesan('');
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.',
      );
    }
  }

  return (
    <form
      className="suki-business-inquiry-form"
      onSubmit={handleSubmit}
      aria-label={`Formulir pertanyaan untuk ${businessName}`}
    >
      <label htmlFor="inquiry-nama">
        Nama Anda
        <input
          id="inquiry-nama"
          type="text"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama lengkap"
          autoComplete="name"
          required
          maxLength={120}
          disabled={status === 'loading'}
        />
      </label>
      <label htmlFor="inquiry-kontak">
        Kontak (no. HP / email)
        <input
          id="inquiry-kontak"
          type="text"
          name="kontak"
          value={kontak}
          onChange={(e) => setKontak(e.target.value)}
          placeholder="08xx-xxxx-xxxx atau email@anda.id"
          autoComplete="tel"
          required
          maxLength={160}
          disabled={status === 'loading'}
        />
      </label>
      <label htmlFor="inquiry-pesan">
        Pesan
        <textarea
          id="inquiry-pesan"
          name="pesan"
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder={`Tulis pertanyaan Anda untuk ${businessName}…`}
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
        {status === 'loading' ? 'Mengirim…' : 'Kirim pertanyaan'}
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
