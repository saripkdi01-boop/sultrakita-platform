import BusinessNav from './BusinessNav';

/** Header konsisten untuk halaman auth /Business (server component). */
export default function BusinessHeader({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <BusinessNav
      links={[
        { href: '/Business#cara-kerja', label: 'Cara kerja' },
        { href: '/Business#ruang-tumbuh', label: 'Ruang tumbuh' },
        { href: '/Business#paket', label: 'Paket' },
      ]}
      actions={[{ href: '/Business/dashboard', label: 'Dashboard' }]}
      hideCta={hideCta}
    />
  );
}
