import Link from 'next/link';
import { UserPlus, Tag, Bug, ShieldCheck, Flag } from 'lucide-react';

export type ActivityKind = 'user' | 'listing' | 'error' | 'audit' | 'report';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail?: string | null;
  /** ISO timestamp, boleh null bila tidak ada */
  at: string | null;
  href?: string;
}

const KIND_META: Record<ActivityKind, { icon: typeof UserPlus; label: string; classes: string }> = {
  user: { icon: UserPlus, label: 'Pengguna', classes: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
  listing: { icon: Tag, label: 'Listing', classes: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' },
  error: { icon: Bug, label: 'Error', classes: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' },
  audit: { icon: ShieldCheck, label: 'Aksi admin', classes: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
  report: { icon: Flag, label: 'Laporan', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
};

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      timeZone: 'Asia/Makassar',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Command Center v2 — satu timeline aktivitas terbaru lintas tabel.
 * Data nyata dari database; bila suatu sumber gagal dibaca, feed hanya
 * menampilkan yang tersedia (tidak dikarang).
 */
export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">
          Aktivitas terbaru
        </p>
        <span className="text-xs text-[#78948c]">
          {items.length > 0 ? `${items.length} kejadian` : 'belum ada data'}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[#55736b] dark:text-[#9db8b0]">
          Belum ada aktivitas tercatat dari sumber yang bisa dibaca.
        </p>
      ) : (
        <ol className="mt-4 space-y-1">
          {items.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;
            const body = (
              <>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.classes}`}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#123f38] dark:text-white">
                    {item.title}
                  </span>
                  <span className="block text-xs text-[#78948c]">
                    {meta.label}
                    {item.detail ? ` · ${item.detail}` : ''} · {formatTime(item.at)}
                  </span>
                </span>
              </>
            );
            return (
              <li key={`${item.kind}-${item.id}`}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-[#f3f8f6] dark:hover:bg-white/5"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl px-2 py-2">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-4 text-xs text-[#78948c]">Data nyata dari database, diurutkan waktu terbaru.</p>
    </div>
  );
}
