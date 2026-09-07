import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link className="brand-lockup" href="/" aria-label="SUKI Platforms — Ekosistem Digital SultraKita">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 40 40" role="presentation">
          <path d="M20 3.5 23.2 16.8 36.5 20l-13.3 3.2L20 36.5l-3.2-13.3L3.5 20l13.3-3.2L20 3.5Z" fill="currentColor" opacity=".18" />
          <path d="M20 8.5c-5.2 0-8.5 2.2-8.5 5.6 0 3.1 2.4 4.6 7.4 5.7 3.2.7 4.5 1.2 4.5 2.3 0 1.2-1.4 1.9-3.8 1.9-2.8 0-5.1-.8-7.1-2.5l-2.2 3.3c2.3 2 5.5 3.1 9.2 3.1 5.6 0 9-2.4 9-6.2 0-3.3-2.5-4.8-7.6-5.9-3-.6-4.3-1.1-4.3-2.1 0-1.1 1.2-1.7 3.4-1.7 2.3 0 4.2.6 6.1 1.9l2-3.4c-2-1.3-4.8-2-8.1-2Z" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-wordmark">
        <strong>SUKI</strong>
        <small>by SultraKita</small>
      </span>
    </Link>
  );
}
