import type { SVGProps } from 'react';

/* ==========================================================================
   EcosystemMarketplace — belanja lokal: pedagang, produk UMKM, keranjang,
   dan transaksi digital. viewBox 0 0 480 360.
   ========================================================================== */

type IllustProps = SVGProps<SVGSVGElement> & { title?: string };

const FOREST = '#123C35';
const TEAL = '#13A89E';
const OCEAN = '#243A58';
const GOLD = '#F3B544';
const CORAL = '#F17B51';
const CREAM = '#F7F3E8';
const BRAND_GOLD = '#D4AF37';
const SKIN = '#EBB287';

export default function EcosystemMarketplace({ title, ...props }: IllustProps) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(title
        ? { role: 'img' as const }
        : { 'aria-hidden': true as const, focusable: 'false' as const })}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="ekm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDFBF5" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="480" height="360" rx="24" fill="url(#ekm-bg)" />

      {/* Matahari kecil */}
      <circle cx="416" cy="56" r="26" fill={GOLD} />
      <circle cx="416" cy="56" r="26" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />

      {/* Lapak pedagang */}
      <g>
        {/* Tenda garis */}
        <path d="M48 96 L96 40 L336 40 L384 96 Z" fill={CREAM} stroke={OCEAN} strokeWidth="2" />
        <g>
          <path d="M80 96 L112 40 L144 40 L112 96 Z" fill={CORAL} />
          <path d="M176 96 L192 40 L224 40 L208 96 Z" fill={CORAL} />
          <path d="M272 96 L272 40 L304 40 L304 96 Z" fill={CORAL} />
        </g>
        <path d="M48 96 L96 40 L336 40 L384 96" stroke={OCEAN} strokeWidth="2" />
        {/* Tiang */}
        <line x1="64" y1="96" x2="64" y2="300" stroke={OCEAN} strokeWidth="5" />
        <line x1="368" y1="96" x2="368" y2="300" stroke={OCEAN} strokeWidth="5" />
        {/* Meja */}
        <rect x="80" y="196" width="272" height="18" rx="8" fill={OCEAN} />
        <line x1="110" y1="214" x2="110" y2="300" stroke={OCEAN} strokeWidth="5" />
        <line x1="322" y1="214" x2="322" y2="300" stroke={OCEAN} strokeWidth="5" />
      </g>

      {/* Pedagang di balik meja */}
      <g>
        <rect x="188" y="120" width="56" height="76" rx="22" fill={TEAL} />
        <circle cx="216" cy="98" r="18" fill={SKIN} />
        <path d="M198 94 a18 18 0 0 1 36 0" stroke={FOREST} strokeWidth="5" />
        <line x1="194" y1="150" x2="150" y2="182" stroke={SKIN} strokeWidth="8" />
        <line x1="238" y1="150" x2="282" y2="182" stroke={SKIN} strokeWidth="8" />
      </g>

      {/* Produk UMKM di meja: kain tenun lipat, keranjang, stoples */}
      <g stroke={OCEAN} strokeWidth="2">
        <rect x="100" y="160" width="52" height="36" rx="6" fill={GOLD} />
        <line x1="100" y1="172" x2="152" y2="172" strokeWidth="1.5" />
        <line x1="100" y1="184" x2="152" y2="184" strokeWidth="1.5" />
        <path d="M280 162 L316 162 L310 196 L286 196 Z" fill={CORAL} />
        <circle cx="292" cy="154" r="9" fill={GOLD} />
        <circle cx="306" cy="152" r="9" fill={TEAL} />
        <rect x="252" y="164" width="22" height="32" rx="5" fill={CREAM} />
        <rect x="252" y="164" width="22" height="10" rx="5" fill={FOREST} />
      </g>

      {/* Pembeli dengan keranjang belanja */}
      <g>
        <rect x="392" y="200" width="48" height="72" rx="20" fill={CORAL} />
        <circle cx="416" cy="176" r="17" fill={SKIN} />
        <path d="M400 168 q 16 -12, 32 0 l0 5 q -16 -8, -32 0 Z" fill={OCEAN} />
        <line x1="398" y1="230" x2="398" y2="300" stroke={OCEAN} strokeWidth="8" />
        <line x1="434" y1="230" x2="434" y2="300" stroke={OCEAN} strokeWidth="8" />
        {/* Keranjang */}
        <path d="M44 236 L96 236 L88 282 L52 282 Z" fill={GOLD} stroke={OCEAN} strokeWidth="2" />
        <line x1="42" y1="250" x2="98" y2="250" stroke={OCEAN} strokeWidth="2" />
        <circle cx="62" cy="228" r="9" fill={CORAL} />
        <circle cx="78" cy="226" r="9" fill={TEAL} />
        <line x1="400" y1="226" x2="90" y2="244" stroke={SKIN} strokeWidth="7" />
      </g>

      {/* Transaksi digital: ponsel dengan centang */}
      <g>
        <rect x="196" y="232" width="60" height="96" rx="12" fill={OCEAN} />
        <rect x="204" y="244" width="44" height="60" rx="6" fill={CREAM} />
        <circle cx="226" cy="272" r="16" fill={TEAL} />
        <path d="M218 272 l6 6 l11 -12" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="210" y="308" width="32" height="6" rx="3" fill={TEAL} opacity="0.6" />
        <circle cx="256" cy="238" r="5" fill={BRAND_GOLD} />
        {/* Koin */}
        <circle cx="150" cy="318" r="12" fill={GOLD} stroke={BRAND_GOLD} strokeWidth="2" />
        <circle cx="282" cy="318" r="12" fill={GOLD} stroke={BRAND_GOLD} strokeWidth="2" />
      </g>

      {/* Garis lantai */}
      <line x1="40" y1="306" x2="440" y2="306" stroke={GOLD} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
