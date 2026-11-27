/** Utilitas teks yang aman dipakai di server maupun browser. */

const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…",
  ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  laquo: "«", raquo: "»", copy: "©", reg: "®", trade: "™", bull: "•", middot: "·",
};

export function decodeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

export function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Potong teks pada batas kata; hasil (termasuk elipsis) tidak lebih dari `max` karakter. */
export function truncate(text: string, max = 280): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  const base = sp > max * 0.6 ? cut.slice(0, sp) : cut;
  return base.replace(/[\s,.;:–—-]+$/u, "") + "…";
}

/** Ringkasan bersih dari excerpt HTML (WordPress/RSS). */
export function summarize(html: string | undefined | null, max = 280): string {
  if (!html) return "";
  const plain = stripHtml(html)
    .replace(/\[(…|&hellip;|\.\.\.)\]/g, "")
    .replace(/\s*(Baca selengkapnya|Read more|Continue reading).*$/i, "")
    .trim();
  return truncate(plain, max);
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Normalisasi judul untuk deduplikasi (huruf kecil, tanpa tanda baca). */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
