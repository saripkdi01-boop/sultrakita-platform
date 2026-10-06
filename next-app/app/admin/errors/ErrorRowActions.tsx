'use client';

// Tombol aksi per baris Error Inbox (client) — memanggil server action.

import { useState } from 'react';
import { setErrorResolved } from './actions';

export function ErrorRowActions({ id, resolved }: { id: string; resolved: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function toggle() {
    setBusy(true);
    setErr('');
    const res = await setErrorResolved(id, !resolved);
    setBusy(false);
    if (!res.ok) setErr(res.error || 'Gagal.');
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => void toggle()}
        disabled={busy}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
          resolved
            ? 'border border-[#dcebe5] text-[#55736b] hover:bg-[#f3f8f6]'
            : 'bg-[#123f38] text-white hover:bg-[#1b5a50]'
        }`}
      >
        {busy ? '…' : resolved ? 'Buka lagi' : 'Tandai resolved'}
      </button>
      {err && <span className="text-[11px] text-red-600">{err}</span>}
    </div>
  );
}
