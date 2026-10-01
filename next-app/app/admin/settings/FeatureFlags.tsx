'use client';

// Seksi "Feature Flags" untuk /admin/settings.
// Flag disimpan di tabel site_settings (value JSON boolean) dan diubah lewat
// server action upsertSetting — yang SUDAH audit-logged (admin.settings.upsert).
// Perubahan berlaku ≤60 detik (cache flag 30–60 detik di middleware/helper).

import { useState } from 'react';
import { upsertSetting } from '@/lib/admin/actions';

export interface KnownFlag {
  key: string;
  label: string;
  description: string;
  /** Nilai bila key belum ada di database. */
  defaultValue: boolean;
}

export const KNOWN_FLAGS: KnownFlag[] = [
  {
    key: 'facebook_login_enabled',
    label: 'Login Facebook',
    description:
      'Tampilkan tombol "Lanjutkan dengan Facebook" di /login & /signup. ' +
      'PENTING: provider Facebook juga harus di-enable di dashboard Supabase — ' +
      'tanpa itu, tombol yang menyala hanya memunculkan error "Unsupported provider".',
    defaultValue: false,
  },
];

interface FlagState {
  value: boolean;
  updated_at: string | null;
  exists: boolean;
}

export function FeatureFlagsSection({ initial }: { initial: Record<string, FlagState> }) {
  return (
    <section aria-label="Feature flags">
      <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Feature flags</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {KNOWN_FLAGS.map((flag) => (
          <FlagToggle key={flag.key} flag={flag} initial={initial[flag.key]} />
        ))}
      </div>
      <p className="mt-3 text-xs text-[#78948c]">
        Setiap perubahan toggle dicatat di audit trail (<code>admin.settings.upsert</code>) dan berlaku ≤60 detik tanpa deploy ulang.
      </p>
    </section>
  );
}

function FlagToggle({ flag, initial }: { flag: KnownFlag; initial?: FlagState }) {
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState(initial?.value ?? flag.defaultValue);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const toggle = () => {
    const next = !current;
    if (!window.confirm(`${next ? 'NYALAKAN' : 'MATIKAN'} flag "${flag.label}"? Berlaku ≤60 detik.`)) return;
    setBusy(true);
    setMessage(null);
    upsertSetting(flag.key, JSON.stringify(next), flag.description)
      .then((r) => {
        if (r.ok) {
          setCurrent(next);
          setMessage({ ok: true, text: `Flag ${next ? 'menyala' : 'mati'}.` });
        } else {
          setMessage({ ok: false, text: r.error });
        }
      })
      .catch(() => setMessage({ ok: false, text: 'Terjadi kesalahan tak terduga.' }))
      .finally(() => setBusy(false));
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-extrabold text-[#123f38] dark:text-white">{flag.label}</h3>
          <code className="rounded-lg bg-[#eef4f1] px-2 py-0.5 font-mono text-[11px] text-[#55736b] dark:bg-white/10 dark:text-white/70">
            {flag.key}
          </code>
          {!initial?.exists && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
              belum ada di DB — memakai default
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs leading-5 text-[#78948c]">{flag.description}</p>
        {message && <p className={`mt-2 text-sm ${message.ok ? 'text-[#146355]' : 'text-red-700'}`}>{message.text}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={current}
        aria-label={`Toggle ${flag.label}`}
        disabled={busy}
        onClick={toggle}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
          current ? 'bg-[#1b806f]' : 'bg-[#d7e3de] dark:bg-white/15'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${current ? 'left-6' : 'left-1'}`}
        />
      </button>
    </div>
  );
}
