"use client";

import { useEffect, useState } from "react";
import { browserGetPosts } from "@/lib/psi-browser";
import type { PsiPost, PsiQuery } from "@/lib/psi-types";
import { EmptyState } from "../EmptyState";
import { PsiPostsView, type PsiView } from "./PsiPostsView";
import { PsiUnavailable } from "./PsiUnavailable";

type State = { status: "loading" } | { status: "ok"; posts: PsiPost[] } | { status: "error" };

function Skeleton({ view }: { view: PsiView }) {
  if (view === "ticker") return <div className="h-10 bg-red" aria-hidden="true" />;
  const n = view === "hero" ? 1 : view === "list" || view === "compact" ? 4 : 3;
  return (
    <div aria-hidden="true" className={view === "list" || view === "compact" ? "space-y-4" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-2xl bg-bg-soft ${view === "hero" ? "h-80 sm:col-span-2 lg:col-span-3" : view === "list" || view === "compact" ? "h-16" : "h-64"}`} />
      ))}
    </div>
  );
}

/**
 * Fallback sisi klien: browser pengunjung mengambil langsung dari API psi.id
 * (bila server situs terblokir). Bila gagal juga, tampilkan pesan rapi.
 */
export function PsiClientFeed({
  query,
  view,
  sourceHref,
  emptyText = "Belum ada artikel pada rubrik ini.",
  hideWhenUnavailable = false,
  compactNotice = false,
}: {
  query: PsiQuery;
  view: PsiView;
  sourceHref?: string;
  emptyText?: string;
  hideWhenUnavailable?: boolean;
  compactNotice?: boolean;
}) {
  const [state, setState] = useState<State>({ status: "loading" });
  const key = JSON.stringify(query);

  useEffect(() => {
    const ctrl = new AbortController();
    browserGetPosts(JSON.parse(key) as PsiQuery, ctrl.signal)
      .then((posts) => setState({ status: "ok", posts }))
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: "error" });
      });
    return () => ctrl.abort();
  }, [key]);

  if (state.status === "loading") {
    return (
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">Memuat berita dari psi.id…</span>
        <Skeleton view={view} />
      </div>
    );
  }
  if (state.status === "error") {
    if (hideWhenUnavailable) return null;
    return <PsiUnavailable sourceHref={sourceHref} compact={compactNotice} />;
  }
  if (!state.posts.length) {
    if (hideWhenUnavailable) return null;
    return <EmptyState title={emptyText} />;
  }
  return <PsiPostsView posts={state.posts} view={view} />;
}
