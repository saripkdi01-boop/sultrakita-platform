import type { DoorId } from '@/lib/homepage/content';

/**
 * Set ikon Enam Pintu — grid 24px, berbasis stroke (1.75), ujung membulat.
 * Warna mengikuti `currentColor` sehingga tunduk pada token Warm Muse.
 * Referensi visual: ikon hasil generate di folder aset owner, digambar ulang sebagai SVG.
 */
const paths: Record<DoorId, JSX.Element> = {
  marketplace: (
    <>
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      <path d="M9.5 13.5c.8 1.2 1.6 1.7 2.5 1.7s1.7-.5 2.5-1.7" />
    </>
  ),
  properti: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5h4v5" />
      <circle cx="16.5" cy="6.5" r="1.2" />
    </>
  ),
  lowongan: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
      <path d="M11 12.5v1.5h2v-1.5" />
    </>
  ),
  komunitas: (
    <>
      <circle cx="12" cy="8.5" r="2.8" />
      <path d="M6.5 19.5a5.5 5.5 0 0 1 11 0" />
      <circle cx="5.2" cy="10" r="1.9" />
      <circle cx="18.8" cy="10" r="1.9" />
      <path d="M2.5 17.5a3.4 3.4 0 0 1 3.9-3.3M21.5 17.5a3.4 3.4 0 0 0-3.9-3.3" />
    </>
  ),
  bisnis: (
    <>
      <path d="M4 9.5 5.5 4.5h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12v8h13v-8" />
      <path d="M10 20v-4.5h4V20" />
    </>
  ),
  // Pin lokasi dengan lengkung Jembatan Bahteramas.
  kendari: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <path d="M8.6 11.2c1-1.9 2.1-2.8 3.4-2.8s2.4.9 3.4 2.8" />
      <path d="M8.3 11.2h7.4M10.3 9.4v1.8M13.7 9.4v1.8" />
    </>
  ),
};

export function DoorIcon({ id, size = 24 }: { id: DoorId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[id]}
    </svg>
  );
}
