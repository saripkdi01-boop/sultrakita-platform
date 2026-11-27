import "server-only";
/**
 * Lapisan data WordPress REST API psi.id (server).
 *
 * - Semua fungsi mengembalikan hasil bertipe (ok / gagal) dan TIDAK pernah
 *   melempar error, sehingga halaman tidak crash saat API gagal.
 * - Cache ISR: fetch dengan `next.revalidate = REVALIDATE_SECONDS` (default 900 dtk).
 * - psi.id saat ini memasang Cloudflare challenge untuk IP datacenter
 *   (termasuk Vercel). Kegagalan ini dideteksi sebagai `reason: "blocked"`
 *   dan halaman beralih ke fallback di browser pengunjung (PsiClientFeed).
 *   Kita TIDAK mencoba menembus challenge/CAPTCHA.
 */
import { REVALIDATE_SECONDS, SITE } from "@/config/site";
import { KENDARI_KEYWORDS, PSI_CAT } from "@/config/psi-categories";
import { buildPostsUrl, looksBlocked, normalizePost, type WpPost } from "./psi-normalize";
import type {
  PsiCategoriesResult,
  PsiCategory,
  PsiFailure,
  PsiListResult,
  PsiPost,
  PsiPostResult,
  PsiQuery,
} from "./psi-types";

export const DEFAULT_PSI_API_BASE = "https://psi.id/wp-json/wp/v2";
export const PSI_API_BASE = (process.env.PSI_API_BASE || DEFAULT_PSI_API_BASE).replace(/\/$/, "");

const USER_AGENT = `psi-kendari-website/1.0 (+${SITE.url})`;
const TIMEOUT_MS = 10_000;

type JsonOk = { ok: true; json: unknown; headers: Headers };

const warned = new Set<string>();
function warnOnce(key: string, msg: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[psi-api] ${msg}`);
}

async function getJson(url: string): Promise<JsonOk | PsiFailure> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["psi"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    warnOnce(`net:${new URL(url).host}`, `gagal terhubung ke ${url}: ${message}`);
    return { ok: false, reason: "network", message, url };
  }

  const ct = res.headers.get("content-type");
  const cf = res.headers.get("cf-mitigated");
  if (!res.ok || looksBlocked(res.status, ct, cf)) {
    const blocked = Boolean(cf) || res.status === 403 || res.status === 429 || res.status === 503;
    const reason = blocked ? "blocked" : res.ok ? "parse" : "http";
    const message = blocked
      ? `psi.id menolak akses otomatis (HTTP ${res.status}${cf ? `, cf-mitigated: ${cf}` : ""})`
      : `HTTP ${res.status} (${ct ?? "tanpa content-type"})`;
    warnOnce(`${reason}:${res.status}`, `${message} — ${url}`);
    // Kosongkan body agar koneksi dilepas.
    await res.body?.cancel().catch(() => {});
    return { ok: false, reason, status: res.status, message, url };
  }

  try {
    return { ok: true, json: await res.json(), headers: res.headers };
  } catch (e) {
    return { ok: false, reason: "parse", status: res.status, message: e instanceof Error ? e.message : "JSON tidak valid", url };
  }
}

function toList(json: unknown): WpPost[] {
  return Array.isArray(json) ? (json as WpPost[]).filter((p) => p && typeof p.id === "number" && typeof p.slug === "string") : [];
}

/** Daftar posting (kategori/pencarian) — fungsi dasar. */
export async function getPosts(q: PsiQuery): Promise<PsiListResult> {
  const url = buildPostsUrl(PSI_API_BASE, q);
  const r = await getJson(url);
  if (!r.ok) return r;
  const posts = toList(r.json).map((p) => normalizePost(p));
  return {
    ok: true,
    posts,
    total: Number(r.headers.get("x-wp-total") ?? posts.length) || posts.length,
    totalPages: Number(r.headers.get("x-wp-totalpages") ?? 1) || 1,
    url,
  };
}

export function getPostsByCategory(
  categoryIds: number | number[],
  page = 1,
  perPage = 10,
): Promise<PsiListResult> {
  const categories = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  return getPosts({ categories, page, perPage });
}

export async function getPostBySlug(slug: string): Promise<PsiPostResult> {
  const url = new URL(`${PSI_API_BASE}/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "wp:featuredmedia,author");
  const r = await getJson(url.toString());
  if (!r.ok) return r;
  const list = toList(r.json);
  return { ok: true, post: list[0] ? normalizePost(list[0], true) : null, url: url.toString() };
}

export function searchPosts(q: string, page = 1, perPage = 10): Promise<PsiListResult> {
  return getPosts({ search: q.slice(0, 100), page, perPage });
}

export async function getCategories(): Promise<PsiCategoriesResult> {
  const url = `${PSI_API_BASE}/categories?per_page=50&orderby=count&order=desc`;
  const r = await getJson(url);
  if (!r.ok) return r;
  const categories: PsiCategory[] = Array.isArray(r.json)
    ? (r.json as Record<string, unknown>[]).map((c) => ({
        id: Number(c.id),
        name: String(c.name ?? ""),
        slug: String(c.slug ?? ""),
        count: Number(c.count ?? 0),
        parent: Number(c.parent ?? 0),
      }))
    : [];
  return { ok: true, categories, url };
}

/**
 * Liputan Daerah yang menyebut Kendari / Sulawesi Tenggara / Sultra.
 * Memakai pencarian WordPress per kata kunci, lalu digabung & dideduplikasi.
 */
export async function getKendariPosts(perPage = 6): Promise<PsiListResult> {
  const results = await Promise.all(
    KENDARI_KEYWORDS.map((k) => getPosts({ categories: [PSI_CAT.LIPUTAN_DAERAH], search: k, perPage })),
  );
  const failed = results.find((r) => !r.ok);
  const oks = results.filter((r): r is Extract<PsiListResult, { ok: true }> => r.ok);
  if (!oks.length && failed) return failed;
  const byId = new Map<number, PsiPost>();
  for (const r of oks) for (const p of r.posts) byId.set(p.id, p);
  const posts = [...byId.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, perPage);
  return { ok: true, posts, total: posts.length, totalPages: 1, url: oks[0].url };
}

export async function getRelatedPosts(post: PsiPost, n = 4): Promise<PsiListResult> {
  const r = await getPosts({ categories: post.categories.slice(0, 3), perPage: n + 1, exclude: [post.id] });
  if (!r.ok) return r;
  return { ...r, posts: r.posts.filter((p) => p.id !== post.id).slice(0, n) };
}

export function describeFailure(f: PsiFailure): string {
  switch (f.reason) {
    case "blocked":
      return "psi.id sedang membatasi akses otomatis dari server situs ini.";
    case "network":
      return "Server situs ini tidak dapat terhubung ke psi.id.";
    case "http":
      return `psi.id mengembalikan galat HTTP ${f.status ?? ""}.`.trim();
    default:
      return "Respons psi.id tidak dapat dibaca.";
  }
}
