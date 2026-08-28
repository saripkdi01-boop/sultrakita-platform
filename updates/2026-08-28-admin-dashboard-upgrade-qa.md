# Admin Dashboard Upgrade QA — 2026-08-28

## Browser audit

The production URL `/admin/dashboard.html` and the local URL both redirect unauthenticated visitors to `/admin/index.html?next=%2Fadmin%2Fdashboard.html`. The current login surface is Google SSO only and remains unchanged by the dashboard UI upgrade.

## Security behavior observed

The unauthenticated local request to `/api/admin/v2/dashboard/overview` returned HTTP 401 with `Autentikasi diperlukan`. The local dashboard HTML returned HTTP 200 with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and the platform Content-Security-Policy. Admin HTML shells now receive no-store/no-cache headers through the Express static middleware.

## Scope decision

The upgrade binds to existing owner-only admin v2 and legacy donation analytics endpoints. It does not introduce a browser Supabase client, hardcoded anon/service keys, passwords, JWT auth, or a second credential flow.

## Preview QA

A temporary preview harness with representative API-shaped data initially exposed a layout issue: the original `data-page-content` wrapper occupied one grid column instead of the full dashboard width. The canonical dashboard shell now marks that wrapper as `admin-span-12`, and the preview renders the intended full-width 12-column layout at 1280px.

The corrected preview shows the intro/actions row, operational health strip, four KPI cards, activity bars, donation panel, recent listings, and moderation queue without horizontal overflow. Browser console output was empty after the correction. The temporary preview harness is removed before commit.
