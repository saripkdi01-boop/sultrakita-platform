'use client';

// Komponen aksi untuk halaman detail pengguna admin (dipakai di [id]/page.tsx).
// Semua aksi memanggil server action di @/lib/admin/actions (otorisasi server-side)
// dan wajib menyertakan alasan sebelum konfirmasi.

import { useState, type FormEvent } from 'react';
import { suspendUser, restoreUser, changeUserRole, saveAdminNotes } from '@/lib/admin/actions';

function useAction() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  async function run(fn: () => Promise<{ ok: true } | { ok: false; error: string }>, confirmText: string) {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await fn();
      if (result.ok) {
        setIsError(false);
        setMessage('Berhasil. Halaman akan dimuat ulang.');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setIsError(true);
        setMessage(result.error);
      }
    } catch {
      setIsError(true);
      setMessage('Terjadi kesalahan tak terduga.');
    } finally {
      setBusy(false);
    }
  }
  return { message, isError, busy, run };
}

function Feedback({ message, isError }: { message: string | null; isError: boolean }) {
  if (!message) return null;
  return (
    <p className={`mt-3 rounded-xl p-3 text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-[#e9f7f2] text-[#146355]'}`}>
      {message}
    </p>
  );
}

export function SuspendActions({ userId, isSuspended }: { userId: string; isSuspended: boolean }) {
  const { message, isError, busy, run } = useAction();
  const [reason, setReason] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      alert('Alasan wajib diisi (min. 3 karakter).');
      return;
    }
    if (isSuspended) {
      void run(() => restoreUser(userId, reason.trim()), 'Pulihkan akun pengguna ini?');
    } else {
      void run(() => suspendUser(userId, reason.trim()), 'Tangguhkan akun pengguna ini? Ia tidak bisa login sampai dipulihkan.');
    }
  };
  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">{isSuspended ? 'Pulihkan akun' : 'Tangguhkan akun'}</h2>
      <p className="mt-1 text-xs text-[#78948c]">
        {isSuspended
          ? 'Akun yang dipulihkan bisa login kembali seperti biasa.'
          : 'Akun yang ditangguhkan tidak bisa login sampai dipulihkan. Aksi ini dicatat di audit trail.'}
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Alasan (wajib) — mis. melanggar ketentuan komunitas…"
        rows={3}
        className="mt-3 w-full rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <button
        type="submit"
        disabled={busy}
        className={`mt-3 rounded-2xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${
          isSuspended ? 'bg-[#1b806f] hover:bg-[#146355]' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {busy ? 'Memproses…' : isSuspended ? 'Pulihkan akun' : 'Tangguhkan akun'}
      </button>
      <Feedback message={message} isError={isError} />
    </form>
  );
}

export function RoleActions({ userId, currentRole }: { userId: string; currentRole: string | null }) {
  const { message, isError, busy, run } = useAction();
  const [role, setRole] = useState(currentRole ?? 'user');
  const [reason, setReason] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      alert('Alasan wajib diisi (min. 3 karakter).');
      return;
    }
    void run(() => changeUserRole(userId, role, reason.trim()), `Ubah peran menjadi "${role}"? Aksi sensitif — dicatat di audit trail.`);
  };
  return (
    <form onSubmit={submit} className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Ubah peran</h2>
      <p className="mt-1 text-xs text-[#78948c]">Hanya super_admin yang bisa mengubah peran. Perubahan peran dicatat di audit trail.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm dark:border-white/10 dark:bg-[#10231f] dark:text-white"
        >
          {['user', 'buyer', 'seller', 'creator', 'community', 'moderator', 'support', 'admin', 'super_admin'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Alasan perubahan peran (wajib)"
          className="flex-1 rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <button type="submit" disabled={busy} className="rounded-2xl bg-[#123f38] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {busy ? 'Memproses…' : 'Ubah peran'}
        </button>
      </div>
      <Feedback message={message} isError={isError} />
    </form>
  );
}

export function NotesForm({ userId, initialNotes }: { userId: string; initialNotes: string | null }) {
  const { message, isError, busy, run } = useAction();
  const [notes, setNotes] = useState(initialNotes ?? '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(() => saveAdminNotes(userId, notes), 'Simpan catatan internal? Hanya terlihat oleh tim admin.');
  };
  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Catatan internal</h2>
      <p className="mt-1 text-xs text-[#78948c]">Hanya terlihat oleh tim admin. Tidak ditampilkan ke pengguna.</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Tulis catatan internal tentang pengguna ini…"
        className="mt-3 w-full rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <button type="submit" disabled={busy} className="mt-3 rounded-2xl bg-[#1b806f] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#146355]">
        {busy ? 'Menyimpan…' : 'Simpan catatan'}
      </button>
      <Feedback message={message} isError={isError} />
    </form>
  );
}
