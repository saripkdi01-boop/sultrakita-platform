'use client';

// FASE B4 — UI kelola pengumuman (client). Daftar + form buat + toggle + hapus.

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createAnnouncement, toggleAnnouncement, deleteAnnouncement } from './actions';

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string | null;
}

function fmt(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Makassar', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function AnnouncementsClient({ initial }: { initial: AnnouncementRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setNotice('');
    const res = await createAnnouncement({ title, body, link_url: linkUrl, ends_at: endsAt || undefined });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error || 'Gagal.');
      return;
    }
    setTitle('');
    setBody('');
    setLinkUrl('');
    setEndsAt('');
    setNotice('Pengumuman diterbitkan — tampil di seluruh situs dalam ±60 detik.');
    router.refresh();
  }

  async function toggle(row: AnnouncementRow) {
    const res = await toggleAnnouncement(row.id, !row.is_active);
    if (!res.ok) setErr(res.error || 'Gagal.');
    else router.refresh();
  }

  async function remove(row: AnnouncementRow) {
    if (!window.confirm(`Hapus pengumuman "${row.title}"?`)) return;
    const res = await deleteAnnouncement(row.id);
    if (!res.ok) setErr(res.error || 'Gagal.');
    else router.refresh();
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={(e) => void submit(e)} className="h-fit rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
        <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Pengumuman baru</h2>
        <p className="mt-1 text-xs leading-5 text-[#78948c]">Tampil sebagai banner di seluruh situs (bisa ditutup tiap pengguna).</p>
        <label className="mt-4 block text-sm font-bold text-[#123f38] dark:text-white">
          Judul
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required
            className="mt-1 w-full rounded-xl border border-[#dcebe5] px-4 py-2.5 text-sm font-normal dark:border-white/10 dark:bg-white/5" placeholder="mis. Maintenance terjadwal" />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#123f38] dark:text-white">
          Isi
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} required rows={3}
            className="mt-1 w-full rounded-xl border border-[#dcebe5] px-4 py-2.5 text-sm font-normal dark:border-white/10 dark:bg-white/5" placeholder="mis. SUKI Apps perawatan Sabtu 02:00–04:00 WITA." />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#123f38] dark:text-white">
          Link (opsional)
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} maxLength={500}
            className="mt-1 w-full rounded-xl border border-[#dcebe5] px-4 py-2.5 text-sm font-normal dark:border-white/10 dark:bg-white/5" placeholder="/help-center atau https://…" />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#123f38] dark:text-white">
          Berakhir (opsional)
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dcebe5] px-4 py-2.5 text-sm font-normal dark:border-white/10 dark:bg-white/5" />
        </label>
        {err && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        {notice && <p className="mt-3 rounded-xl bg-[#e9f7f2] p-3 text-sm text-[#146355]">{notice}</p>}
        <button type="submit" disabled={busy}
          className="mt-4 w-full rounded-xl bg-[#123f38] py-2.5 text-sm font-bold text-white transition hover:bg-[#1b5a50] disabled:opacity-50">
          {busy ? 'Menerbitkan…' : 'Terbitkan pengumuman'}
        </button>
      </form>

      <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
        <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Daftar pengumuman</h2>
        {initial.length === 0 ? (
          <p className="mt-4 text-sm text-[#78948c]">Belum ada pengumuman.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {initial.map((row) => (
              <li key={row.id} className="rounded-2xl border border-[#eef4f1] p-4 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold text-[#123f38] dark:text-white">{row.title}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${row.is_active ? 'bg-[#e9f7f2] text-[#146355]' : 'bg-gray-100 text-gray-600'}`}>
                    {row.is_active ? 'aktif' : 'non-aktif'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#55736b] dark:text-white/70">{row.body}</p>
                <p className="mt-1 text-[11px] text-[#9db5ad]">
                  {fmt(row.starts_at)} → {row.ends_at ? fmt(row.ends_at) : 'tanpa batas'}
                  {row.link_url && <span className="ml-2 font-mono">{row.link_url}</span>}
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => void toggle(row)}
                    className="rounded-lg border border-[#dcebe5] px-3 py-1.5 text-xs font-bold text-[#55736b] hover:bg-[#f3f8f6]">
                    {row.is_active ? 'Non-aktifkan' : 'Aktifkan'}
                  </button>
                  <button onClick={() => void remove(row)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50">
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
