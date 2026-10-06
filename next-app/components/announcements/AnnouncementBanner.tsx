'use client';

// FASE B4 — Banner pengumuman broadcast (dismissible per item via localStorage).
// Dipasang di AppLayout; mengambil dari /api/announcements/active (publik, cache 60 dtk).

import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
}

const DISMISS_KEY = 'suki_ann_dismissed_v1';

function readDismissed(): string[] {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function AnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/announcements/active', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { ok?: boolean; data?: Announcement[] };
        if (!mounted || !json.ok || !Array.isArray(json.data)) return;
        const dismissed = readDismissed();
        setItems(json.data.filter((a) => a?.id && dismissed.indexOf(a.id) === -1).slice(0, 3));
      } catch {
        // Gagal diam-diam: banner tidak boleh mengganggu situs.
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  function dismiss(id: string) {
    try {
      const prev = readDismissed();
      const next = (prev.indexOf(id) === -1 ? [...prev, id] : prev).slice(-20);
      localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    } catch {
      // Abaikan.
    }
    setItems((cur) => cur.filter((a) => a.id !== id));
  }

  if (items.length === 0) return null;

  return (
    <div role="region" aria-label="Pengumuman" className="border-b border-[#d9b93c]/40 bg-[#fff8e1] dark:border-[#d9b93c]/20 dark:bg-[#2a2410]">
      {items.map((a) => (
        <div key={a.id} className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5">
          <Megaphone size={16} className="mt-0.5 shrink-0 text-[#8a6d1b] dark:text-[#e8c95a]" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-[13px] leading-5 text-[#5c4a12] dark:text-[#f0df9e]">
            <strong>{a.title}</strong>
            {a.body && <span> — {a.body}</span>}
            {a.link_url && (
              <a
                href={a.link_url}
                target={a.link_url.startsWith('/') ? undefined : '_blank'}
                rel="noreferrer"
                className="ml-2 font-bold underline"
              >
                {a.link_label || 'Selengkapnya'}
              </a>
            )}
          </p>
          <button
            onClick={() => dismiss(a.id)}
            aria-label="Tutup pengumuman"
            className="shrink-0 rounded-lg p-1 text-[#8a6d1b] transition hover:bg-black/5 dark:text-[#e8c95a]"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
