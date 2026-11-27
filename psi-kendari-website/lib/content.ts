import "server-only";
/**
 * Pemuat konten lokal dari folder /content (Markdown + JSON), dibaca saat build/ISR.
 * Skema terdokumentasi di content/README.md. Tanpa database / CMS eksternal.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { parseLabel, type VerificationLabel } from "./labels";
import { slugify, stripHtml, truncate } from "./text";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<T>(rel: string): T | null {
  const file = path.join(CONTENT_DIR, rel);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch (e) {
    console.warn(`[content] JSON tidak valid: ${rel}`, e);
    return null;
  }
}

function listFiles(dir: string, ext: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext) && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
    .sort();
}

function toIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string" && v.trim()) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
  }
  return "";
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2", "h3", "h4"]),
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height", "loading"] },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => ({
        tagName,
        attribs: /^https?:\/\//i.test(attribs.href || "")
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : attribs,
      }),
    },
  });
}

/* ------------------------------ Struktur ------------------------------ */

export type Pengurus = { jabatan: string; nama: string | null; foto?: string | null; catatan?: string | null };
export type Kantor = { alamat: string[]; catatan?: string | null };
export type Struktur = {
  tingkat: string;
  nama: string;
  sk: { nomor: string; penerbit: string } | null;
  pengurus: Pengurus[];
  catatan?: string | null;
  kantor?: Kantor | null;
  anggota_tercatat?: { jumlah: number; sumber: string; sumber_url?: string | null } | null;
  sumber_url?: string | null;
};
export type Wilayah = {
  slug: string;
  nama: string;
  jenis: "Kota" | "Kabupaten";
  dpd: string;
  pengurus: Pengurus[];
  sk: { nomor: string; penerbit: string } | null;
  kantor: Kantor | null;
  catatan?: string | null;
  antara_feed?: string | null;
  data_pemilu?: string | null;
};

export function getStrukturDPP(): Struktur | null {
  return readJson<Struktur>("struktur/dpp.json");
}
export function getStrukturDPW(): Struktur | null {
  return readJson<Struktur>("struktur/dpw-sultra.json");
}
export function getWilayahList(): Wilayah[] {
  return readJson<{ wilayah: Wilayah[] }>("struktur/dpd.json")?.wilayah ?? [];
}
export function getWilayah(slug: string): Wilayah | null {
  return getWilayahList().find((w) => w.slug === slug) ?? null;
}
/** "terisi" hanya bila ada nama pengurus di file data lokal. */
export function wilayahTerisi(w: Pick<Wilayah, "pengurus">): boolean {
  return w.pengurus.some((p) => Boolean(p.nama));
}

/* ---------------------------- Berita lokal ---------------------------- */

export type BeritaLokal = {
  slug: string;
  judul: string;
  tanggal: string;
  penulis: string;
  rubrik: string;
  label: VerificationLabel;
  gambar: { src: string; alt: string; kredit?: string } | null;
  ringkasan: string;
  wilayah: string | null;
  sumber: { nama: string; url?: string }[];
  html: string;
  teks: string;
};

export function getBeritaLokal(): BeritaLokal[] {
  return listFiles("berita-lokal", ".md")
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, "berita-lokal", file), "utf8");
      const { data, content } = matter(raw);
      const html = renderMarkdown(content);
      const teks = stripHtml(html);
      const g = data.gambar as unknown;
      const gambar =
        typeof g === "string" && g
          ? { src: g, alt: str(data.judul) }
          : g && typeof g === "object" && typeof (g as { src?: unknown }).src === "string"
            ? {
                src: (g as { src: string }).src,
                alt: str((g as { alt?: unknown }).alt) || str(data.judul),
                kredit: str((g as { kredit?: unknown }).kredit) || undefined,
              }
            : null;
      return {
        slug: str(data.slug) || slugify(file.replace(/\.md$/, "")),
        judul: str(data.judul) || "(tanpa judul)",
        tanggal: toIso(data.tanggal),
        penulis: str(data.penulis) || "Redaksi",
        rubrik: str(data.rubrik) || "Kendari & Sultra",
        label: parseLabel(data.label, "DILAPORKAN_MEDIA"),
        gambar,
        ringkasan: truncate(str(data.ringkasan) || teks, 280),
        wilayah: str(data.wilayah) || null,
        sumber: Array.isArray(data.sumber)
          ? (data.sumber as unknown[])
              .map((s) =>
                typeof s === "string"
                  ? { nama: s }
                  : { nama: str((s as { nama?: unknown }).nama), url: str((s as { url?: unknown }).url) || undefined },
              )
              .filter((s) => s.nama)
          : [],
        html,
        teks,
      } satisfies BeritaLokal;
    })
    .filter((b) => b.tanggal)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export function getBeritaLokalBySlug(slug: string): BeritaLokal | null {
  return getBeritaLokal().find((b) => b.slug === slug) ?? null;
}

