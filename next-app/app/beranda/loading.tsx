export default function BerandaLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6" aria-busy="true" aria-label="Memuat beranda">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '50%', height: 36 }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '70%', marginTop: 12 }} />
      <div className="grid gap-4 sm:grid-cols-3" style={{ marginTop: 20 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="skeleton-card skeleton-shimmer" aria-hidden="true">
            <div className="skeleton-thumb" /><div className="skeleton-line" style={{ width: '80%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
