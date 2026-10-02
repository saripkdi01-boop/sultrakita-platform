import type { SVGProps } from 'react';

/* ==========================================================================
   NusantaraHero — scene "Digital Nusantara" untuk hero section.
   Berlapis untuk parallax: setiap <g className="dn-layer" data-depth="...">
   digerakkan oleh JS parallax di halaman (lapisan jauh bergerak lambat).
   Semua bentuk orisinal, digambar khusus untuk SUKI Apps.
   ========================================================================== */

type IllustProps = SVGProps<SVGSVGElement> & { title?: string };

const FOREST = '#123C35';
const TEAL = '#13A89E';
const OCEAN = '#243A58';
const GOLD = '#F3B544';
const CORAL = '#F17B51';
const CREAM = '#F7F3E8';
const BRAND_GOLD = '#D4AF37';
const SKIN = '#EBB287'; /* turunan hangat dari Coral + Warm Gold */
const TEAL_DEEP = '#0E7C70'; /* turunan Tropical Teal */
const SKY_TOP = '#FDFBF5'; /* turunan Warm Cream */

export default function NusantaraHero({ title, ...props }: IllustProps) {
  return (
    <svg
      viewBox="0 0 800 600"
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
        <linearGradient id="dn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY_TOP} />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
        <linearGradient id="dn-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TEAL} />
          <stop offset="1" stopColor={TEAL_DEEP} />
        </linearGradient>
      </defs>

      {/* ===== LAPISAN 1 — background: langit, matahari, awan, bukit jauh ===== */}
      <g className="dn-layer" data-depth="0.1">
        <rect x="0" y="0" width="800" height="345" fill="url(#dn-sky)" />

        {/* Matahari */}
        <circle cx="648" cy="108" r="72" fill={GOLD} opacity="0.22" />
        <circle cx="648" cy="108" r="52" fill={GOLD} />
        <circle cx="648" cy="108" r="52" stroke={BRAND_GOLD} strokeWidth="2" opacity="0.6" />

        {/* Awan */}
        <g className="dn-clouds" fill="#FFFFFF" opacity="0.9">
          <ellipse cx="140" cy="92" rx="46" ry="18" />
          <ellipse cx="176" cy="82" rx="34" ry="15" />
          <ellipse cx="112" cy="84" rx="26" ry="12" />
        </g>
        <g className="dn-clouds" fill="#FFFFFF" opacity="0.75">
          <ellipse cx="428" cy="60" rx="54" ry="20" />
          <ellipse cx="470" cy="50" rx="38" ry="16" />
        </g>
        <g className="dn-clouds" fill="#FFFFFF" opacity="0.85">
          <ellipse cx="560" cy="172" rx="40" ry="15" />
          <ellipse cx="592" cy="164" rx="28" ry="12" />
        </g>

        {/* Perbukitan tropis jauh */}
        <path
          d="M0 345 C 90 345, 130 258, 250 258 C 360 258, 420 345, 540 345 Z"
          fill={TEAL}
          opacity="0.22"
        />
        <path
          d="M300 345 C 400 345, 470 276, 610 276 C 700 276, 760 345, 800 345 Z"
          fill={FOREST}
          opacity="0.16"
        />

        {/* Siluet palem di bukit (generik, bukan motif adat) */}
        <g stroke={FOREST} strokeWidth="3" opacity="0.4">
          <path d="M208 268 C 206 250, 204 240, 200 228" />
          <path d="M200 228 q -18 -8, -30 -2 M200 228 q 18 -8, 30 -2 M200 228 q -10 -16, -4 -26 M200 228 q 10 -16, 4 -26" />
          <path d="M452 292 C 450 276, 449 266, 446 256" />
          <path d="M446 256 q -16 -7, -27 -2 M446 256 q 16 -7, 27 -2 M446 256 q -9 -14, -3 -23 M446 256 q 9 -14, 3 -23" />
        </g>
      </g>

      {/* ===== LAPISAN 2 — midground: laut, rumah panggung, perahu ===== */}
      <g className="dn-layer" data-depth="0.25">
        <rect x="0" y="340" width="800" height="260" fill="url(#dn-sea)" />
        <line x1="0" y1="341" x2="800" y2="341" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" />

        {/* Ombak */}
        <g stroke="#FFFFFF" strokeWidth="2" opacity="0.45">
          <path d="M40 392 q 18 -12, 36 0 q 18 12, 36 0" />
          <path d="M300 420 q 18 -12, 36 0 q 18 12, 36 0" />
          <path d="M120 470 q 18 -12, 36 0 q 18 12, 36 0" />
          <path d="M420 480 q 18 -12, 36 0 q 18 12, 36 0" />
          <path d="M660 420 q 18 -12, 36 0 q 18 12, 36 0" />
        </g>

        {/* Rumah panggung generik di tepi air */}
        <g>
          {/* Tiang */}
          <g stroke={OCEAN} strokeWidth="6">
            <line x1="592" y1="424" x2="592" y2="540" />
            <line x1="648" y1="424" x2="648" y2="540" />
            <line x1="704" y1="424" x2="704" y2="540" />
          </g>
          {/* Dek */}
          <rect x="572" y="412" width="152" height="14" rx="6" fill={OCEAN} />
          {/* Badan rumah */}
          <rect x="592" y="338" width="116" height="78" rx="6" fill={CREAM} stroke={OCEAN} strokeWidth="2" />
          {/* Atap pelana */}
          <path d="M582 340 L650 296 L718 340 Z" fill={OCEAN} />
          <circle cx="650" cy="318" r="3.5" fill={BRAND_GOLD} />
          {/* Pintu & jendela */}
          <rect x="632" y="372" width="26" height="44" rx="4" fill={TEAL} opacity="0.85" />
          <rect x="598" y="356" width="22" height="22" rx="4" stroke={TEAL} strokeWidth="2" />
          <rect x="680" y="356" width="22" height="22" rx="4" stroke={TEAL} strokeWidth="2" />
          {/* Tangga ke air */}
          <g stroke={OCEAN} strokeWidth="3">
            <line x1="716" y1="424" x2="716" y2="486" />
            <line x1="730" y1="424" x2="730" y2="486" />
            <line x1="714" y1="446" x2="732" y2="446" />
            <line x1="714" y1="466" x2="732" y2="466" />
          </g>
        </g>

        {/* Perahu */}
        <g>
          <path d="M64 452 L196 452 L172 488 L88 488 Z" fill={TEAL_DEEP} stroke={FOREST} strokeWidth="2" />
          <line x1="64" y1="452" x2="196" y2="452" stroke={FOREST} strokeWidth="3" />
          <line x1="150" y1="450" x2="196" y2="414" stroke={OCEAN} strokeWidth="4" />
          <ellipse cx="212" cy="408" rx="10" ry="14" fill={OCEAN} transform="rotate(24 212 408)" />
        </g>
      </g>

      {/* ===== LAPISAN 3 — foreground: pasir, warga, dedaunan pembingkai ===== */}
      <g className="dn-layer" data-depth="0.45">
        {/* Hamparan pasir */}
        <path
          d="M0 600 L0 528 C 140 508, 260 536, 400 522 C 540 508, 660 534, 800 516 L800 600 Z"
          fill={CREAM}
        />
        <path
          d="M0 528 C 140 508, 260 536, 400 522 C 540 508, 660 534, 800 516"
          stroke={GOLD}
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Bayangan kaki */}
        <g fill={OCEAN} opacity="0.08">
          <ellipse cx="150" cy="566" rx="44" ry="8" />
          <ellipse cx="330" cy="566" rx="44" ry="8" />
          <ellipse cx="500" cy="566" rx="48" ry="8" />
          <ellipse cx="662" cy="566" rx="44" ry="8" />
        </g>

        {/* Nelayan dengan jaring */}
        <g>
          <rect x="128" y="470" width="44" height="68" rx="20" fill={CORAL} />
          <line x1="138" y1="536" x2="138" y2="560" stroke={OCEAN} strokeWidth="8" />
          <line x1="162" y1="536" x2="162" y2="560" stroke={OCEAN} strokeWidth="8" />
          <circle cx="150" cy="444" r="17" fill={SKIN} />
          <path d="M133 438 a17 17 0 0 1 34 0 l0 -4 a17 10 0 0 0 -34 0 Z" fill={TEAL} />
          {/* Lengan ke jaring */}
          <line x1="168" y1="492" x2="206" y2="516" stroke={SKIN} strokeWidth="7" />
          <line x1="132" y1="492" x2="196" y2="528" stroke={SKIN} strokeWidth="7" />
          {/* Jaring */}
          <g stroke={TEAL} strokeWidth="2" opacity="0.9">
            <path d="M198 506 L262 546 L236 572 L172 532 Z" />
            <line x1="214" y1="519" x2="186" y2="545" />
            <line x1="230" y1="532" x2="202" y2="558" />
            <line x1="246" y1="545" x2="218" y2="571" />
            <line x1="210" y1="512" x2="250" y2="552" />
          </g>
          <circle cx="262" cy="546" r="4" fill={BRAND_GOLD} />
        </g>

        {/* Pedagang pasar dengan keranjang */}
        <g>
          <rect x="308" y="470" width="44" height="68" rx="20" fill={TEAL} />
          <line x1="318" y1="536" x2="318" y2="560" stroke={OCEAN} strokeWidth="8" />
          <line x1="342" y1="536" x2="342" y2="560" stroke={OCEAN} strokeWidth="8" />
          <circle cx="330" cy="444" r="17" fill={SKIN} />
          <path d="M313 440 a17 17 0 0 1 34 0" stroke={FOREST} strokeWidth="5" />
          {/* Keranjang */}
          <path d="M372 516 L412 516 L404 552 L380 552 Z" fill={GOLD} stroke={OCEAN} strokeWidth="2" />
          <line x1="370" y1="528" x2="414" y2="528" stroke={OCEAN} strokeWidth="2" />
          <circle cx="384" cy="510" r="8" fill={CORAL} />
          <circle cx="398" cy="508" r="8" fill={GOLD} stroke={OCEAN} strokeWidth="1.5" />
          <circle cx="391" cy="498" r="8" fill={TEAL} />
          <line x1="352" y1="494" x2="378" y2="522" stroke={SKIN} strokeWidth="7" />
        </g>

        {/* Anak muda dengan laptop */}
        <g>
          <rect x="478" y="470" width="44" height="68" rx="20" fill={FOREST} />
          <line x1="488" y1="536" x2="488" y2="560" stroke={OCEAN} strokeWidth="8" />
          <line x1="512" y1="536" x2="512" y2="560" stroke={OCEAN} strokeWidth="8" />
          <circle cx="500" cy="444" r="17" fill={SKIN} />
          <path d="M484 434 q 16 -12, 32 0 l0 6 q -16 -8, -32 0 Z" fill={OCEAN} />
          {/* Laptop */}
          <rect x="512" y="500" width="58" height="38" rx="5" fill={OCEAN} />
          <rect x="518" y="506" width="46" height="26" rx="3" fill={TEAL} opacity="0.5" />
          <circle cx="541" cy="519" r="4" fill={BRAND_GOLD} />
          <line x1="474" y1="496" x2="514" y2="516" stroke={SKIN} strokeWidth="7" />
        </g>

        {/* Pelaku UMKM dengan ponsel */}
        <g>
          <rect x="640" y="470" width="44" height="68" rx="20" fill={OCEAN} />
          <line x1="650" y1="536" x2="650" y2="560" stroke={OCEAN} strokeWidth="8" />
          <line x1="674" y1="536" x2="674" y2="560" stroke={OCEAN} strokeWidth="8" />
          <circle cx="662" cy="444" r="17" fill={SKIN} />
          <circle cx="662" cy="430" r="4" fill={BRAND_GOLD} />
          {/* Ponsel */}
          <rect x="676" y="492" width="24" height="40" rx="5" fill={CORAL} stroke={OCEAN} strokeWidth="2" />
          <path d="M681 512 l5 5 l9 -10" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="640" y1="494" x2="678" y2="508" stroke={SKIN} strokeWidth="7" />
          {/* Kotak dagangan */}
          <rect x="600" y="520" width="34" height="30" rx="4" fill={GOLD} stroke={OCEAN} strokeWidth="2" />
          <line x1="600" y1="530" x2="634" y2="530" stroke={OCEAN} strokeWidth="2" />
        </g>

        {/* Dedaunan tropis pembingkai */}
        <g>
          <path d="M0 600 C 10 540, 30 500, 66 478 C 50 520, 40 560, 38 600 Z" fill={FOREST} />
          <path d="M0 600 C 40 570, 70 560, 104 556" stroke={TEAL} strokeWidth="3" opacity="0.8" />
          <path d="M800 600 C 790 544, 772 506, 738 484 C 754 526, 762 564, 764 600 Z" fill={FOREST} />
          <path d="M800 600 C 762 572, 732 562, 700 558" stroke={TEAL} strokeWidth="3" opacity="0.8" />
          <ellipse cx="52" cy="560" rx="26" ry="12" fill={TEAL} opacity="0.55" transform="rotate(-24 52 560)" />
          <ellipse cx="748" cy="560" rx="26" ry="12" fill={TEAL} opacity="0.55" transform="rotate(24 748 560)" />
        </g>
      </g>
    </svg>
  );
}
