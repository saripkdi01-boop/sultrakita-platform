export default function PropertiLoading() {
  return (
    <div className="platform-shell mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-5 lg:px-8 lg:pt-5" aria-busy="true" aria-label="Memuat properti">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: 32 }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 16 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-card skeleton-shimmer" aria-hidden="true">
            <div className="skeleton-thumb" /><div className="skeleton-line" style={{ width: '80%' }} /><div className="skeleton-line" style={{ width: '50%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
