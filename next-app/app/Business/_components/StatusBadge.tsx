type StatusConfig = { label: string; background: string; color: string; border: string };

const CONFIG: Record<string, StatusConfig> = {
  draft: { label: 'Draf', background: '#f1f4f3', color: '#5c6b66', border: '#dfe6e3' },
  pending: { label: 'Menunggu Kurasi', background: '#fdf3e0', color: '#8a5f0e', border: '#f0d9a8' },
  approved: { label: 'Tayang', background: '#e7f3ef', color: '#0e6258', border: '#c4e2d7' },
  rejected: { label: 'Ditolak', background: '#fdecea', color: '#b3261e', border: '#f5c6c1' },
};

const FALLBACK: StatusConfig = { label: 'Tidak diketahui', background: '#f1f4f3', color: '#5c6b66', border: '#dfe6e3' };

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
