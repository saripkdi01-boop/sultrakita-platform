# Admin Product Import — Source Notes

The repository policy requires that external product links are handled as public metadata or via authorized feeds, not as unrestricted page scraping. Existing policy references are preserved in `docs/EXTERNAL-CATALOG-INTEGRATION.md` and `docs/UNIVERSAL-LINK-CARDS.md`.

Relevant official references:

- Open Graph protocol: https://ogp.me/
- Shopee Open Platform Developer Guide: https://open.shopee.com/developer-guide/4
- Meta Instagram Platform Overview: https://developers.facebook.com/documentation/instagram-platform/overview
- Meta Business Discovery: https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/business-discovery
- Meta Instagram Media API: https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media

Implementation implication: the admin tool should validate HTTPS and an allowlist, block private-network targets and redirects, read only bounded public metadata (`og:title`, `og:description`, `og:image`), preserve the original source URL and provenance, and require admin review before publishing a native listing. The UI should support manually uploaded/authorized images when a marketplace page does not expose reusable product images.
