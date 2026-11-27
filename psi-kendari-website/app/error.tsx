"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold">Terjadi kendala saat memuat halaman</h1>
      <p className="mt-3 text-muted">Silakan coba lagi beberapa saat lagi. Bila berlanjut, buka beranda.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-red px-5 py-3 font-extrabold text-white hover:bg-red-strong">
          Coba lagi
        </button>
        <Link href="/" className="rounded-full border border-border px-5 py-3 font-extrabold hover:border-red">
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
