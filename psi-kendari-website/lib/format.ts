/** Format tanggal/angka untuk tampilan (zona waktu WITA — Asia/Makassar). */

export const TZ = "Asia/Makassar";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateShortFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const weekdayFmt = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, weekday: "long" });
const isoDayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

function toDate(iso: string | number | Date | undefined | null): Date | null {
  if (iso === undefined || iso === null || iso === "") return null;
  const d = iso instanceof Date ? iso : new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatTanggal(iso: string | undefined | null): string {
  const d = toDate(iso);
  return d ? dateFmt.format(d) : "";
}

export function formatTanggalPendek(iso: string | undefined | null): string {
  const d = toDate(iso);
  return d ? dateShortFmt.format(d) : "";
}

export function formatTanggalWaktu(iso: string | undefined | null): string {
  const d = toDate(iso);
  return d ? `${dateTimeFmt.format(d)} WITA` : "";
}

export function formatHari(iso: string | undefined | null): string {
  const d = toDate(iso);
  return d ? weekdayFmt.format(d) : "";
}

/** YYYY-MM-DD menurut WITA. */
export function isoDayWITA(iso: string | undefined | null): string {
  const d = toDate(iso);
  return d ? isoDayFmt.format(d) : "";
}

export function relativeTime(iso: string | undefined | null, now: number): string {
  const d = toDate(iso);
  if (!d) return "";
  const diff = Math.round((now - d.getTime()) / 1000);
  if (diff < 0) return formatTanggal(iso);
  if (diff < 60) return "baru saja";
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatTanggal(iso);
}

const numFmt = new Intl.NumberFormat("id-ID");
export function formatAngka(n: number): string {
  return numFmt.format(n);
}

export function formatPersen(part: number, whole: number, digits = 1): string {
  if (!whole) return "–";
  return `${new Intl.NumberFormat("id-ID", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format((part / whole) * 100)}%`;
}
