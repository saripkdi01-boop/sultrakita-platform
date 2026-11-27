import type { RubrikKey } from "@/config/psi-categories";

export type PsiImage = {
  src: string;
  cardSrc: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type PsiPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601 UTC */
  date: string;
  modified: string;
  link: string;
  categories: number[];
  rubrik: RubrikKey;
  rubrikLabel: string;
  image: PsiImage | null;
  author: string | null;
  /** HTML mentah dari API — WAJIB disanitasi sebelum dirender. */
  contentHtml?: string;
};

export type PsiCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
};

export type PsiFailureReason = "blocked" | "http" | "network" | "parse";

export type PsiFailure = {
  ok: false;
  reason: PsiFailureReason;
  status?: number;
  message: string;
  url: string;
};

export type PsiListResult =
  | { ok: true; posts: PsiPost[]; total: number; totalPages: number; url: string }
  | PsiFailure;

export type PsiPostResult = { ok: true; post: PsiPost | null; url: string } | PsiFailure;

export type PsiCategoriesResult = { ok: true; categories: PsiCategory[]; url: string } | PsiFailure;

/** Parameter kueri daftar posting yang dipakai bersama server & browser. */
export type PsiQuery = {
  categories?: number[];
  perPage?: number;
  page?: number;
  search?: string;
  /** Saring hasil secara lokal: harus memuat salah satu kata kunci. */
  keywords?: string[];
  exclude?: number[];
};
