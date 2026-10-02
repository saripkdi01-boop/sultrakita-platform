// T-NEWS · Agregator RSS server-side untuk Portal Berita.
//
// - Mengambil feed publik yang terdaftar di lib/news/sources.ts dengan
//   User-Agent yang mengidentifikasi diri + timeout 12 dtk per feed.
// - Parser RSS 2.0 minimal (tanpa dependensi baru): hanya memakai pola
//   <item> standar yang sudah diverifikasi pada feed terdaftar.
// - Cache in-memory 20 menit per kategori agar sopan ke server sumber
//   (tidak menghantam penerbit setiap request). Bila fetch gagal tetapi
//   cache basi tersedia → sajikan cache basi + flag `stale` (jujur).
// - Gambar diambil HANYA dari field feed itu sendiri: <enclosure url>
//   (type image/*), <media:content url> (medium="image"), atau
//   <media:thumbnail url>. TIDAK scraping halaman artikel. Gambar adalah
//   milik penerbit dan dimuat dari CDN resmi mereka (lihat docs/NEWS-PORTAL.md).
// - Excerpt adalah teks polos ≤180 karakter dari <description>.

import { NEWS_SOURCES, sourcesForCategory, type NewsCategory, type NewsSource } from './sources';

export interface NewsItem {
  /** id stabil: guid feed, atau hash link bila guid kosong */
  id: string;
  title: string;
  /** URL artikel asli (outbound) */
  link: string;
  /** Excerpt teks polos, ≤180 karakter */
  excerpt: string;
  sourceId: string;
  sourceName: string;
  /** ISO-8601 atau null bila feed tidak memberi tanggal valid */
  publishedAt: string | null;
  /**
   * URL gambar dari field feed itu sendiri (enclosure/media:content/
   * media:thumbnail), atau null bila feed tidak menyediakannya.
   * Gambar milik penerbit — dimuat dari CDN resmi mereka.
   */
  image: string | null;
  /**
   * Kategori kanal asal item (kategori primer sumbernya).
   * Dipakai badge label saat tab "Semua" mencampur banyak kategori.
   */
  category: Exclude<NewsCategory, 'semua' | 'komunitas'>;
}

export interface NewsResult {
  items: NewsItem[];
  /** true bila data berasal dari cache basi karena upstream gagal */
  stale: boolean;
  fetchedAt: string;
}

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 menit
const FETCH_TIMEOUT_MS = 12_000;
const MAX_ITEMS = 12;
const USER_AGENT = 'SUKIApps-NewsBot/1.0 (+https://sukiapps.web.id)';

interface CacheEntry {
  at: number;
  result: NewsResult;
}

const cache = new Map<NewsCategory, CacheEntry>();

// ---------- util teks ----------

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function excerptOf(text: string, max = 180): string {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).trim()}…`;
}

/** Ambil isi tag <tag>…</tag> dari sebuah blok <item>; menangani CDATA. */
function tagText(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!m) return '';
  let v = m[1].trim();
  const cdata = v.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  if (cdata) v = cdata[1];
  return v.trim();
}

/** Ambil nilai atribut dari sebuah tag, mis. url="…". */
function attrValue(tag: string, name: string): string {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*(['"])(.*?)\\1`, 'i'));
  return m ? m[2] : '';
}

/**
 * Ekstrak URL gambar HANYA dari field feed itu sendiri (tanpa scraping
 * halaman artikel). Urutan: <media:content medium="image"> →
 * <enclosure type="image/*"> → <media:thumbnail>. URL harus http(s);
 * entitas HTML (&amp;) di-decode. Return null bila tidak ada yang valid.
 */
