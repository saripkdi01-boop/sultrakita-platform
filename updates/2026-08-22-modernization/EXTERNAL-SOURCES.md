# Verified External Marketplace Sources

Research date: 2026-08-22.

| Source | Verified capability | SultraKita implication |
|---|---|---|
| [Meta Content Library — Facebook Marketplace data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/) | Meta documents Marketplace search through the Content Library API path `facebook/marketplace-listings/preview`, with keyword, category, country, price, time, and media parameters. The guide frames the workflow around Secure Research Environment/cleanrooms. | Do not scrape the public website. Use the official access program only if SultraKita qualifies and has approved credentials. Store provenance and access scope. |
| [Meta Marketplace Partner Item API](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/) | Approved Marketplace partners can use Graph API item batch operations for CREATE, UPDATE, and DELETE, subject to partner/country requirements and rate limits. | Use as an outbound seller syndication adapter, not as an unrestricted public search feed. |
| [Shopee Open Platform introduction](https://open.shopee.com/developer-guide/4) | Shopee provides Open APIs for authorized software service providers and sellers, with app registration, sandbox testing, go-live, shop authorization, and push notifications. | Import only shops that explicitly authorize the SultraKita connector. No anonymous scraping. |
| [Tokopedia/TikTok Shop Products API overview](https://partner.tokopedia.com/docv2/page/products-api-overview) | The Products API supports authorized sellers/partners to create, edit, delete, and retrieve product catalog data, with product review/webhook concepts. | Use seller-authorized catalog sync and preserve external status/last-sync metadata. |

No live third-party listing records were copied into the repository. Demo fixtures must be clearly marked as synthetic or public-source examples and must not imply live availability. For real-time data, the connector must receive credentials/authorization and use the platform's official API, webhooks, or an approved feed.
