// Skeleton SSR halaman marketplace (loading.tsx) — tampil saat server menyiapkan data.
export default function MarketplaceLoading() {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '12px 16px 96px' }} aria-busy="true" aria-label="Memuat marketplace">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: 32 }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', marginTop: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14, marginTop: 20 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-thumb skeleton-shimmer" />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '50%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
