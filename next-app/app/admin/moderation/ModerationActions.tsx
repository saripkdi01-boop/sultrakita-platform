'use client';

// Aksi moderasi per laporan: tandai ditinjau, tolak laporan, takedown listing.
// Semua aksi wajib alasan (min. 3 karakter) + konfirmasi, dicatat di audit trail.

import { useState, type FormEvent } from 'react';
import { setReportStatus, takedownListingFromReport } from '@/lib/admin/actions';

export function ModerationActions({ reportId, status, hasListing }: { reportId: string; status: string; hasListing: boolean }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const closed = status === 'resolved' || status === 'dismissed';

  async function run(kind: 'under_review' | 'resolved' | 'dismissed' | 'takedown', label: string) {
    if (reason.trim().length < 3) {
      alert('Alasan wajib diisi (min. 3 karakter).');
      return;
    }
    if (!window.confirm(`${label} laporan ini? Aksi dicatat di audit trail.`)) return;
    setBusy(kind);
    setMessage(null);
    try {
      const result =
        kind === 'takedown'
          ? await takedownListingFromReport(reportId, reason.trim())
          : await setReportStatus(reportId, kind, reason.trim());
      if (result.ok) {
        setMessage({ ok: true, text: 'Berhasil. Halaman akan dimuat ulang.' });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setMessage({ ok: false, text: result.error });
      }
    } catch {
      setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' });
    } finally {
      setBusy(null);
    }
  }

  const submit = (kind: 'under_review' | 'resolved' | 'dismissed' | 'takedown', label: string) => (e: FormEvent) => {
    e.preventDefault();
    void run(kind, label);
  };

  const btn = 'rounded-xl px-4 py-2 text-xs font-bold text-white disabled:opacity-50';

  return (
    <div className="mt-3 rounded-2xl bg-[#f6fbf9] p-4 dark:bg-white/5">
      {!closed ? (
        <form className="flex flex-col gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan tindakan (wajib)…"
            className="w-full rounded-xl border border-[#dcebe5] px-3 py-2 text-xs outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!!busy} onClick={submit('under_review', 'Tandai ditinjau')} className={`${btn} bg-[#1b4fd8]`}>
              {busy === 'under_review' ? '…' : 'Tandai ditinjau'}
            </button>
            <button type="button" disabled={!!busy} onClick={submit('dismissed', 'Tolak')} className={`${btn} bg-[#78948c]`}>
              {busy === 'dismissed' ? '…' : 'Tolak laporan'}
            </button>
            <button type="button" disabled={!!busy} onClick={submit('resolved', 'Selesaikan')} className={`${btn} bg-[#1b806f]`}>
              {busy === 'resolved' ? '…' : 'Selesaikan'}
            </button>
            {hasListing && (
              <button type="button" disabled={!!busy} onClick={submit('takedown', 'Takedown listing')} className={`${btn} bg-red-600`}>
                {busy === 'takedown' ? '…' : 'Takedown listing terkait'}
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="text-xs text-[#78948c]">Laporan sudah {status === 'resolved' ? 'diselesaikan' : 'ditolak'}. Riwayat ada di audit trail.</p>
      )}
      {message && (
        <p className={`mt-2 text-xs ${message.ok ? 'text-[#146355]' : 'text-red-700'}`}>{message.text}</p>
      )}
    </div>
  );
}
