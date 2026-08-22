# SEO and Cloudflare sources

- Cloudflare Workers `workers.dev`: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
  - Account subdomains use `<YOUR_ACCOUNT_SUBDOMAIN>.workers.dev`.
  - Worker URLs use `<YOUR_WORKER_NAME>.<YOUR_SUBDOMAIN>.workers.dev`.
  - Cloudflare recommends routes or custom domains for business-critical production.
- Cloudflare Workers Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
  - Custom Domains require an active Cloudflare zone and Worker.
  - Cloudflare creates the DNS record and certificate for the custom hostname.
