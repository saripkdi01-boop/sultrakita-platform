/**
 * Normalisasi JSON WordPress REST API (psi.id) -> PsiPost.
 * Murni (tanpa API Node) sehingga dipakai server & fallback browser.
 */
import { resolveRubrik } from "@/config/psi-categories";
import { decodeEntities, stripHtml, summarize } from "./text";
import type { PsiPost, PsiQuery } from "./psi-types";

type WpRendered = { rendered?: string };
type WpMediaSize = { source_url?: string; width?: number; height?: number };
type WpMedia = {
  source_url?: string;
  alt_text?: string;
  caption?: WpRendered;
  media_details?: { width?: number; height?: number; sizes?: Record<string, WpMediaSize> };
};
export type WpPost = {
  id: number;
  slug: string;
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
  link?: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: (WpMedia & { code?: string })[];
    author?: { name?: string }[];
  };
};

function toIsoUtc(gmt?: string, local?: string): string {
  if (gmt && /^\d{4}-\d{2}-\d{2}T/.test(gmt)) return gmt.endsWith("Z") ? gmt : `${gmt}Z`;
  if (local) {
    // psi.id berada di zona WIB (UTC+7) bila date_gmt tidak tersedia.
    return /[zZ]|[+-]\d{2}:?\d{2}$/.test(local) ? local : `${local}+07:00`;
  }
  return "";
}

function isHttps(u: unknown): u is string {
  return typeof u === "string" && /^https:\/\//i.test(u);
}

export function normalizePost(p: WpPost, withContent = false): PsiPost {
  const categories = Array.isArray(p.categories) ? p.categories : [];
  const { rubrik, label } = resolveRubrik(categories);

  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  let image: PsiPost["image"] = null;
  if (media && !media.code && isHttps(media.source_url)) {
    const sizes = media.media_details?.sizes ?? {};
    const card = sizes.medium_large ?? sizes.large ?? sizes.medium ?? null;
    const caption = media.caption?.rendered ? stripHtml(media.caption.rendered) : undefined;
    image = {
      src: media.source_url,
      cardSrc: card && isHttps(card.source_url) ? card.source_url : media.source_url,
      alt: decodeEntities(media.alt_text || "").trim(),
      width: media.media_details?.width,
      height: media.media_details?.height,
      caption: caption || undefined,
    };
  }

  const title = stripHtml(p.title?.rendered ?? "") || "(tanpa judul)";
  const post: PsiPost = {
    id: p.id,
    slug: p.slug,
    title,
    excerpt: summarize(p.excerpt?.rendered ?? p.content?.rendered ?? "", 280),
    date: toIsoUtc(p.date_gmt, p.date),
    modified: toIsoUtc(p.modified_gmt, p.modified),
    link: isHttps(p.link) ? p.link : `https://psi.id/${p.slug}/`,
    categories,
    rubrik,
    rubrikLabel: label,
    image,
    author: p._embedded?.author?.[0]?.name ? decodeEntities(p._embedded.author[0].name) : null,
  };
  if (withContent) post.contentHtml = p.content?.rendered ?? "";
  if (image && !image.alt) image.alt = title;
  return post;
}

/** Bangun URL /posts dari PsiQuery (dipakai server & browser). */
export function buildPostsUrl(base: string, q: PsiQuery): string {
  const url = new URL(base.replace(/\/$/, "") + "/posts");
  url.searchParams.set("_embed", "wp:featuredmedia,author");
  url.searchParams.set("per_page", String(Math.min(Math.max(q.perPage ?? 10, 1), 100)));
  url.searchParams.set("page", String(Math.max(q.page ?? 1, 1)));
  if (q.categories?.length) url.searchParams.set("categories", q.categories.join(","));
  if (q.search) url.searchParams.set("search", q.search);
  if (q.exclude?.length) url.searchParams.set("exclude", q.exclude.join(","));
  return url.toString();
}

export function matchesKeywords(post: PsiPost, keywords?: string[], content?: string): boolean {
  if (!keywords?.length) return true;
  const hay = `${post.title} ${post.excerpt} ${content ?? ""}`.toLowerCase();
  return keywords.some((k) => hay.includes(k.toLowerCase()));
}

/** Deteksi respons challenge/anti-bot (bukan JSON API). */
export function looksBlocked(status: number, contentType: string | null, cfMitigated: string | null): boolean {
  if (cfMitigated) return true;
  if (contentType && !contentType.includes("json")) return true;
  return status === 403 || status === 429 || status === 503;
}