function imageOf(block: string): string | null {
  const candidates: string[] = [];
  for (const tag of block.match(/<media:content\b[^>]*>/gi) || []) {
    const url = attrValue(tag, 'url');
    if (url && (attrValue(tag, 'medium') === 'image' || /^image\//i.test(attrValue(tag, 'type')))) {
      candidates.push(url);
    }
  }
  for (const tag of block.match(/<enclosure\b[^>]*>/gi) || []) {
    const url = attrValue(tag, 'url');
    if (url && /^image\//i.test(attrValue(tag, 'type'))) candidates.push(url);
  }
  for (const tag of block.match(/<media:thumbnail\b[^>]*>/gi) || []) {
    const url = attrValue(tag, 'url');
    if (url) candidates.push(url);
  }
  for (const raw of candidates) {
    const url = decodeEntities(raw.trim());
    if (/^https?:\/\//i.test(url)) return url;
  }
  return null;
}

function hashId(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// ---------- parser RSS 2.0 minimal ----------

function parseRss(xml: string, source: NewsSource): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  // Kategori primer sumber (untuk badge saat tab "Semua" mencampur kategori).
  const primaryCategory = (source.categories.find((c) => c !== 'semua' && c !== 'komunitas') ?? 'teknologi') as NewsItem['category'];
  for (const block of blocks) {
    const title = stripHtml(tagText(block, 'title')).slice(0, 220);
    const guid = stripHtml(tagText(block, 'guid'));
    const linkRaw = stripHtml(tagText(block, 'link'));
    // detik memakai guid sebagai URL artikel; CNN memakai <link>.
    const link = /^https?:\/\//i.test(linkRaw) ? linkRaw : /^https?:\/\//i.test(guid) ? guid : '';
    if (!title || !link) continue;

    const pubRaw = stripHtml(tagText(block, 'pubDate')) || stripHtml(tagText(block, 'dc:date'));
    let publishedAt: string | null = null;
    if (pubRaw) {
      const d = new Date(pubRaw);
      if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({
      id: `${source.id}-${guid ? hashId(guid) : hashId(link)}`,
      title,
      link,
      excerpt: excerptOf(tagText(block, 'description') || tagText(block, 'content:encoded')),
      sourceId: source.id,
      sourceName: source.name,
      publishedAt,
      image: imageOf(block),
      category: primaryCategory,
    });
    if (items.length >= MAX_ITEMS * 2) break; // batasi parse per feed
  }
  return items;
}

async function fetchSource(source: NewsSource): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    // Jangan simpan di fetch-cache Next: cache diatur manual di bawah.
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} dari ${source.id}`);
  const xml = await res.text();
  if (!/<rss|<feed/i.test(xml.slice(0, 2000))) throw new Error(`Bukan feed valid: ${source.id}`);
  return parseRss(xml, source);
}

// ---------- API publik ----------

/**
 * Ambil berita untuk kategori. Urutan: cache segar → fetch upstream →
 * cache basi (stale) → throw.
 */
export async function getNews(category: NewsCategory): Promise<NewsResult> {
  const now = Date.now();
  const hit = cache.get(category);
  if (hit && now - hit.at < CACHE_TTL_MS) {
    return { ...hit.result, stale: false };
  }

  const sources = sourcesForCategory(category);
  const settled = await Promise.allSettled(sources.map(fetchSource));

  const merged: NewsItem[] = [];
  const seen = new Set<string>();
  for (const r of settled) {
    if (r.status !== 'fulfilled') continue;
    for (const item of r.value) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      merged.push(item);
    }
  }
  merged.sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
  });

  if (merged.length > 0) {
    const result: NewsResult = {
      items: merged.slice(0, MAX_ITEMS),
      stale: false,
      fetchedAt: new Date().toISOString(),
    };
    cache.set(category, { at: now, result });
    return result;
  }

  // Upstream gagal total: sajikan cache basi bila ada (jujur via flag stale).
  if (hit) return { ...hit.result, stale: true };
  throw new Error('Semua sumber berita tidak dapat dijangkau dan tidak ada cache.');
}

/** Untuk testing/diagnostik: kosongkan cache. */
export function clearNewsCache(): void {
  cache.clear();
}
