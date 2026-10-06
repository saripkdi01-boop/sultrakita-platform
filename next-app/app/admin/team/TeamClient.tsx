'use client';

// FASE B5 — UI manajemen tim (client). Khusus super_admin.

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { listStaff, findUserByEmail, setUserRole, type StaffRow, type FoundUser } from './actions';

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  support: 'Support',
  user: 'User biasa',
};

export function TeamClient({ initial }: { initial: StaffRow[] }) {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffRow[]>(initial);
  const [email, setEmail] = useState('');
  const [found, setFound] = useState<FoundUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');

  async function refresh() {
    const res = await listStaff();
    if (res.ok && res.data) setStaff(res.data);
    router.refresh();
  }

  async function search(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setNotice('');
    setFound(null);
    const res = await findUserByEmail(email);
    setBusy(false);
    if (!res.ok) setErr(res.error || 'Gagal.');
    else if (res.data) setFound(res.data);
  }

  async function grant(userId: string, role: string) {
    const label = ROLE_LABEL[role] ?? role;
    if (!window.confirm(`Ubah role pengguna ini menjadi "${label}"? Tercatat di audit trail.`)) return;
    setBusy(true);
    setErr('');
    const res = await setUserRole(userId, role);
    setBusy(false);
    if (!res.ok) {
      setErr(res.error || 'Gagal.');
      return;
    }
    setNotice(`Role diubah menjadi ${label}.`);
    setFound(null);
    setEmail('');
    await refresh();
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="h-fit rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
        <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Cari pengguna</h2>
        <p className="mt-1 text-xs leading-5 text-[#78948c]">Cari berdasarkan email untuk memberi/mencabut role staf.</p>
        <form onSubmit={(e) => void search(e)} className="mt-4 flex gap-2">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="nama@email.com"
            className="w-full rounded-xl border border-[#dcebe5] px-4 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
          />
          <button type="submit" disabled={busy}
            className="shrink-0 rounded-xl bg-[#123f38] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1b5a50] disabled:opacity-50">
            {busy ? '…' : 'Cari'}
          </button>
        </form>
        {err && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        {notice && <p className="mt-3 rounded-xl bg-[#e9f7f2] p-3 text-sm text-[#146355]">{notice}</p>}
        {found && (
          <div className="mt-4 rounded-2xl border border-[#eef4f1] p-4 dark:border-white/10">
            <p className="font-extrabold text-[#123f38] dark:text-white">{found.display_name || found.email}</p>
            <p className="font-mono text-xs text-[#78948c]">{found.email}</p>
            <p className="mt-1 text-xs text-[#78948c]">Role saat ini: <strong>{ROLE_LABEL[found.role] ?? found.role}</strong></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['super_admin', 'admin', 'moderator', 'support'].map((r) => (
                <button key={r} disabled={busy || found.role === r} onClick={() => void grant(found.id, r)}
                  className="rounded-lg border border-[#dcebe5] px-3 py-1.5 text-xs font-bold text-[#1b806f] hover:bg-[#e9f7f2] disabled:opacity-40">
                  {ROLE_LABEL[r]}
                </button>
              ))}
              {found.role !== 'user' && (
                <button disabled={busy} onClick={() => void grant(found.id, 'user')}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-40">
                  Cabut (→ user)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
        <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Tim saat ini ({staff.length})</h2>
        {staff.length === 0 ? (
          <p className="mt-4 text-sm text-[#78948c]">Belum ada staf selain Anda, atau service-role belum terpasang.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#eef4f1] dark:divide-white/10">
            {staff.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-bold text-[#123f38] dark:text-white">
                    {s.display_name || s.full_name || 'Tanpa nama'}
                    {s.is_suspended && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">suspended</span>}
                  </p>
                  <p className="font-mono text-xs text-[#78948c]">{s.email || s.id.slice(0, 8) + '…'}</p>
                </div>
                <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-extrabold text-[#2b4f9e]">
                  {ROLE_LABEL[s.role] ?? s.role}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 border-t border-[#eef4f1] pt-3 text-[11px] leading-5 text-[#78948c] dark:border-white/10">
          Setiap perubahan role tercatat di audit trail (<code>user.role.grant</code>/<code>user.role.revoke</code>).
          Anda tidak bisa menurunkan role diri sendiri.
        </p>
      </div>
    </div>
  );
}
