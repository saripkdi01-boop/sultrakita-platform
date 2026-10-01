'use client';

// Form CRUD site_settings (admin). Validasi JSON client-side; server action
// memvalidasi ulang + audit log. Toggle maintenance_mode butuh alasan.

import { useState, type FormEvent } from 'react';
import { upsertSetting, toggleMaintenanceMode, deleteSetting } from '@/lib/admin/actions';

export function MaintenanceToggle({ current }: { current: boolean }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      alert('Alasan wajib diisi (min. 3 karakter).');
      return;
    }
    const next = !current;
    if (!window.confirm(next ? 'AKTIFKAN maintenance mode? Situs tidak bisa diakses pengunjung.' : 'MATIKAN maintenance mode?')) return;
    setBusy(true);
    setMessage(null);
    toggleMaintenanceMode(next, reason.trim())
      .then((r) => {
        if (r.ok) {
          setMessage({ ok: true, text: 'Berhasil. Halaman akan dimuat ulang.' });
          setTimeout(() => window.location.reload(), 1200);
        } else setMessage({ ok: false, text: r.error });
      })
      .catch(() => setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' }))
      .finally(() => setBusy(false));
  };
  return (
    <form onSubmit={submit} className={`rounded-3xl border p-6 shadow-sm ${current ? 'border-red-300 bg-red-50/60' : 'border-[#dcebe5] bg-white dark:border-white/10 dark:bg-[#10231f]'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Maintenance mode</h2>
          <p className="mt-1 text-xs text-[#78948c]">
            Status saat ini:{' '}
            <span className={`font-bold ${current ? 'text-red-700' : 'text-[#1b806f]'}`}>{current ? 'AKTIF' : 'nonaktif'}</span>
            . Perubahan berlaku ≤60 detik (cache flag 30 detik + middleware).
          </p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${current ? 'bg-red-600 text-white' : 'bg-[#e9f7f2] text-[#1b806f]'}`}>
          {current ? 'MAINTENANCE AKTIF' : 'SITUS NORMAL'}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Alasan (wajib) — mis. deploy darurat…"
          className="flex-1 rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <button
          type="submit"
          disabled={busy}
          className={`rounded-2xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${current ? 'bg-[#1b806f] hover:bg-[#146355]' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {busy ? 'Memproses…' : current ? 'Matikan maintenance' : 'Aktifkan maintenance'}
        </button>
      </div>
      {message && <p className={`mt-2 text-sm ${message.ok ? 'text-[#146355]' : 'text-red-700'}`}>{message.text}</p>}
    </form>
  );
}

export function SettingEditor({ rowKey, value, description, protectedKey }: { rowKey: string; value: unknown; description: string | null; protectedKey: boolean }) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const [desc, setDesc] = useState(description ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    try {
      JSON.parse(raw);
    } catch {
      setMessage({ ok: false, text: 'Nilai harus berupa JSON yang valid.' });
      return;
    }
    if (!window.confirm(`Simpan perubahan "${rowKey}"? Berlaku ≤60 detik.`)) return;
    setBusy(true);
    setMessage(null);
    upsertSetting(rowKey, raw, desc)
      .then((r) => {
        if (r.ok) setMessage({ ok: true, text: 'Tersimpan.' });
        else setMessage({ ok: false, text: r.error });
      })
      .catch(() => setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' }))
      .finally(() => setBusy(false));
  };
  const remove = () => {
    const reason = window.prompt(`Alasan menghapus "${rowKey}" (wajib, min. 3 karakter):`);
    if (!reason || reason.trim().length < 3) {
      alert('Alasan wajib diisi (min. 3 karakter).');
      return;
    }
    if (!window.confirm(`Hapus pengaturan "${rowKey}"?`)) return;
    setBusy(true);
    deleteSetting(rowKey, reason.trim())
      .then((r) => {
        if (r.ok) {
          setMessage({ ok: true, text: 'Terhapus. Halaman akan dimuat ulang.' });
          setTimeout(() => window.location.reload(), 1200);
        } else setMessage({ ok: false, text: r.error });
      })
      .catch(() => setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' }))
      .finally(() => setBusy(false));
  };
  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm font-extrabold text-[#123f38] dark:text-white">{rowKey}</h3>
        {protectedKey && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">dilindungi</span>}
      </div>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={3}
        spellCheck={false}
        className="mt-3 w-full rounded-2xl border border-[#dcebe5] px-4 py-2.5 font-mono text-xs outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Deskripsi (opsional)"
        className="mt-2 w-full rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={busy} className="rounded-2xl bg-[#1b806f] px-5 py-2 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#146355]">
          {busy ? 'Menyimpan…' : 'Simpan'}
        </button>
        {!protectedKey && (
          <button type="button" disabled={busy} onClick={remove} className="rounded-2xl bg-red-50 px-5 py-2 text-sm font-bold text-red-700 disabled:opacity-50 hover:bg-red-100">
            Hapus
          </button>
        )}
      </div>
      {message && <p className={`mt-2 text-sm ${message.ok ? 'text-[#146355]' : 'text-red-700'}`}>{message.text}</p>}
    </form>
  );
}

export function NewSettingForm() {
  const [key, setKey] = useState('');
  const [raw, setRaw] = useState('true');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    try {
      JSON.parse(raw);
    } catch {
      setMessage({ ok: false, text: 'Nilai harus berupa JSON yang valid.' });
      return;
    }
    if (!/^[a-z0-9_]{2,64}$/.test(key.trim())) {
      setMessage({ ok: false, text: 'Key hanya boleh huruf kecil, angka, underscore (2–64 karakter).' });
      return;
    }
    setBusy(true);
    setMessage(null);
    upsertSetting(key.trim(), raw, desc)
      .then((r) => {
        if (r.ok) {
          setMessage({ ok: true, text: 'Ditambahkan. Halaman akan dimuat ulang.' });
          setTimeout(() => window.location.reload(), 1200);
        } else setMessage({ ok: false, text: r.error });
      })
      .catch(() => setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' }))
      .finally(() => setBusy(false));
  };
  return (
    <form onSubmit={submit} className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
      <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Tambah pengaturan baru</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-[220px_1fr]">
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="key_baru" className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 font-mono text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <input value={raw} onChange={(e) => setRaw(e.target.value)} placeholder='nilai JSON, mis. true / "teks" / 123' spellCheck={false} className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 font-mono text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white" />
      </div>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi (opsional)" className="mt-2 w-full rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white" />
      <button type="submit" disabled={busy} className="mt-3 rounded-2xl bg-[#123f38] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
        {busy ? 'Menambah…' : 'Tambah pengaturan'}
      </button>
      {message && <p className={`mt-2 text-sm ${message.ok ? 'text-[#146355]' : 'text-red-700'}`}>{message.text}</p>}
    </form>
  );
}
