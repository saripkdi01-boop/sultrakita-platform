"use client";

import { useEffect, useState } from "react";
import { browserGetPostBySlug } from "@/lib/psi-browser";
import { sanitizeInBrowser } from "@/lib/sanitize-client";
import type { PsiPost } from "@/lib/psi-types";
import { EmptyState } from "../EmptyState";
import { ArticleView } from "./ArticleView";
import { IconExternal } from "../icons";

type State = { status: "loading" } | { status: "ok"; post: PsiPost; html: string } | { status: "missing" } | { status: "error" };

/** Fallback artikel: dimuat dari browser bila server tidak dapat mengakses psi.id. */
export function PsiClientArticle({ slug, shareUrl }: { slug: string; shareUrl: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    browserGetPostBySlug(slug, ctrl.signal)
      .then((post) => {
        if (!post) return setState({ status: "missing" });
        setState({ status: "ok", post, html: sanitizeInBrowser(post.contentHtml ?? "") });
        document.title = `${post.title} — PSI Kendari`;
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: "error" });
      });
    return () => ctrl.abort();
  }, [slug]);

  const original = `https://psi.id/${encodeURIComponent(slug)}/`;

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-3xl" aria-busy="true">
        <span className="sr-only">Memuat artikel dari psi.id…</span>
        <div className="h-6 w-40 animate-pulse rounded bg-bg-soft" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-bg-soft" />
        <div className="mt-2 h-10 w-2/3 animate-pulse rounded bg-bg-soft" />
        <div className="mt-8 aspect-[16/9] animate-pulse rounded-2xl bg-bg-soft" />
      </div>
    );
  }
  if (state.status === "ok") return <ArticleView post={state.post} html={state.html} shareUrl={shareUrl} />;

  return (
    <div className="mx-auto max-w-3xl">
      <EmptyState
        tone="warning"
        title={state.status === "missing" ? "Artikel tidak ditemukan di psi.id" : "Artikel sementara tidak dapat dimuat"}
        action={
          <a href={original} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-strong">
            Baca di situs resmi PSI <IconExternal />
          </a>
        }
      >
        {state.status === "missing"
          ? "Tautan mungkin sudah berubah atau artikel telah dihapus."
          : "psi.id saat ini membatasi akses otomatis. Silakan baca artikel ini langsung di psi.id."}
      </EmptyState>
    </div>
  );
}
