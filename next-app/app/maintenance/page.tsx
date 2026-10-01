import type { Metadata } from 'next';
import ErrorShell from '@/components/seo/ErrorShell';

export const metadata: Metadata = {
  title: 'Sedang dalam perawatan — SukiApps',
  description: 'SukiApps sedang dalam perawatan terjadwal. Kami akan segera kembali.',
  robots: { index: false, follow: false },
};

/**
 * Halaman maintenance (P2-3 LAUNCH_AUDIT).
 *
 * Catatan integrasi: mode perawatan itu sendiri dikendalikan oleh
 * `site_settings.maintenance_mode` (SLICE-B) yang dibaca middleware
 * (SLICE-A) lalu me-redirect ke /maintenance. Halaman ini murni tampilan.
 */
export default function MaintenancePage() {
  return (
    <ErrorShell
      code="503"
      title="Sedang dalam perawatan"
      description={
        <>
          SukiApps sedang menjalani perawatan terjadwal agar layanan makin cepat dan aman
          untuk warga. Terima kasih atas kesabarannya — kami akan segera kembali.
        </>
      }
      actions={[
        { label: 'Muat ulang halaman', href: '/maintenance', primary: true },
        { label: 'Hubungi Dukungan', href: '/support' },
      ]}
      footnote={
        <>
          Perawatan biasanya selesai dalam hitungan menit. Pantau kabar terbaru melalui
          kanal resmi SukiApps bila perawatan berlangsung lebih lama.
        </>
      }
    />
  );
}
