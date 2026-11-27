import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { BERITA_FILTERS } from "@/config/psi-categories";
import { getBeritaLokal, getKlarifikasi, getWilayahList } from "@/lib/content";
import { getPosts } from "@/lib/psi-api";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${SITE.url}${p}`;
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: u("/"), changeFrequency: "hourly", priority: 1, lastModified: now },
    { url: u("/berita-psi"), changeFrequency: "hourly", priority: 0.9, lastModified: now },
    { url: u("/kendari-sultra"), changeFrequency: "hourly", priority: 0.9, lastModified: now },
    { url: u("/politik-terbaru"), changeFrequency: "hourly", priority: 0.8, lastModified: now },
    { url: u("/data-pemilu"), changeFrequency: "monthly", priority: 0.8 },
    { url: u("/klarifikasi"), changeFrequency: "weekly", priority: 0.8 },
    { url: u("/profil"), changeFrequency: "monthly", priority: 0.7 },
    { url: u("/struktur"), changeFrequency: "monthly", priority: 0.7 },
    { url: u("/agenda"), changeFrequency: "weekly", priority: 0.6 },
    { url: u("/galeri"), changeFrequency: "weekly", priority: 0.6 },
    { url: u("/kontak"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const rubrik = BERITA_FILTERS.filter((f) => f.key !== "semua").map((f) => ({
    url: u(`/berita-psi/rubrik/${f.key}`),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const wilayah = getWilayahList().flatMap((w) => [
    { url: u(`/struktur/${w.slug}`), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: u(`/kendari-sultra/${w.slug}`), changeFrequency: "daily" as const, priority: 0.5 },
  ]);

  const lokal = getBeritaLokal().map((b) => ({
    url: u(`/kendari-sultra/berita/${b.slug}`),
    lastModified: new Date(b.tanggal),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const klar = getKlarifikasi().map((k) => ({
    url: u(`/klarifikasi/${k.slug}`),
    lastModified: new Date(k.tanggal),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Artikel psi.id terbaru (bila API dapat diakses dari server).
  const psi = await getPosts({ perPage: 50 });
  const artikel = psi.ok
    ? psi.posts.map((p) => ({
        url: u(`/berita-psi/${p.slug}`),
        lastModified: new Date(p.modified || p.date),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    : [];

  return [...statics, ...rubrik, ...lokal, ...klar, ...wilayah, ...artikel];
}
