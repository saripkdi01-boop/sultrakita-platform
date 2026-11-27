/**
 * Pengambilan psi.id dari BROWSER pengunjung (fallback).
 * Dipakai hanya bila server tidak dapat mengambil data (mis. Cloudflare challenge).
 */
import { buildPostsUrl, normalizePost, type WpPost } from "./psi-normalize";
import type { PsiPost, PsiQuery } from "./psi-types";

export const BROWSER_PSI_BASE = (
  process.env.NEXT_PUBLIC_PSI_API_BASE || "https://psi.id/wp-json/wp/v2"
).replace(/\/$/, "");

async function getList(url: string, signal?: AbortSignal): Promise<WpPost[]> {
  const res = await fetch(url, {
    mode: "cors",
    credentials: "omit",
    headers: { Accept: "application/json" },
    signal,
  });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("json")) throw new Error(`psi.id ${res.status}`);
  const json: unknown = await res.json();
  return Array.isArray(json) ? (json as WpPost[]) : [];
}

export async function browserGetPosts(q: PsiQuery, signal?: AbortSignal): Promise<PsiPost[]> {
  const perPage = q.perPage ?? 10;
  if (q.keywords?.length) {
    const lists = await Promise.all(
      q.keywords.map((k) => getList(buildPostsUrl(BROWSER_PSI_BASE, { ...q, search: k, keywords: undefined }), signal)),
    );
    const byId = new Map<number, PsiPost>();
    for (const l of lists) for (const p of l) byId.set(p.id, normalizePost(p));
    return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, perPage);
  }
  const list = await getList(buildPostsUrl(BROWSER_PSI_BASE, q), signal);
  return list.map((p) => normalizePost(p));
}

export async function browserGetPostBySlug(slug: string, signal?: AbortSignal): Promise<PsiPost | null> {
  const url = new URL(`${BROWSER_PSI_BASE}/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "wp:featuredmedia,author");
  const list = await getList(url.toString(), signal);
  return list[0] ? normalizePost(list[0], true) : null;
}
