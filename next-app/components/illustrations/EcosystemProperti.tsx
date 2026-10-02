import type { SVGProps } from 'react';

/* ==========================================================================
   EcosystemProperti — rumah tropis, rumah panggung generik, kavling tanah,
   dan ruko. viewBox 0 0 480 360.
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

export default function EcosystemProperti({ title, ...props }: IllustProps) {
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
        <linearGradient id="ekp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDFBF5" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="480" height="360" rx="24" fill="url(#ekp-bg)" />

      {/* Matahari */}
      <circle cx="72" cy="60" r="26" fill={GOLD} />
      <circle cx="72" cy="60" r="26" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />

      {/* Awan */}
      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="330" cy="52" rx="40" ry="14" />
        <ellipse cx="362" cy="44" rx="28" ry="12" />
      </g>

      {/* Tanah */}
      <ellipse cx="240" cy="312" rx="220" ry="34" fill={FOREST} opacity="0.12" />
      <line x1="40" y1="300" x2="440" y2="300" stroke={FOREST} strokeWidth="2" opacity="0.35" />

      {/* Rumah tropis */}
      <g>
        <rect x="52" y="180" width="120" height="120" rx="6" fill={CREAM} stroke={OCEAN} strokeWidth="2" />
        <path d="M40 184 L112 128 L184 184 Z" fill={CORAL} />
        <path d="M40 184 L112 128 L184 184" stroke={OCEAN} strokeWidth="2" />
        <circle cx="112" cy="160" r="4" fill={BRAND_GOLD} />
        <rect x="98" y="240" width="28" height="60" rx="4" fill={TEAL} />
        <rect x="60" y="204" width="26" height="26" rx="4" stroke={TEAL} strokeWidth="2" />
        <rect x="138" y="204" width="26" height="26" rx="4" stroke={TEAL} strokeWidth="2" />
      </g>

      {/* Rumah panggung generik */}
      <g>
        <g stroke={OCEAN} strokeWidth="5">
          <line x1="228" y1="246" x2="228" y2="300" />
          <line x1="268" y1="246" x2="268" y2="300" />
          <line x1="308" y1="246" x2="308" y2="300" />
        </g>
        <rect x="216" y="236" width="104" height="12" rx="5" fill={OCEAN} />
        <rect x="228" y="176" width="80" height="62" rx="6" fill={CREAM} stroke={OCEAN} strokeWidth="2" />
        <path d="M220 178 L268 142 L316 178 Z" fill={FOREST} />
        <path d="M220 178 L268 142 L316 178" stroke={OCEAN} strokeWidth="2" />
        <rect x="258" y="202" width="20" height="36" rx="3" fill={TEAL} />
        <rect x="234" y="190" width="18" height="18" rx="3" stroke={TEAL} strokeWidth="2" />
      </g>

      {/* Ruko */}
      <g>
        <rect x="344" y="150" width="96" height="150" rx="6" fill={CREAM} stroke={OCEAN} strokeWidth="2" />
        <rect x="344" y="150" width="96" height="34" rx="6" fill={OCEAN} />
        <circle cx="392" cy="167" r="4" fill={BRAND_GOLD} />
        <rect x="356" y="204" width="30" height="30" rx="4" stroke={TEAL} strokeWidth="2" />
        <rect x="398" y="204" width="30" height="30" rx="4" stroke={TEAL} strokeWidth="2" />
        <rect x="370" y="252" width="40" height="48" rx="4" fill={CORAL} />
        <rect x="370" y="252" width="40" height="14" rx="4" fill={OCEAN} opacity="0.35" />
      </g>

      {/* Kavling tanah dengan patok */}
      <g>
        <path d="M52 300 L140 300 L120 336 L40 336 Z" fill={GOLD} opacity="0.35" stroke={BRAND_GOLD} strokeWidth="2" />
        <line x1="52" y1="300" x2="52" y2="272" stroke={OCEAN} strokeWidth="4" />
        <circle cx="52" cy="268" r="5" fill={CORAL} />
        <line x1="140" y1="300" x2="140" y2="272" stroke={OCEAN} strokeWidth="4" />
        <circle cx="140" cy="268" r="5" fill={CORAL} />
      </g>

      {/* Kunci + dokumen (serah terima) */}
      <g transform="translate(150 96)">
        <circle cx="0" cy="0" r="12" fill={GOLD} stroke={BRAND_GOLD} strokeWidth="2" />
        <line x1="10" y1="8" x2="34" y2="32" stroke={BRAND_GOLD} strokeWidth="5" />
        <line x1="24" y1="22" x2="30" y2="16" stroke={BRAND_GOLD} strokeWidth="4" />
        <line x1="30" y1="28" x2="36" y2="22" stroke={BRAND_GOLD} strokeWidth="4" />
      </g>
      <g transform="translate(330 250)">
        <rect x="-22" y="-28" width="44" height="56" rx="5" fill="#FFFFFF" stroke={OCEAN} strokeWidth="2" />
        <line x1="-12" y1="-14" x2="12" y2="-14" stroke={TEAL} strokeWidth="2.5" />
        <line x1="-12" y1="-4" x2="12" y2="-4" stroke={OCEAN} strokeWidth="2" opacity="0.4" />
        <line x1="-12" y1="6" x2="6" y2="6" stroke={OCEAN} strokeWidth="2" opacity="0.4" />
        <circle cx="10" cy="16" r="8" fill={TEAL} />
        <path d="M6 16 l3 3 l5 -6" stroke="#FFFFFF" strokeWidth="2" />
      </g>

      {/* Warga menunjuk rumah */}
      <g>
        <rect x="404" y="196" width="40" height="62" rx="18" fill={FOREST} />
        <line x1="412" y1="256" x2="412" y2="300" stroke={OCEAN} strokeWidth="7" />
        <line x1="436" y1="256" x2="436" y2="300" stroke={OCEAN} strokeWidth="7" />
        <circle cx="424" cy="172" r="16" fill={SKIN} />
        <line x1="404" y1="214" x2="360" y2="196" stroke={SKIN} strokeWidth="7" />
        <circle cx="424" cy="158" r="4" fill={BRAND_GOLD} />
      </g>

      {/* Palem generik */}
      <g stroke={FOREST} strokeWidth="3" opacity="0.7">
        <path d="M30 300 C 28 272, 27 258, 24 244" />
        <path d="M24 244 q -16 -7, -26 -1 M24 244 q 16 -7, 26 -1 M24 244 q -8 -14, -3 -22 M24 244 q 8 -14, 3 -22" />
      </g>
    </svg>
  );
}
