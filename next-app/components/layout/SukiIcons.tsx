'use client';

import type { SVGProps } from 'react';

/* ==========================================================================
   Set ikon khas SUKI Apps — bukan ikon generik.
   Bahasa desain: garis 2px rounded (menggemakan lekuk 's' gelombang pada
   logo), plus SATU titik emas khas logo (#FFD766) sebagai aksen khas di
   tiap ikon. Ikon digambar di grid 24x24, stroke = currentColor.
   ========================================================================== */

const GOLD = '#FFD766';

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Titik emas khas SUKI. */
function Dot({ cx, cy, r = 1.9 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={GOLD} stroke="none" />;
}

/** Marketplace — tas belanja; titik emas di simpul tali jinjing. */
export function SukiIconMarketplace(props: P) {
  return (
    <Base {...props}>
      <path d="M5.5 8h13l-1.1 11.1a2 2 0 0 1-2 1.9H8.6a2 2 0 0 1-2-1.9L5.5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      <Dot cx={12} cy={4.6} />
    </Base>
  );
}

/** Properti — gedung dengan garis atap gelombang; titik emas sebagai jendela puncak. */
export function SukiIconProperti(props: P) {
  return (
    <Base {...props}>
      <path d="M4 21h16" />
      <path d="M6 21V9.5L12 5l6 4.5V21" />
      <path d="M10 21v-4.5h4V21" />
      <Dot cx={12} cy={9.4} />
    </Base>
  );
}

/** SUKI Jobs — koper; titik emas sebagai kunci pengait. */
export function SukiIconJobs(props: P) {
  return (
    <Base {...props}>
      <rect x="3.5" y="8.5" width="17" height="11" rx="2.5" />
      <path d="M9 8.5V6.8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.7" />
      <path d="M3.5 13h17" />
      <Dot cx={12} cy={13} />
    </Base>
  );
}

/** Komunitas — dua warga; titik emas sebagai cahaya kebersamaan. */
export function SukiIconKomunitas(props: P) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.6 2.8-5.8 5.5-5.8s4.9 2.2 5.5 5.8" />
      <circle cx="16.8" cy="9" r="2.5" />
      <path d="M15.4 14.6c2.9.3 4.7 2.3 5.1 5.4" />
      <Dot cx={18.4} cy={4.6} r={1.6} />
    </Base>
  );
}

/** Portal Berita — koran; titik emas sebagai penanda kabar terbaru. */
export function SukiIconBerita(props: P) {
  return (
    <Base {...props}>
      <path d="M4 6.5h12.5V18H6a2 2 0 0 1-2-2V6.5Z" />
      <path d="M16.5 9.5H19a1 1 0 0 1 1 1V18a1.5 1.5 0 0 1-1.5 1.5" />
      <path d="M7.5 10.5h5.5M7.5 13.5h5.5" />
      <Dot cx={18.2} cy={5.4} />
    </Base>
  );
}

/** Direktori Bisnis — etalase ruko; titik emas di puncak tenda. */
export function SukiIconBisnis(props: P) {
  return (
    <Base {...props}>
      <path d="M4.5 9.5 6 4.8h12l1.5 4.7" />
      <path d="M4.5 9.5a2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6 0" />
      <path d="M6 12.5V20h12v-7.5" />
      <path d="M10.2 20v-4.2h3.6V20" />
      <Dot cx={12} cy={7.6} r={1.5} />
    </Base>
  );
}

/** Pasang Iklan — label harga; lubang label = titik emas. */
export function SukiIconIklan(props: P) {
  return (
    <Base {...props}>
      <path d="M4 4.5h6.8L20 13.7a1.4 1.4 0 0 1 0 2L13.3 22a1.4 1.4 0 0 1-2 0L4 14.7V4.5Z" />
      <path d="M4 4.5c2.5 0 2.5 2.5 0 2.5" />
      <Dot cx={8.6} cy={8.6} r={2} />
    </Base>
  );
}

/** Daftarkan Bisnis — etalase + tanda plus emas (aksi "buat"). */
export function SukiIconDaftarBisnis(props: P) {
  return (
    <Base {...props}>
      <path d="M4 10h16" />
      <path d="M5.5 10 7 5h10l1.5 5" />
      <path d="M6.5 10v10h11V10" />
      <path d="M12 12.8v4.4M9.8 15h4.4" stroke={GOLD} />
    </Base>
  );
}

/** Pasang Lowongan — koper + plus emas; bahasa "buat" yang konsisten. */
export function SukiIconLowongan(props: P) {
  return (
    <Base {...props}>
      <rect x="3.5" y="7.5" width="14.5" height="12" rx="2.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h14.5" />
      <path d="M18.5 15.5v5M16 18h5" stroke={GOLD} />
    </Base>
  );
}

/** Ajak Teman — kado; titik emas sebagai simpul pita. */
export function SukiIconAjakTeman(props: P) {
  return (
    <Base {...props}>
      <rect x="5" y="10" width="14" height="10" rx="1.5" />
      <path d="M4 7h16v3H4z" />
      <path d="M12 7v13" />
      <path d="M12 7C8.5 7 7 5.4 7.8 4.2c.6-1 2.6-.7 4.2 2.8Zm0 0c3.5 0 5-1.6 4.2-2.8-.6-1-2.6-.7-4.2 2.8Z" />
      <Dot cx={12} cy={7} r={1.6} />
    </Base>
  );
}

/** Reels — bingkai putar + play; titik emas sebagai lampu "rekam". */
export function SukiIconReels(props: P) {
  return (
    <Base {...props}>
      <rect x="4" y="6.5" width="16" height="13" rx="3.5" />
      <path d="M10.3 10.3v5.4l4.7-2.7-4.7-2.7Z" />
      <Dot cx={16.8} cy={10} r={1.5} />
    </Base>
  );
}

/** Pesan — gelembung chat berekor gelombang; titik emas + dua titik mengetik. */
export function SukiIconPesan(props: P) {
  return (
    <Base {...props}>
      <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9.5L5 20.5v-14a1 1 0 0 1-1-1Z" />
      <Dot cx={9.5} cy={11} r={1.5} />
      <circle cx={13.5} cy={11} r={1} />
      <circle cx={16.8} cy={11} r={1} />
    </Base>
  );
}

/** SUKI Kampung — rumah panggung di atas tiang; titik emas sebagai matahari pagi. */
export function SukiIconKampung(props: P) {
  return (
    <Base {...props}>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M6.5 10.5V16h11v-5.5" />
      <path d="M11 16v-3h2v3" />
      <path d="M8 16v3.5M16 16v3.5" />
      <path d="M4 21h16" />
      <Dot cx={18.6} cy={5.2} r={1.7} />
    </Base>
  );
}

/** SUKI Web Studio — jendela browser dengan kurung kode; titik emas sebagai lampu studio. */
export function SukiIconWebStudio(props: P) {
  return (
    <Base {...props}>
      <rect x="3" y="4.5" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M9.8 12.8l-1.9 1.9 1.9 1.9" />
      <path d="M14.2 12.8l1.9 1.9-1.9 1.9" />
      <path d="M4 21h16" />
      <Dot cx={17.6} cy={7} r={1.5} />
    </Base>
  );
}
