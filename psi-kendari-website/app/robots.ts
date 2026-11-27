import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/uji-data", "/cari"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
