import { Server, GitBranch, Database } from 'lucide-react';

/**
 * Command Center v2 — status deployment & konektivitas.
 * Semua nilai berasal dari environment runtime Vercel atau hasil query
 * halaman ini; tidak ada yang dikarang. Di luar Vercel (lokal/dev),
 * kolom deployment menampilkan "lingkungan lokal".
 */
export function SystemStatus({ dbOk }: { dbOk: boolean }) {
  const env = process.env.VERCEL_ENV ?? null;
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null;
  const isVercel = Boolean(env);

  const rows: Array<{ icon: typeof Server; label: string; value: string; tone: 'ok' | 'warn' | 'muted' }> = [
    {
      icon: Server,
      label: 'Lingkungan',
      value: env === 'production' ? 'Production' : env === 'preview' ? 'Preview' : isVercel ? env ?? 'Vercel' : 'Lokal / dev',
      tone: env === 'production' ? 'ok' : 'muted',
    },
    {
      icon: GitBranch,
      label: 'Deploy',
      value: sha ? `${sha.slice(0, 7)}${message ? ` — ${message.slice(0, 60)}` : ''}` : 'tidak terdeteksi (bukan di Vercel)',
      tone: sha ? 'ok' : 'warn',
    },
    {
      icon: Database,
      label: 'Database',
      value: dbOk ? 'Terhubung — query halaman ini berhasil' : 'Gagal dibaca saat halaman dimuat',
      tone: dbOk ? 'ok' : 'warn',
    },
  ];

  const toneClasses = {
    ok: 'text-[#1b806f] dark:text-[#7fd6bd]',
    warn: 'text-amber-600 dark:text-amber-300',
    muted: 'text-[#55736b] dark:text-[#9db8b0]',
  } as const;

  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">Status sistem</p>
      <ul className="mt-4 space-y-3">
        {rows.map(({ icon: Icon, label, value, tone }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eef6f3] text-[#1b806f] dark:bg-white/5 dark:text-white">
              <Icon size={15} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#78948c]">{label}</span>
              <span className={`block truncate text-sm font-bold ${toneClasses[tone]}`} title={value}>
                {value}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-[#78948c]">
        Kuota deploy harian &amp; status cron dipantau dari dasbor Vercel — tidak ditampilkan di sini agar tidak mengarang.
      </p>
    </div>
  );
}
