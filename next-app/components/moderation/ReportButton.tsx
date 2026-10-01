'use client';

import { useState } from 'react';
import { CheckCircle2, Flag } from 'lucide-react';
import { REPORT_REASON_LABELS, type ReportReason } from '@/lib/actions/reports';

// Tombol "Laporkan" generik: menampilkan daftar alasan lalu memanggil
// server action yang diberikan. Dipakai di marketplace (QuickView),
// properti, dan tempat lain yang butuh lapor konten.
export function ReportButton({
  onReport,
  label = 'Laporkan',
  className,
  style,
}: {
  onReport: (reason: ReportReason) => Promise<{ ok: boolean; message: string }>;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(reason: ReportReason) {
    setBusy(true);
    setError(null);
    try {
      const result = await onReport(reason);
      if (result.ok) {
        setDone(result.message);
        setOpen(false);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Laporan belum dapat dicatat. Coba lagi nanti.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--sk-success, #2E7D32)' }} role="status">
        <CheckCircle2 size={15} aria-hidden="true" /> {done}
      </p>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setError(null); }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={className}
        style={style}
      >
        <Flag size={15} aria-hidden="true" /> {label}
      </button>
      {open && (
        <span
          role="menu"
          aria-label="Pilih alasan laporan"
          className="absolute left-0 top-full z-30 mt-2 w-60 rounded-xl border bg-white p-2 shadow-xl dark:bg-[#10231f]"
          style={{ borderColor: 'var(--sk-line)' }}
        >
          <span className="block px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-gray-500">
            Alasan laporan
          </span>
          {(Object.keys(REPORT_REASON_LABELS) as ReportReason[]).map((reason) => (
            <button
              key={reason}
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => void submit(reason)}
              className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-white/10"
            >
              {REPORT_REASON_LABELS[reason]}
            </button>
          ))}
          {error && (
            <span className="block px-2 py-1 text-xs font-semibold text-red-600" role="alert">
              {error}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
