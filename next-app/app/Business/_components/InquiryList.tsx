'use client';

import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export type InquiryItem = {
  id: string;
  nama: string;
  kontak: string;
  pesan: string;
  status: string;
  created_at: string;
};

const STATUS_KEYS: Record<string, 'bInqNew' | 'bInqRead' | 'bInqReplied' | 'bInqArchived'> = {
  new: 'bInqNew',
  read: 'bInqRead',
  replied: 'bInqReplied',
  archived: 'bInqArchived',
};

const soft = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, var(--sb-surface, var(--theme-surface)))`;

const STATUS_COLORS: Record<string, { background: string; color: string }> = {
  new: { background: soft('--theme-warning', 14), color: 'var(--theme-warning)' },
  read: { background: soft('--theme-success', 12), color: 'var(--theme-success)' },
  replied: { background: 'color-mix(in srgb, #2f7ea8 12%, var(--sb-surface, var(--theme-surface)))', color: 'var(--theme-primary)' },
  archived: { background: 'var(--theme-surface-soft)', color: 'var(--theme-text-muted)' },
};

/** Normalisasi satu inquiry dari API menjadi bentuk tampilan (toleran terhadap variasi nama kolom). */
export function normalizeInquiry(raw: unknown): InquiryItem {
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    id: str(r.id) || str(r.inquiry_id),
    nama: str(r.nama) || str(r.name) || str(r.pengirim) || 'Pengunjung',
    kontak: str(r.kontak) || str(r.contact) || str(r.email) || str(r.telepon) || str(r.whatsapp) || '—',
    pesan: str(r.pesan) || str(r.message) || str(r.isi),
    status: str(r.status) || 'new',
    created_at: str(r.created_at) || str(r.createdAt),
  };
}

function formatTime(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Daftar pertanyaan masuk — murni presentasional. */
export default function InquiryList({ items }: { items: InquiryItem[] }) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  if (items.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          padding: '18px 16px',
          borderRadius: 14,
          border: '1px dashed var(--sb-line)',
          background: 'var(--sb-surface-soft)',
          color: 'var(--sb-muted)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        {b.bInqEmpty}
      </p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
      {items.map((item) => {
        const color = STATUS_COLORS[item.status] ?? STATUS_COLORS.new;
        const statusKey = STATUS_KEYS[item.status];
        const label = statusKey ? b[statusKey] : item.status;
        const time = formatTime(item.created_at);
        return (
          <li
            key={item.id || `${item.nama}-${item.created_at}`}
            style={{
              border: '1px solid var(--sb-line)',
              borderRadius: 14,
              padding: '14px 16px',
              background: 'var(--sb-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: 14, color: 'var(--sb-ink)' }}>{item.nama}</strong>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: color.background,
                  color: color.color,
                }}
              >
                {label}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--sb-muted)' }}>
              {item.kontak}
              {time ? ` · ${time}` : ''}
            </p>
            {item.pesan && (
              <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--sb-ink)', whiteSpace: 'pre-wrap' }}>
                {item.pesan}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
