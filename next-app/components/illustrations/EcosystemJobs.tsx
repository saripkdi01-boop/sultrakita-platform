import type { SVGProps } from 'react';

/* ==========================================================================
   EcosystemJobs — talenta muda berkolaborasi: laptop, dokumen lamaran,
   dan jabat tangan peluang. viewBox 0 0 480 360.
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

export default function EcosystemJobs({ title, ...props }: IllustProps) {
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
        <linearGradient id="ekj-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDFBF5" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="480" height="360" rx="24" fill="url(#ekj-bg)" />

      {/* Matahari */}
      <circle cx="408" cy="58" r="26" fill={GOLD} />
      <circle cx="408" cy="58" r="26" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />

      {/* Lantai */}
      <line x1="48" y1="300" x2="432" y2="300" stroke={FOREST} strokeWidth="2" opacity="0.35" />
      <g fill={OCEAN} opacity="0.08">
        <ellipse cx="170" cy="304" rx="46" ry="8" />
        <ellipse cx="320" cy="304" rx="46" ry="8" />
      </g>

      {/* Meja kerja */}
      <rect x="120" y="196" width="240" height="16" rx="8" fill={OCEAN} />
      <line x1="150" y1="212" x2="150" y2="300" stroke={OCEAN} strokeWidth="6" />
      <line x1="330" y1="212" x2="330" y2="300" stroke={OCEAN} strokeWidth="6" />

      {/* Laptop terbuka */}
      <g>
        <path d="M196 196 L196 140 L284 140 L284 196" fill={OCEAN} />
        <rect x="202" y="146" width="76" height="44" rx="4" fill={TEAL} opacity="0.55" />
        <circle cx="240" cy="168" r="5" fill={BRAND_GOLD} />
        <rect x="186" y="192" width="108" height="10" rx="5" fill={OCEAN} />
      </g>

      {/* Dokumen lamaran */}
      <g transform="translate(330 168) rotate(8)">
        <rect x="-20" y="-26" width="40" height="52" rx="5" fill="#FFFFFF" stroke={OCEAN} strokeWidth="2" />
        <line x1="-11" y1="-13" x2="11" y2="-13" stroke={TEAL} strokeWidth="2.5" />
        <line x1="-11" y1="-4" x2="11" y2="-4" stroke={OCEAN} strokeWidth="2" opacity="0.4" />
        <line x1="-11" y1="5" x2="4" y2="5" stroke={OCEAN} strokeWidth="2" opacity="0.4" />
        <circle cx="8" cy="15" r="7" fill={CORAL} />
        <path d="M5 15 l2.5 2.5 l4.5 -5.5" stroke="#FFFFFF" strokeWidth="2" />
      </g>

      {/* Talenta 1 (kiri) */}
      <g>
        <rect x="128" y="216" width="52" height="70" rx="22" fill={TEAL} />
        <line x1="140" y1="284" x2="140" y2="300" stroke={OCEAN} strokeWidth="8" />
        <line x1="168" y1="284" x2="168" y2="300" stroke={OCEAN} strokeWidth="8" />
        <circle cx="154" cy="192" r="18" fill={SKIN} />
        <path d="M137 186 q 17 -14, 34 0 l0 6 q -17 -8, -34 0 Z" fill={FOREST} />
        {/* Lengan ke laptop */}
        <line x1="178" y1="238" x2="212" y2="200" stroke={SKIN} strokeWidth="8" />
        <line x1="132" y1="238" x2="118" y2="210" stroke={SKIN} strokeWidth="8" />
        {/* Kopi */}
        <rect x="100" y="176" width="18" height="24" rx="4" fill={CORAL} stroke={OCEAN} strokeWidth="2" />
        <path d="M118 182 q 8 2, 0 10" stroke={OCEAN} strokeWidth="2" />
      </g>

      {/* Talenta 2 (kanan) */}
      <g>
        <rect x="300" y="216" width="52" height="70" rx="22" fill={FOREST} />
        <line x1="312" y1="284" x2="312" y2="300" stroke={OCEAN} strokeWidth="8" />
        <line x1="340" y1="284" x2="340" y2="300" stroke={OCEAN} strokeWidth="8" />
        <circle cx="326" cy="192" r="18" fill={SKIN} />
        <circle cx="326" cy="178" r="4" fill={BRAND_GOLD} />
        <path d="M309 188 a18 18 0 0 1 34 0" stroke={OCEAN} strokeWidth="5" />
        {/* Lengan: satu ke dokumen, satu jabat tangan */}
        <line x1="348" y1="238" x2="338" y2="196" stroke={SKIN} strokeWidth="8" />
        <line x1="302" y1="244" x2="252" y2="232" stroke={SKIN} strokeWidth="8" />
      </g>

      {/* Jabat tangan di tengah */}
      <g>
        <line x1="202" y1="232" x2="248" y2="232" stroke={SKIN} strokeWidth="9" />
        <circle cx="225" cy="232" r="11" fill={SKIN} stroke={OCEAN} strokeWidth="2" />
        {/* Kilau peluang */}
        <g stroke={GOLD} strokeWidth="2.5">
          <line x1="225" y1="192" x2="225" y2="202" />
          <line x1="205" y1="198" x2="211" y2="206" />
          <line x1="245" y1="198" x2="239" y2="206" />
        </g>
        <circle cx="225" cy="186" r="4" fill={BRAND_GOLD} />
      </g>

      {/* Balon ide */}
      <g>
        <circle cx="96" cy="96" r="34" fill="#FFFFFF" stroke={TEAL} strokeWidth="2" />
        <path d="M112 124 L124 142 L104 128 Z" fill="#FFFFFF" stroke={TEAL} strokeWidth="2" />
        <rect x="80" y="82" width="32" height="8" rx="4" fill={TEAL} opacity="0.6" />
        <rect x="80" y="96" width="22" height="8" rx="4" fill={OCEAN} opacity="0.35" />
      </g>

      {/* Tas kerja */}
      <g>
        <rect x="376" y="252" width="56" height="44" rx="8" fill={CORAL} stroke={OCEAN} strokeWidth="2" />
        <path d="M392 252 v-10 a12 12 0 0 1 24 0 v10" stroke={OCEAN} strokeWidth="4" />
        <line x1="376" y1="268" x2="432" y2="268" stroke={OCEAN} strokeWidth="2" />
      </g>
    </svg>
  );
}
