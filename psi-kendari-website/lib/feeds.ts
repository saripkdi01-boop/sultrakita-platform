import "server-only";
/**
 * Agregasi RSS (server). Judul + ringkasan ≤ 280 karakter + SATU gambar mini dari feed
 * sumber (dimuat langsung dari server media, tidak disalin) + nama media + tanggal +
 * tautan keluar. Deduplikasi berdasarkan URL terkanonik & kemiripan judul.
 * Semua item berlabel "DILAPORKAN MEDIA" sampai diverifikasi admin.
 */
import Parser from "rss-parser";
import { REVALIDATE_SECONDS, SITE, YOUTUBE_CHANNEL_ID } from "@/config/site";
import { FEEDS, KATA_POLITIK, type FeedKategori, type FeedSource } from "@/config/feeds";
import type { CardItem } from "./card";
import { decodeEntities, normalizeTitle, stripHtml, summarize } from "./text";

export type FeedItem = {
  id: string;
  title: string;
  link: string;
  summary: string;
  date: string;
  source: string;
  sourceId: string;
  kategori: FeedKategori;
  /** Satu gambar mini dari feed sumber (https), atau null bila feed tidak menyediakan. */
  image: string | null;
};

export type FeedStatus = { id: string; nama: string; ok: boolean; count: number; error?: string };

const USER_AGENT = `psi-kendari-website/1.0 (+${SITE.url}; RSS reader)`;
type MediaNode = { $?: { url?: string; medium?: string; type?: string } };
type ExtraItemFields = {
  /** Tempo memakai elemen <img>URL</img>. */
  tempoImg?: string;
  mediaContent?: MediaNode[];
  mediaThumbnail?: MediaNode[];
};

const parser = new Parser<Record<string, never>, ExtraItemFields>({
  timeout: 10_000,
  customFields: {
    item: [
      ["img", "tempoImg"],
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

const IMG_EXT = /\.(jpe?g|png|webp|avif)(\?|$)/i;

/** Rapikan URL gambar: absolut, https, dan pakai ukuran mini bila CDN menyediakannya. */
function normalizeImage(raw: string | undefined, base: string): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(decodeEntities(raw.trim()), base);
  } catch {
    return null;
  }
  if (url.protocol === "http:") url.protocol = "https:";
  if (url.protocol !== "https:") return null;
  if (/\.gif(\?|$)/i.test(url.pathname) || /pixel|tracking|feedburner/i.test(url.href)) return null;
  // ANTARA menyediakan versi 350x233 (±16 KB) untuk setiap gambar 800x533 (±50 KB).
  if (url.hostname === "img.antaranews.com") url.pathname = url.pathname.replace("/cache/800x533/", "/cache/350x233/");
  return url.toString();
}

/** Ambil SATU gambar per item: enclosure → media:content/thumbnail → <img> (Tempo) → <img> pertama di deskripsi. */
function pickImage(
  it: Parser.Item & ExtraItemFields,
  link: string,
): string | null {
  const enc = it.enclosure;
  if (enc?.url && (enc.type?.startsWith("image/") || IMG_EXT.test(enc.url))) {
    const u = normalizeImage(enc.url, link);
    if (u) return u;
  }
  for (const m of [...(it.mediaContent ?? []), ...(it.mediaThumbnail ?? [])]) {
    const a = m?.$;
    if (a?.url && (!a.medium || a.medium === "image") && (!a.type || a.type.startsWith("image/"))) {
      const u = normalizeImage(a.url, link);
      if (u) return u;
    }
  }
  if (typeof it.tempoImg === "string") {
    const u = normalizeImage(it.tempoImg, link);
    if (u) return u;
  }
  const html = decodeEntities(it.content ?? "");
  const src = /<img[^>]+src=["']([^"']+)["']/i.exec(html)?.[1];
  return normalizeImage(src, link);
}

/** Dekode body sesuai deklarasi XML (mis. Tempo mengirim header ISO-8859-15 untuk XML UTF-8). */
function decodeXml(buf: ArrayBuffer, header: string | null): string {
  const head = new TextDecoder("latin1").decode(buf.slice(0, 200));
  const decl = /encoding=["']([\w-]+)["']/i.exec(head)?.[1];
  const fromHeader = header ? /charset=([\w-]+)/i.exec(header)?.[1] : undefined;
  for (const cs of [decl, fromHeader, "utf-8"]) {
    if (!cs) continue;
    try {
      return new TextDecoder(cs.toLowerCase()).decode(buf);
    } catch {
      /* charset tidak dikenal, coba berikutnya */
    }
  }
  return new TextDecoder().decode(buf);
}

/** URL terkanonik untuk deduplikasi: tanpa query pelacak, tanpa fragmen, tanpa slash akhir. */
export function canonicalUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = "";
    for (const k of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$|source$|from$)/i.test(k)) url.searchParams.delete(k);
    }
    url.hostname = url.hostname.replace(/^(www|m|amp)\./, "");
    url.protocol = "https:";
    return url.toString().replace(/\/$/, "");
  } catch {
    return u.trim();
  }
}

