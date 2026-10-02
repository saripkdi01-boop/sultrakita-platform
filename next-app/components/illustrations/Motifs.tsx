import type { SVGProps } from 'react';

/* ==========================================================================
   Motifs — komponen dekoratif kecil "Digital Nusantara".
   Semua bersifat dekoratif murni: aria-hidden default, tidak menyampaikan
   informasi. Jangan beri role="img"/title pada motif ini.
   ========================================================================== */

const FOREST = '#123C35';
const TEAL = '#13A89E';
const OCEAN = '#243A58';
const GOLD = '#F3B544';
const CORAL = '#F17B51';
const BRAND_GOLD = '#D4AF37';

type PatternProps = SVGProps<SVGPatternElement> & { id: string };
type SvgProps = SVGProps<SVGSVGElement>;

/**
 * TenunPattern — pola geometris diamond ala tenun, sebagai <pattern>
 * yang bisa dipakai ulang. Pakai di dalam <defs> lalu referensikan
 * lewat fill="url(#id)".
 *
 * Contoh:
 *   <svg><defs><TenunPattern id="tenun-hero" /></defs>
 *   <rect fill="url(#tenun-hero)" ... /></svg>
 */
export function TenunPattern({ id, ...props }: PatternProps) {
  return (
    <pattern
      id={id}
      width="32"
      height="32"
      patternUnits="userSpaceOnUse"
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" fill="none" />
      <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="none" stroke={TEAL} strokeWidth="2" />
      <path d="M16 10 L22 16 L16 22 L10 16 Z" fill={GOLD} opacity="0.85" />
      <circle cx="16" cy="16" r="2.5" fill={CORAL} />
      <circle cx="0" cy="0" r="2.5" fill={BRAND_GOLD} />
      <circle cx="32" cy="0" r="2.5" fill={BRAND_GOLD} />
      <circle cx="0" cy="32" r="2.5" fill={BRAND_GOLD} />
      <circle cx="32" cy="32" r="2.5" fill={BRAND_GOLD} />
    </pattern>
  );
}

/** WaveDivider — pemisah section berbentuk ombak. Warnanya ikut currentColor. */
export function WaveDivider(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M0 54 C 120 90, 240 18, 360 40 C 480 62, 600 84, 720 60 C 840 36, 960 12, 1080 34 C 1200 56, 1320 78, 1440 48 L1440 90 L0 90 Z"
        fill="currentColor"
      />
      <path
        d="M0 54 C 120 90, 240 18, 360 40 C 480 62, 600 84, 720 60 C 840 36, 960 12, 1080 34 C 1200 56, 1320 78, 1440 48"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** TropicalLeaf — sehelai daun tropis generik. */
export function TropicalLeaf(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M32 6 C 50 18, 56 40, 34 58 C 14 42, 12 20, 32 6 Z"
        fill={FOREST}
      />
      <path d="M32 12 C 30 28, 28 42, 32 54" stroke={TEAL} strokeWidth="2.5" />
      <path d="M32 24 L42 20 M32 34 L44 30 M32 24 L22 20 M32 34 L20 30" stroke={TEAL} strokeWidth="2" />
    </svg>
  );
}

/** CloudDrift — awan melayang. */
export function CloudDrift(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <ellipse cx="40" cy="30" rx="28" ry="14" fill="#FFFFFF" opacity="0.95" />
      <ellipse cx="66" cy="24" rx="24" ry="13" fill="#FFFFFF" opacity="0.95" />
      <ellipse cx="88" cy="32" rx="18" ry="10" fill="#FFFFFF" opacity="0.9" />
      <path d="M18 40 q 20 6, 40 2 q 24 -5, 44 2" stroke={OCEAN} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

/** SunDisc — cakram matahari dengan titik emas khas SUKI. */
export function SunDisc(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="36" cy="36" r="26" fill={GOLD} />
      <circle cx="36" cy="36" r="26" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.7" />
      <circle cx="36" cy="36" r="6" fill={BRAND_GOLD} />
    </svg>
  );
}
