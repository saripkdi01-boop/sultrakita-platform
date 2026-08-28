# Admin product import QA — 2026-08-28

The temporary local preview verified the complete admin interaction contract with representative Tokopedia data. The source-link form accepts the supported marketplace workflow, the saved draft row opens an editable title, price, condition, category, district, and AI-local description, and the card preview renders the selected source image at a marketplace-friendly 4:3 ratio with a source badge and multi-image count. The interface remains responsive at the tested viewport and the browser console produced no errors after opening the draft editor.

The preview harness and mock data were removed before deployment. Production metadata fetching remains server-side, restricted to HTTPS allowlisted marketplace domains, follows redirects manually, and stores source attribution for reviewed native listings. Publication is a separate RBAC-protected action requiring the `approve_listings` permission.