function tokens(t: string): Set<string> {
  return new Set(normalizeTitle(t).split(" ").filter((w) => w.length > 2));
}

/** Kemiripan judul (Jaccard token) — ≥ 0,8 dianggap berita yang sama. */
export function titleSimilarity(a: string, b: string): number {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

const KATA_NORMAL = KATA_POLITIK.map((k) => ` ${normalizeTitle(k)} `);

function isPolitik(text: string): boolean {
  const t = ` ${normalizeTitle(text)} `;
  return KATA_NORMAL.some((k) => t.includes(k));
}

function cleanSummary(raw: string | undefined, title: string): string {
  let s = summarize(raw ? decodeEntities(raw) : "", 600);
  // Beberapa feed (mis. Bawaslu) mengulang judul di awal deskripsi.
  if (s.toLowerCase().startsWith(title.toLowerCase())) s = s.slice(title.length).trim();
  return summarize(s, 280);
}

/* ---------------- Batas laju per host (sopan terhadap server media) ----------------
 * ANTARA membalas HTTP 429 bila puluhan feed diminta bersamaan (mis. saat build
 * membuat 13 halaman wilayah sekaligus). Permintaan ke host di bawah ini diantrikan:
 * satu per satu dengan jeda, ditambah satu kali coba ulang bila tetap kena 429/503. */
const HOST_GAP_MS: Record<string, number> = {
  "sultra.antaranews.com": 1000,
  "www.antaranews.com": 1000,
};
const hostQueues = new Map<string, Promise<unknown>>();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function throttled<T>(url: string, task: () => Promise<T>): Promise<T> {
  const host = new URL(url).hostname;
  const gap = HOST_GAP_MS[host];
  if (!gap) return task();
  const prev = hostQueues.get(host) ?? Promise.resolve();
  const run = prev.then(task, task);
  hostQueues.set(
    host,
    run.then(
      () => wait(gap),
      () => wait(gap),
    ),
  );
  return run;
}

async function fetchXml(src: FeedSource): Promise<Response> {
  const doFetch = () =>
    fetch(src.url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["rss", `rss:${src.id}`] },
      signal: AbortSignal.timeout(10_000),
    });
  return throttled(src.url, async () => {
    const res = await doFetch();
    if (res.status !== 429 && res.status !== 503) return res;
    await res.body?.cancel().catch(() => {});
    const retryAfter = Number(res.headers.get("retry-after"));
    await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 2000);
    return doFetch();
  });
}

