import type { PsiListResult, PsiQuery } from "@/lib/psi-types";
import { EmptyState } from "../EmptyState";
import { PsiClientFeed } from "./PsiClientFeed";
import { PsiPostsView, type PsiView } from "./PsiPostsView";

/**
 * Render hasil server; bila server gagal mengambil psi.id, serahkan ke
 * fallback browser dengan kueri yang sama.
 */
export function PsiPosts({
  result,
  query,
  view,
  sourceHref,
  emptyText = "Belum ada artikel pada rubrik ini.",
  priority = false,
  hideWhenUnavailable = false,
}: {
  result: PsiListResult;
  query: PsiQuery;
  view: PsiView;
  sourceHref?: string;
  emptyText?: string;
  priority?: boolean;
  hideWhenUnavailable?: boolean;
}) {
  if (result.ok) {
    if (!result.posts.length) return hideWhenUnavailable ? null : <EmptyState title={emptyText} />;
    return <PsiPostsView posts={result.posts} view={view} priority={priority} />;
  }
  return (
    <PsiClientFeed
      query={query}
      view={view}
      sourceHref={sourceHref}
      emptyText={emptyText}
      hideWhenUnavailable={hideWhenUnavailable}
    />
  );
}
