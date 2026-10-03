'use client';

import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

type StatusStyle = { background: string; color: string; border: string };

const soft = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, var(--sb-surface, var(--theme-surface)))`;
const softBorder = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;

const CONFIG: Record<string, StatusStyle> = {
  draft: {
    background: 'var(--theme-surface-soft)',
    color: 'var(--theme-text-muted)',
    border: 'var(--theme-border)',
  },
  pending: {
    background: soft('--theme-warning', 14),
    color: 'var(--theme-warning)',
    border: softBorder('--theme-warning', 40),
  },
  approved: {
    background: soft('--theme-success', 12),
    color: 'var(--theme-success)',
    border: softBorder('--theme-success', 40),
  },
  rejected: {
    background: soft('--theme-danger', 10),
    color: 'var(--theme-danger)',
    border: softBorder('--theme-danger', 40),
  },
};

const STATUS_KEYS: Record<string, 'bStatusDraft' | 'bStatusPending' | 'bStatusApproved' | 'bStatusRejected'> = {
  draft: 'bStatusDraft',
  pending: 'bStatusPending',
  approved: 'bStatusApproved',
  rejected: 'bStatusRejected',
};

const FALLBACK: StatusStyle = {
  background: 'var(--theme-surface-soft)',
  color: 'var(--theme-text-muted)',
  border: 'var(--theme-border)',
};

/** Badge status bisnis. Client component agar label mengikuti bahasa aktif. */
export default function StatusBadge({ status }: { status: string | null | undefined }) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  const key = (status ?? '').toLowerCase();
  const style = CONFIG[key] ?? FALLBACK;
  const statusKey = STATUS_KEYS[key];
  const label = statusKey ? b[statusKey] : status ? String(status) : b.bStatusUnknown;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 13px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        background: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: style.color, flex: 'none' }} />
      {label}
    </span>
  );
}
