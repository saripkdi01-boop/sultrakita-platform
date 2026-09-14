'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin-error-boundary]', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5faf7] p-6">
      <section className="w-full max-w-md rounded-3xl border border-[#dcebe5] bg-white p-7 text-center shadow-xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1b806f]">SUKI Operations Center</p>
        <h1 className="mt-3 text-2xl font-extrabold text-[#123f38]">Dashboard belum dapat dimuat</h1>
        <p className="mt-3 text-sm leading-6 text-[#55736b]">
          Terjadi kendala pada komponen dashboard atau sesi akun. Coba muat ulang, atau login kembali jika sesi sudah kedaluwarsa.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => reset()} className="rounded-xl bg-[#123f38] px-4 py-3 text-sm font-bold text-white hover:bg-[#1b806f]">
            Coba lagi
          </button>
          <button type="button" onClick={() => { window.location.href = '/login?redirect=/admin/dashboard'; }} className="rounded-xl border border-[#c7ded5] px-4 py-3 text-sm font-bold text-[#123f38] hover:bg-[#f5faf7]">
            Login ulang
          </button>
        </div>
        {error.digest && <p className="mt-5 text-xs text-[#78948c]">Kode diagnostik: {error.digest}</p>}
      </section>
    </main>
  );
}