/* ----------------------------- Klarifikasi ----------------------------- */

export type Fakta = { teks: string; sumber: string; tanggal?: string; url?: string };
export type Klarifikasi = {
  slug: string;
  judul: string;
  tanggal: string;
  label: VerificationLabel;
  klaim: string;
  pertama_beredar: string;
  fakta: Fakta[];
  belum_diketahui: string[];
  keputusan: string;
  penulis: string;
  html: string;
};

export function getKlarifikasi(): Klarifikasi[] {
  return listFiles("klarifikasi", ".md")
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, "klarifikasi", file), "utf8");
      const { data, content } = matter(raw);
      const fakta = Array.isArray(data.fakta)
        ? (data.fakta as Record<string, unknown>[]).map((f) => ({
            teks: str(f.teks),
            sumber: str(f.sumber),
            tanggal: toIso(f.tanggal) || str(f.tanggal) || undefined,
            url: str(f.url) || undefined,
          }))
        : [];
      return {
        slug: str(data.slug) || slugify(file.replace(/\.md$/, "")),
        judul: str(data.judul) || "(tanpa judul)",
        tanggal: toIso(data.tanggal),
        label: parseLabel(data.label, "DILAPORKAN_MEDIA"),
        klaim: str(data.klaim),
        pertama_beredar: str(data.pertama_beredar) || "Belum diketahui.",
        fakta,
        belum_diketahui: Array.isArray(data.belum_diketahui) ? (data.belum_diketahui as unknown[]).map(str).filter(Boolean) : [],
        keputusan: str(data.keputusan),
        penulis: str(data.penulis) || "Redaksi",
        html: content.trim() ? renderMarkdown(content) : "",
      } satisfies Klarifikasi;
    })
    .filter((k) => k.tanggal)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export function getKlarifikasiBySlug(slug: string): Klarifikasi | null {
  return getKlarifikasi().find((k) => k.slug === slug) ?? null;
}

/* -------------------------------- Agenda -------------------------------- */

export type AgendaStatus = "terjadwal" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan";
export type Agenda = {
  id: string;
  judul: string;
  mulai: string;
  selesai?: string;
  tempat: string;
  wilayah?: string;
  penyelenggara: string;
  status: AgendaStatus;
  keterangan?: string;
  sumber?: string;
};

export function getAgenda(): Agenda[] {
  const items: Agenda[] = [];
  for (const file of listFiles("agenda", ".json")) {
    const data = readJson<{ agenda?: Agenda[] } | Agenda[]>(`agenda/${file}`);
    const list = Array.isArray(data) ? data : data?.agenda ?? [];
    for (const a of list) {
      if (!a || !a.judul || !toIso(a.mulai)) continue;
      items.push({ ...a, mulai: toIso(a.mulai), selesai: a.selesai ? toIso(a.selesai) : undefined });
    }
  }
  return items.sort((a, b) => a.mulai.localeCompare(b.mulai));
}

/* ------------------------------ Data pemilu ------------------------------ */

export type DataPemilu = {
  id: string;
  judul: string;
  pemilu: string;
  lembaga: string;
  wilayah: string;
  partai: string;
  total_suara_partai: number;
  total_suara_sah: number;
  dapil: { nama: string; suara: number; cakupan_wilayah: string | null }[];
  sumber: { dokumen: string; penerbit: string; status_verifikasi: string; url: string | null };
  catatan: string[];
};

export function getDataPemilu(id: string): DataPemilu | null {
  const d = readJson<DataPemilu>(`data-pemilu/${id}.json`);
  if (!d) return null;
  const sum = d.dapil.reduce((s, x) => s + x.suara, 0);
  if (sum !== d.total_suara_partai) {
    console.warn(`[content] data-pemilu/${id}: jumlah dapil (${sum}) ≠ total (${d.total_suara_partai})`);
  }
  return d;
}

/* ------------------------------ Galeri lokal ----------------------------- */

export type FotoLokal = { src: string; alt: string; keterangan?: string; kredit: string; tanggal?: string };

export function getGaleriLokal(): FotoLokal[] {
  const data = readJson<{ foto?: FotoLokal[] }>("galeri/galeri.json");
  return (data?.foto ?? []).filter((f) => f.src && f.alt && f.kredit);
}
