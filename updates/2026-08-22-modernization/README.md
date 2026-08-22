# SultraKita Modernization Checkpoint

This checkpoint implements the first migration-ready artifacts requested by the latest modernization prompt while preserving the existing Node.js and Cloudflare Worker production runtime. The repository is not being force-rewritten from Node/Worker to PHP/React in one release; the new stack is isolated under `modernization/` so it can be adopted behind a controlled migration boundary.

## Included artifacts

| Path | Purpose |
|---|---|
| `modernization/php/database/001_marketplace_schema.sql` | MySQL 8+ schema for users, listings, videos, and social links, with filtering and ownership indexes. |
| `modernization/php/public/get_listings.php` | PDO endpoint with strict input validation, prepared statements, pagination, safe JSON errors, and video metadata. |
| `modernization/php/public/listings.php` | Secure create/update/archive-delete mutation endpoint with PHP session validation, CSRF header validation, role checks, ownership enforcement, and prepared statements. |
| `modernization/php/app/bootstrap.php` | Shared PDO, secure session, CSRF, request body, JSON response, and ownership helpers. |
| `modernization/react/src/components/ListingCard.jsx` | Accessible cream/gold ListingCard with dark-mode classes and short-video thumbnail support. |
| `modernization/php/public/.htaccess` | Production-safe PHP directory rules and security headers for Apache deployments. |
| `modernization/react/package.json` | Minimal React/Tailwind track metadata for the component migration. |
| `updates/2026-08-22-modernization/CUTOVER-RUNBOOK.md` | Staged no-downtime cutover, dual-read, canary, mutation handoff, observability, and rollback procedure. |

## Integration sequence

First provision the SQL schema in a non-production database and confirm the target database engine. For PostgreSQL, apply the documented identity, enum, and full-text-search adaptations in the SQL file rather than running the MySQL syntax unchanged.

Next, place the PHP endpoint behind the future PHP application bootstrap. Set `DATABASE_DSN`, `DATABASE_USER`, and `DATABASE_PASSWORD` as environment variables. Never commit these values. The endpoint intentionally returns a generic error to clients and logs the diagnostic server-side.

Finally, install the React track dependencies in the future React application, copy the component, and provide callbacks for opening a listing and toggling a favorite. The component assumes Tailwind is configured with dark-mode support and that `PropTypes` is available.

## Current production boundary

The current production runtime remains the Node.js/Cloudflare Worker application. These modernization artifacts are migration-ready reference implementations and are not automatically mounted into the current Worker. A later checkpoint should add an explicit adapter or perform a separately tested cutover.
