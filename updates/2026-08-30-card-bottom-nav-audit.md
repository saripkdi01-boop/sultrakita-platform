# Card and Bottom Navigation QA — 30 Agustus 2026

The mobile bottom navigation now has five items in this order: Beranda, Video, Buat, Aktivitas, Profil. Jelajah is removed from the bottom bar, while the existing Video route remains available.

At 390x844, the composer, stories, marketplace toolbar, and bottom navigation remain within the viewport. Listing and seller cards use min-width zero, bounded media columns, text clamping, and controlled action grids to prevent overflow. At 834x1194, the feed uses a centered full-width column, listing cards use a stable media-plus-content row, and seller items use a two-column grid.

The card layer preserves existing data attributes and API calls. No backend schema or route changes were made.
