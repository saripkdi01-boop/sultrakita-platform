export function MarketplaceCardSkeleton() {
  return <article className="marketplace-card marketplace-card-skeleton" aria-hidden="true">
    <div className="marketplace-card-image"><span className="skeleton-shimmer skeleton-skeleton-image" /></div>
    <div className="marketplace-card-body">
      <span className="skeleton-shimmer skeleton-price" />
      <span className="skeleton-shimmer skeleton-title" />
      <span className="skeleton-shimmer skeleton-meta" />
      <div className="skeleton-seller"><span className="skeleton-shimmer skeleton-avatar" /><span className="skeleton-seller-copy"><span className="skeleton-shimmer skeleton-name" /><span className="skeleton-shimmer skeleton-subline" /></span><span className="skeleton-shimmer skeleton-rating" /></div>
      <span className="skeleton-shimmer skeleton-trust" />
      <div className="skeleton-actions"><span className="skeleton-shimmer" /><span className="skeleton-shimmer" /></div>
    </div>
  </article>;
}
