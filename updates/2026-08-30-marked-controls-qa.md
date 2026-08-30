# Marked Controls QA — 30 Agustus 2026

At 390x844, composer actions now share a three-column grid with compact icon badges, stable labels, and equal vertical alignment. The Stories section has a right-aligned Lihat semua control with consistent spacing. The bottom bar has five items and the Buat action is a contained center control rather than an oversized floating element.

At 834x1194, the same action grid scales naturally, the story cards fit a four-column frame, and the marketplace toolbar keeps Sync and Filter aligned without overlap. The listing cards below remain full-width, with stable media and content columns.

The final CSS layer also defines a true light theme using Facebook-like neutral surfaces (#f0f2f5 page background, white cards, dark text, blue primary) rather than reusing dark surfaces. Existing API and data attributes were not changed.

Interactive browser QA confirmed the light theme renders with a light gray page background, white cards, dark text, blue primary accents, white topbar, white bottom bar, and readable controls. The marked composer action row, Lihat semua CTA, and centered Buat control remain aligned in the light state as well as dark state.
