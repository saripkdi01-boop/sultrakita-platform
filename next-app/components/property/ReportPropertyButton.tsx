'use client';

import { reportProperty } from '@/lib/actions/reports';
import { ReportButton } from '@/components/moderation/ReportButton';

// Tombol "Laporkan" untuk halaman detail properti (/properti/[id]).
// Mengirim ke antrean moderasi admin (marketplace_reports, status pending).
export function ReportPropertyButton({ propertyId }: { propertyId: string }) {
  return (
    <ReportButton
      label="Laporkan"
      onReport={(reason) => reportProperty(propertyId, reason)}
      className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
      style={{ borderColor: 'var(--sk-line)', color: 'var(--sk-muted)' }}
    />
  );
}
