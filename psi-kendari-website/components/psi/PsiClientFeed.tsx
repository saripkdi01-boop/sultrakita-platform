"use client";

import { useEffect, useState } from "react";
import { browserGetPosts } from "@/lib/psi-browser";
import type { PsiPost, PsiQuery } from "@/lib/psi-types";
import { EmptyState } from "../EmptyState";
import { PsiPostsView, type PsiView } from "./PsiPostsView";
import { PsiUnavailable } from "./PsiUnavailable";
import { TickerPlaceholder } from "../Ticker";

type State = { status: "loading" } | { status: "ok"; posts: PsiPost[] } | { status: "error" };

/** Tinggi kerangka dibuat setara pesan "tidak dapat dimuat" agar tata letak tidak bergeser. */
function Skeleton({ view, compact }: { view: PsiView; compact: boolean }) {
  if (view === "ticker") return <TickerPlaceholder state="loading" />;
  if (compact) return <div aria-hidden="true" className="h-12 animate-pulse rounded-xl bg-bg-soft" />;
  return <div aria-hidden="true" className="h-44 animate-pulse rounded-2xl bg-bg-soft" />;
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
        <Skeleton view={view} compact={compactNotice} />
      </div>
    );
  }
  if (state.status === "error") {
    if (view === "ticker") return <TickerPlaceholder />;
    if (hideWhenUnavailable) return null;
    return <PsiUnavailable sourceHref={sourceHref} compact={compactNotice} />;
  }
  if (!state.posts.length) {
    if (hideWhenUnavailable) return null;
    return <EmptyState title={emptyText} />;
  }
  return <PsiPostsView posts={state.posts} view={view} />;
}
