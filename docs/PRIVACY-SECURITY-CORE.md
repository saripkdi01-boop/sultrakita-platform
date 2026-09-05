# SultraKita Privacy & Security Core

## Implemented

The privacy/security core adds an idempotent Supabase migration for `activity_logs`, `active_sessions`, and `blocked_users`, plus the `profiles.visibility_settings` JSONB field. Row-level security limits each dataset to the authenticated owner. Session tokens are documented as one-way hashes and are never selected by the UI actions.

The Next.js settings panel now includes **Privacy**, **Keamanan**, **Aktivitas & Log**, and **Blokir & Batasi**. The Privacy panel contains the three-step Privacy Checkup and granular field visibility. The security panel lists active sessions and supports revoking one non-current session or all other sessions. The blocked users panel supports search, confirmation before unblock, and empty/loading/error states. Activity logs are read through a server action and never expose IP or user-agent data to the browser.

## Supabase setup

Apply `supabase/migrations/20260905180000_privacy_security_core.sql` to the Supabase project after confirming that `public.profiles.id` is the authenticated UUID used by the Next.js profile hook. The migration uses `IF NOT EXISTS` and named `DROP POLICY` statements so it can be safely reapplied during rollout.

The Next.js Server Actions require `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. They verify the current user with `supabase.auth.getUser()` before every read or mutation. If Supabase is not configured, the UI remains available in demo mode and shows a friendly unavailable message rather than failing the page.

## Login alerts

The session and activity foundation is ready for login alerts. Actual email or WhatsApp delivery requires a configured provider and an application event hook at the point where a new session is created. No provider credentials were invented or embedded in this change. The recommended event is: create a hashed `active_sessions` row, write a `login` activity log, then enqueue an email/WhatsApp alert only when the device fingerprint is new.

## Testing checklist

1. Apply the migration in a staging Supabase project and verify all three tables, indexes, and RLS policies.
2. Sign in with two users and verify that each user can only read, insert, or delete their own security records.
3. Open Profile Hub → Privasi → Privacy Checkup and complete all three steps.
4. Change each visibility dropdown, save, refresh, and confirm the JSONB value remains persisted.
5. Open Keamanan and revoke a non-current session; confirm the current session cannot be deleted by the UI.
6. Open Blokir & Batasi, search a user, confirm the unblock dialog, and verify the row disappears after success.
7. Open Aktivitas & Log and confirm only the signed-in user’s records are shown.
8. Test unauthenticated/demo mode and confirm friendly fallback messages appear without console crashes.
9. Run `npm run build` in `next-app` and `git diff --check` before deployment.
