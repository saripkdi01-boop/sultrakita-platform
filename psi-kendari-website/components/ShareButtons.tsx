"use client";

import { useState } from "react";
import { IconLink } from "./icons";

/** Tombol bagikan: salin tautan, WhatsApp, X, Facebook (tanpa skrip pihak ketiga). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Salin tautan ini:", url);
    }
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-red hover:text-red-ink";
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Bagikan">
      <span className="text-xs font-bold uppercase tracking-widest text-muted">Bagikan</span>
      <button type="button" onClick={copy} className={btn}>
        <IconLink size={14} /> {copied ? "Tautan disalin" : "Salin tautan"}
      </button>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
          {l.label}
          <span className="sr-only"> (membuka tab baru)</span>
        </a>
      ))}
      <span aria-live="polite" className="sr-only">
        {copied ? "Tautan telah disalin ke papan klip" : ""}
      </span>
    </div>
  );
}
