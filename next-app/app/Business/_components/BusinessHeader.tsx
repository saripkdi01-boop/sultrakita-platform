import Link from 'next/link';

/** Header konsisten untuk halaman auth /Business (server component). */
export default function BusinessHeader({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <header className="suki-business-nav">
      <Link href="/Business" className="suki-business-brand" aria-label="Kembali ke halaman SUKI Business">
        <span className="suki-business-mark" aria-hidden="true">
          S
        </span>
        <span>
          <strong>SUKI</strong>
          <small>Business</small>
        </span>
      </Link>
      <nav aria-label="Navigasi SUKI Business">
        <Link href="/Business#cara-kerja">Cara kerja</Link>
        <Link href="/Business#ruang-tumbuh">Ruang tumbuh</Link>
        <Link href="/Business#paket">Paket</Link>
      </nav>
      <div className="suki-business-nav-actions">
        <Link href="/Business/dashboard" className="suki-business-login">
          Dashboard
        </Link>
        {!hideCta && (
          <Link href="/Business/daftar" className="suki-business-button suki-business-button-dark">
            Daftarkan bisnis
          </Link>
        )}
      </div>
    </header>
  );
}
