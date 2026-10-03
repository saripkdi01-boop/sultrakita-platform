type StatusConfig = { label: string; background: string; color: string; border: string };

const soft = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, var(--sb-surface, var(--theme-surface)))`;
const softBorder = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;

const CONFIG: Record<string, StatusConfig> = {
  draft: {
    label: 'Draf',
    background: 'var(--theme-surface-soft)',
    color: 'var(--theme-text-muted)',
    border: 'var(--theme-border)',
  },
  pending: {
    label: 'Menunggu Kurasi',
    background: soft('--theme-warning', 14),
    color: 'var(--theme-warning)',
    border: softBorder('--theme-warning', 40),
  },
  approved: {
    label: 'Tayang',
    background: soft('--theme-success', 12),
    color: 'var(--theme-success)',
    border: softBorder('--theme-success', 40),
  },
  rejected: {
    label: 'Ditolak',
    background: soft('--theme-danger', 10),
    color: 'var(--theme-danger)',
    border: softBorder('--theme-danger', 40),
  },
};

const FALLBACK: StatusConfig = {
  label: 'Tidak diketahui',
  background: 'var(--theme-surface-soft)',
  color: 'var(--theme-text-muted)',
  border: 'var(--theme-border)',
};

/** Badge status bisnis dengan label Bahasa Indonesia. Server component. */
export default function StatusBadge({ status }: { status: string | null | undefined }) {
  const key = (status ?? '').toLowerCase();
  const cfg = CONFIG[key] ?? { ...FALLBACK, label: status ? String(status) : FALLBACK.label };
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
        background: cfg.background,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flex: 'none' }} />
      {cfg.label}
    </span>
  );
}
