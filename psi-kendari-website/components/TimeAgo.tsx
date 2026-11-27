"use client";

import { useSyncExternalStore } from "react";
import { formatTanggal, formatTanggalWaktu, relativeTime } from "@/lib/format";

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}
const getNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerNow = () => 0;

/** Tanggal absolut saat SSR; berubah menjadi "2 jam lalu" setelah dimuat di browser. */
export function TimeAgo({ iso, className }: { iso?: string; className?: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  if (!iso) return null;
  const text = now ? relativeTime(iso, now) : formatTanggal(iso);
  return (
    <time dateTime={iso} title={formatTanggalWaktu(iso)} className={className}>
      {text}
    </time>
  );
}
