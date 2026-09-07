# Roadmap Execution Status

| Phase | Status | Tests | Remaining |
|---|---|---|---|
| P0-A Authorization | Improved | Regression added; full suite pending | Audit every sensitive endpoint |
| P0-B Verification | Implemented migration | Canonical badge regression added | Apply migration and verify production |
| P0-C OTP/Webhook | Existing partial controls | Existing smoke coverage | Per-phone cooldown, telemetry, signature matrix |
| P0-D Runtime parity | Pending | Existing modernization checks | Shared service matrix and worker smoke |
| P1 Marketplace E2E | Existing partial | Existing local E2E | Complete discovery-to-review acceptance |
| F2.3 AI Listing Assistant | Hardened and deployed | `npm run test:ai-listing`; Next.js type-check/build | Add provider telemetry, manual QA with real seller photos, then define F2.4 |

## F2.3 Delivery Notes

- **Scope completed:** Gemini fallback distinguishes missing configuration, quota/rate-limit, provider availability, invalid response, and invalid image input. No fallback path fabricates listing data.
- **Seller control:** AI only fills a draft. The seller must review the generated title, description, category, and price before submitting the property form; there is no auto-publish path.
- **Create-page integration:** `AiListingAssistant` is mounted after the primary photo input. A `Properti` category result maps to the existing `rumah_sewa` form category; other category values do not overwrite the property-specific choice.
- **Verification contract:** Run `npm run test:ai-listing`, then `cd next-app && npx tsc --noEmit && npm run build` before pushing changes. Verify the latest `main` deployment in Vercel after each production push.

## Next Execution Order

1. Add privacy-safe AI usage telemetry (success/failure class and latency only; never store photo contents or API keys).
2. Run manual QA on mobile and desktop with valid JPG/PNG/WebP files, an unsupported file, and a file above 8 MB.
3. Review seller feedback and only then plan F2.4; do not expand AI scope into auto-publish or unverified price claims.
