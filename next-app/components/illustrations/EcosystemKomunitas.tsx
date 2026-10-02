import type { SVGProps } from 'react';

/* ==========================================================================
   EcosystemKomunitas — warga berkumpul dalam lingkaran diskusi yang hangat.
   Balon percakapan menandakan dialog, bukan kerumunan pasif.
   viewBox 0 0 480 360.
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

export default function EcosystemKomunitas({ title, ...props }: IllustProps) {
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
        <linearGradient id="ekk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDFBF5" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="480" height="360" rx="24" fill="url(#ekk-bg)" />

      {/* Matahari */}
      <circle cx="72" cy="58" r="26" fill={GOLD} />
      <circle cx="72" cy="58" r="26" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />

      {/* Lantai & tikar lingkaran */}
      <ellipse cx="240" cy="282" rx="170" ry="40" fill={GOLD} opacity="0.25" />
      <ellipse cx="240" cy="282" rx="170" ry="40" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />
      <ellipse cx="240" cy="282" rx="120" ry="28" stroke={BRAND_GOLD} strokeWidth="1.5" opacity="0.4" />

      {/* Warga 1 (kiri) — berbicara */}
      <g>
        <rect x="92" y="196" width="52" height="72" rx="22" fill={CORAL} />
        <line x1="104" y1="266" x2="104" y2="292" stroke={OCEAN} strokeWidth="8" />
        <line x1="132" y1="266" x2="132" y2="292" stroke={OCEAN} strokeWidth="8" />
        <circle cx="118" cy="172" r="18" fill={SKIN} />
        <path d="M101 168 a18 18 0 0 1 34 0" stroke={FOREST} strokeWidth="5" />
        <line x1="142" y1="218" x2="176" y2="206" stroke={SKIN} strokeWidth="8" />
        <line x1="96" y1="218" x2="70" y2="230" stroke={SKIN} strokeWidth="8" />
      </g>

      {/* Warga 2 (tengah) — mendengarkan, memegang cangkir */}
      <g>
        <rect x="214" y="188" width="52" height="72" rx="22" fill={TEAL} />
        <line x1="226" y1="258" x2="226" y2="292" stroke={OCEAN} strokeWidth="8" />
        <line x1="254" y1="258" x2="254" y2="292" stroke={OCEAN} strokeWidth="8" />
        <circle cx="240" cy="164" r="18" fill={SKIN} />
        <circle cx="240" cy="150" r="4" fill={BRAND_GOLD} />
        <line x1="264" y1="212" x2="292" y2="224" stroke={SKIN} strokeWidth="8" />
        <rect x="288" y="212" width="16" height="20" rx="4" fill={GOLD} stroke={OCEAN} strokeWidth="2" />
      </g>

      {/* Warga 3 (kanan) — ikut berpendapat */}
      <g>
        <rect x="336" y="196" width="52" height="72" rx="22" fill={FOREST} />
        <line x1="348" y1="266" x2="348" y2="292" stroke={OCEAN} strokeWidth="8" />
        <line x1="376" y1="266" x2="376" y2="292" stroke={OCEAN} strokeWidth="8" />
        <circle cx="362" cy="172" r="18" fill={SKIN} />
        <path d="M346 164 q 16 -12, 32 0 l0 5 q -16 -8, -32 0 Z" fill={OCEAN} />
        <line x1="338" y1="218" x2="306" y2="206" stroke={SKIN} strokeWidth="8" />
      </g>

      {/* Balon percakapan */}
      <g>
        <rect x="150" y="56" width="120" height="52" rx="16" fill="#FFFFFF" stroke={OCEAN} strokeWidth="2" />
        <path d="M176 108 L168 126 L192 108 Z" fill="#FFFFFF" stroke={OCEAN} strokeWidth="2" />
        <line x1="166" y1="74" x2="254" y2="74" stroke={TEAL} strokeWidth="3" />
        <line x1="166" y1="88" x2="228" y2="88" stroke={OCEAN} strokeWidth="2.5" opacity="0.45" />
        <circle cx="252" cy="95" r="5" fill={CORAL} />
      </g>
      <g>
        <rect x="330" y="92" width="96" height="44" rx="14" fill="#FFFFFF" stroke={TEAL} strokeWidth="2" />
        <path d="M352 136 L344 152 L366 136 Z" fill="#FFFFFF" stroke={TEAL} strokeWidth="2" />
        <circle cx="352" cy="114" r="5" fill={GOLD} />
        <circle cx="370" cy="114" r="5" fill={TEAL} />
        <circle cx="388" cy="114" r="5" fill={CORAL} />
      </g>

      {/* Hati kecil: kehangatan komunitas */}
      <g transform="translate(240 96)">
        <path
          d="M0 10 C -14 -2, -8 -16, 0 -8 C 8 -16, 14 -2, 0 10 Z"
          fill={CORAL}
          stroke={OCEAN}
          strokeWidth="1.5"
        />
      </g>

      {/* Daun tropis sudut */}
      <g>
        <path d="M480 360 C 470 320, 452 296, 428 284 C 440 312, 448 338, 450 360 Z" fill={FOREST} opacity="0.85" />
        <path d="M0 360 C 10 322, 26 300, 50 288 C 40 314, 32 340, 30 360 Z" fill={TEAL} opacity="0.5" />
      </g>
    </svg>
  );
}