async function fetchFeed(src: FeedSource): Promise<{ items: FeedItem[]; status: FeedStatus }> {
  try {
    const res = await fetchXml(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = decodeXml(await res.arrayBuffer(), res.headers.get("content-type"));
    if (!/<(rss|feed|rdf:RDF)[\s>]/i.test(xml.slice(0, 2000))) throw new Error("bukan RSS/Atom");
    const feed = await parser.parseString(xml);
    const items: FeedItem[] = [];
    for (const it of feed.items ?? []) {
      const title = stripHtml(it.title ?? "");
      const link = (it.link ?? "").trim();
      const date = it.isoDate || (it.pubDate ? new Date(it.pubDate).toISOString() : "");
      if (!title || !/^https?:\/\//.test(link) || !date || Number.isNaN(Date.parse(date))) continue;
      const summary = cleanSummary(it.contentSnippet || it.content || it.summary, title);
      if (src.saringPolitik && !isPolitik(`${title} ${summary}`)) continue;
      items.push({
        id: `${src.id}:${canonicalUrl(link)}`,
        title,
        link,
        summary,
        date,
        source: src.nama,
        sourceId: src.id,
        image: pickImage(it, link),
        kategori: src.kategori,
      });
      if (items.length >= (src.maks ?? 20)) break;
    }
    return { items, status: { id: src.id, nama: src.nama, ok: true, count: items.length } };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.warn(`[feeds] ${src.id} gagal: ${error}`);
    return { items: [], status: { id: src.id, nama: src.nama, ok: false, count: 0, error } };
  }
}

/** Gabung, deduplikasi (URL terkanonik + kemiripan judul), urutkan terbaru. */
export function dedupe(items: FeedItem[]): FeedItem[] {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const seen = new Set<string>();
  const kept: FeedItem[] = [];
  for (const it of sorted) {
    const key = canonicalUrl(it.link);
    if (seen.has(key)) continue;
    if (kept.some((k) => titleSimilarity(k.title, it.title) >= 0.8)) continue;
    seen.add(key);
    kept.push(it);
  }
  return kept;
}

export async function getPolitikTerbaru(opts: { limit?: number; maxAgeDays?: number } = {}): Promise<{ items: FeedItem[]; status: FeedStatus[] }> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const all = results.flatMap((r) => r.items);
  const newest = all.reduce((m, it) => Math.max(m, Date.parse(it.date)), 0);
  const cutoff = newest - (opts.maxAgeDays ?? 21) * 86_400_000;
  const items = dedupe(all.filter((it) => Date.parse(it.date) >= cutoff)).slice(0, opts.limit ?? 60);
  return { items, status: results.map((r) => r.status) };
}

export async function getFeedItems(src: FeedSource, limit = 8): Promise<{ items: FeedItem[]; status: FeedStatus }> {
  const r = await fetchFeed(src);
  return { items: dedupe(r.items).slice(0, limit), status: r.status };
}

export function feedToCard(it: FeedItem): CardItem {
  return {
    key: it.id,
    title: it.title,
    href: it.link,
    external: true,
    excerpt: it.summary,
    date: it.date,
    rubrik: it.kategori === "pemilu" ? "Pemilu" : it.kategori === "lokal" ? "Sultra" : "Nasional",
    label: "DILAPORKAN_MEDIA",
    source: it.source,
    image: it.image ? { src: it.image, alt: it.title, credit: `Foto: ${it.source}` } : null,
  };
}

/* ------------------------------- YouTube ------------------------------- */

export type Video = { id: string; title: string; date: string; url: string };

/** Video terbaru kanal YouTube resmi PSI (SolidaritasID) dari feed RSS publik YouTube. */
export async function getYoutubeVideos(limit = 4): Promise<{ ok: boolean; videos: Video[] }> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["youtube"] },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    const videos: Video[] = [];
    for (const e of entries) {
      const id = /<yt:videoId>([\w-]{6,20})<\/yt:videoId>/.exec(e)?.[1];
      const title = /<title>([\s\S]*?)<\/title>/.exec(e)?.[1];
      const date = /<published>([^<]+)<\/published>/.exec(e)?.[1];
      if (!id || !title || !date) continue;
      videos.push({ id, title: decodeEntities(title).trim(), date, url: `https://www.youtube.com/watch?v=${id}` });
      if (videos.length >= limit) break;
    }
    return { ok: true, videos };
  } catch (e) {
    console.warn(`[youtube] gagal: ${e instanceof Error ? e.message : e}`);
    return { ok: false, videos: [] };
  }
}
