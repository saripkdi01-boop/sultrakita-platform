import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link className="brand-lockup" href="/" aria-label="SUKI Apps — by SultraKita">
      <span className="brand-symbol" aria-hidden="true">
        <img src="/suki-logo-mark.png" alt="" />
      </span>
      <span className="brand-wordmark">
        <strong>SUKI Apps</strong>
        <small>by SultraKita</small>
      </span>
    </Link>
  );
}
