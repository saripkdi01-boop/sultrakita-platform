/** Label verifikasi baku untuk SEMUA item berita/klaim. */

export type VerificationLabel =
  | "TERVERIFIKASI"
  | "DILAPORKAN_MEDIA"
  | "KLAIM_TIDAK_TERBUKTI"
  | "HOAKS_DIBANTAH"
  | "TERKLARIFIKASI";

export const LABELS: Record<VerificationLabel, { text: string; desc: string; className: string }> = {
  TERVERIFIKASI: {
    text: "TERVERIFIKASI",
    desc: "Bersumber dari kanal resmi (psi.id, dokumen KPU/SK) atau telah diperiksa admin.",
    className: "bg-ink text-white ring-1 ring-ink dark:bg-white dark:text-ink dark:ring-white",
  },
  DILAPORKAN_MEDIA: {
    text: "DILAPORKAN MEDIA",
    desc: "Dilaporkan media; belum diverifikasi admin situs ini. Baca sumber aslinya.",
    className: "bg-surface text-fg ring-1 ring-border",
  },
  KLAIM_TIDAK_TERBUKTI: {
    text: "KLAIM — TIDAK TERBUKTI",
    desc: "Klaim beredar tanpa bukti yang dapat diperiksa.",
    className: "bg-surface text-gold ring-1 ring-gold",
  },
  HOAKS_DIBANTAH: {
    text: "HOAKS — DIBANTAH",
    desc: "Klaim terbukti keliru/rekayasa berdasarkan sumber pemeriksa fakta.",
    className: "bg-red text-white ring-1 ring-red",
  },
  TERKLARIFIKASI: {
    text: "TERKLARIFIKASI",
    desc: "Telah diberi klarifikasi resmi oleh pihak terkait.",
    className: "bg-surface text-red-ink ring-1 ring-red-ink",
  },
};

export function isVerificationLabel(v: unknown): v is VerificationLabel {
  return typeof v === "string" && v in LABELS;
}

/** Terima penulisan bebas di frontmatter (mis. "HOAKS — DIBANTAH"). */
export function parseLabel(v: unknown, fallback: VerificationLabel = "DILAPORKAN_MEDIA"): VerificationLabel {
  if (isVerificationLabel(v)) return v;
  if (typeof v !== "string") return fallback;
  const norm = v.toUpperCase().replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim();
  const map: Record<string, VerificationLabel> = {
    TERVERIFIKASI: "TERVERIFIKASI",
    "TER VERIFIKASI": "TERVERIFIKASI",
    "DILAPORKAN MEDIA": "DILAPORKAN_MEDIA",
    "KLAIM TIDAK TERBUKTI": "KLAIM_TIDAK_TERBUKTI",
    "HOAKS DIBANTAH": "HOAKS_DIBANTAH",
    TERKLARIFIKASI: "TERKLARIFIKASI",
  };
  return map[norm] ?? fallback;
}
