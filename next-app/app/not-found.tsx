import type { Metadata } from 'next';
import ErrorShell from '@/components/seo/ErrorShell';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan — SukiApps',
  description: 'Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.',
  robots: { index: false, follow: false },
};

/**
 * Halaman 404 ber-branding SukiApps (P1-3 LAUNCH_AUDIT).
 * Copy Bahasa Indonesia; tanpa stack trace; selalu ada jalan keluar.
 */
export default function NotFound() {
  return (
    <ErrorShell
      code="404"
      title="Halaman tidak ditemukan"
      description={
        <>
          Maaf, alamat yang Anda tuju tidak ada atau sudah dipindahkan. Mungkin tautannya
          kedaluwarsa, atau Anda salah ketik. Jelajahi kembali ekosistem SukiApps dari beranda.
        </>
      }
      actions={[
        { label: 'Kembali ke Beranda', href: '/', primary: true },
        { label: 'Jelajahi Marketplace', href: '/marketplace' },
        { label: 'Lihat Lowongan Kerja', href: '/jobs' },
        { label: 'Butuh bantuan? Hubungi Dukungan', href: '/support' },
      ]}
      footnote={
        <>
          Jika Anda yakin halaman ini seharusnya ada,{' '}
          <a href="/support" style={{ color: '#0e6258', fontWeight: 700 }}>
            laporkan kepada kami
          </a>{' '}
          beserta alamat yang Anda akses.
        </>
      }
    />
  );
}
