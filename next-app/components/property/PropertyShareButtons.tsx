'use client';

import { useState } from 'react';
import { Check, Link2, MessageCircle, Share2 } from 'lucide-react';

// Tombol share ala portal properti: WhatsApp, salin link, X.
// Tanpa klaim palsu — hanya membagikan URL + judul asli listing.
export default function PropertyShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const [nativeFailed, setNativeFailed] = useState(false);
  const url = typeof window === 'undefined' ? path : `${window.location.origin}${path}`;
  const text = `${title} — SUKI Properti`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: pilih manual via prompt bila clipboard API diblokir.
      window.prompt('Salin link properti:', url);
    }
  }

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await (navigator as any).share({ title: text, text, url });
        return;
      } catch {
        // Dibatalkan user atau gagal — tampilkan tombol manual.
      }
    }
    setNativeFailed(true);
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Bagikan properti">
      {!nativeFailed ? (
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sultra-teal hover:text-sultra-teal dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Share2 size={16} aria-hidden="true" /> Bagikan
        </button>
      ) : (
        <>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            aria-label="Bagikan via WhatsApp"
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-700"
            aria-label="Bagikan via X"
          >
            𝕏 <span className="sr-only">X</span>
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sultra-teal hover:text-sultra-teal dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Salin link properti"
          >
            {copied ? <Check size={16} aria-hidden="true" className="text-emerald-600" /> : <Link2 size={16} aria-hidden="true" />}
            {copied ? 'Tersalin!' : 'Salin link'}
          </button>
        </>
      )}
    </div>
  );
}
