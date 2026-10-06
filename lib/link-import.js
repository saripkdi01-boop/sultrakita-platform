'use strict';

// Impor URL katalog/lowongan oleh admin — diekstrak dari server.js tanpa perubahan perilaku.
// Keamanan: hanya host allowlist + HTTPS; blokir localhost/IP privat; SSRF-aware.
const crypto = require('node:crypto');
const { boundedText, parseJsonObject } = require('./validation');
const { inferLinkCategory, persistExternalListing, persistExternalJob } = require('./external-feeds');

const allowedJobHosts = () => new Set([
  'jobstreet.com', 'id.jobstreet.com', 'jora.com', 'id.jora.com', 'indeed.com', 'id.indeed.com',
  'loker.my.id', 'shopee.co.id', 'www.shopee.co.id', 'tokopedia.com', 'www.tokopedia.com',
  'facebook.com', 'www.facebook.com', 'm.facebook.com', 'instagram.com', 'www.instagram.com',
  'lazada.co.id', 'www.lazada.co.id', 'blibli.com', 'www.blibli.com', 'bukalapak.com', 'www.bukalapak.com',
  'carousell.id', 'www.carousell.id',
  ...String(`${process.env.JOB_URL_ALLOWED_HOSTS || ''},${process.env.LINK_URL_ALLOWED_HOSTS || ''}`)
    .split(',').map(host => host.trim().toLowerCase()).filter(Boolean),
]);

const hostnameAllowedForJob = hostname => {
  const host = String(hostname || '').toLowerCase();
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host === '127.0.0.1' || host === '::1'
    || /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host.endsWith('.internal')) return false;
  const allowed = allowedJobHosts();
  return [...allowed].some(domain => host === domain || host.endsWith(`.${domain}`));
};

const decodeHtml = value =>
  String(value || '')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#039;/gi, "'").replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ').trim();

const extractMeta = (source, key) => {
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${key.replace(':', '\\:')}["'][^>]*>`, 'i');
  const tag = source.match(pattern)?.[0] || '';
  return decodeHtml(tag.match(/content=["']([^"']*)["']/i)?.[1] || '');
};

const extractTagText = (source, tag) =>
  decodeHtml(source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.replace(/<[^>]+>/g, '') || '');

const fetchJobUrlMetadata = async rawUrl => {
  let parsed;
  try { parsed = new URL(String(rawUrl || '').trim()); }
  catch { throw Object.assign(new Error('URL lowongan tidak valid.'), { statusCode: 422, code: 'JOB_URL_INVALID' }); }
  if (parsed.protocol !== 'https:' || !hostnameAllowedForJob(parsed.hostname)) {
    throw Object.assign(new Error('URL harus HTTPS dan berasal dari portal lowongan yang diizinkan.'), { statusCode: 422, code: 'JOB_URL_NOT_ALLOWED' });
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(parsed.href, {
      headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': 'SultraKitaJobMetadata/1.0 (+https://sultrakita-platform.vercel.app)' },
      redirect: 'manual',
      signal: controller.signal,
    });
    if (!response.ok || (response.status >= 300 && response.status < 400)) {
      const sourceLabel = parsed.hostname.replace(/^www\./, '');
      const pathTitle = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || sourceLabel)
        .replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
      return {
        external_id: crypto.createHash('sha256').update(parsed.href).digest('hex').slice(0, 40),
        source: `job-url:${sourceLabel}`,
        source_label: sourceLabel,
        title: boundedText(`${pathTitle} — ${sourceLabel}`, 180),
        company: sourceLabel,
        city: 'Kendari / Sulawesi Tenggara',
        province: 'Sulawesi Tenggara',
        category: 'Lowongan Kerja',
        employment_type: 'Lihat sumber',
        salary_text: '',
        description: boundedText(`Pratinjau otomatis dibatasi oleh sumber (HTTP ${response.status}). Buka sumber asli untuk melihat posisi, persyaratan, dan cara melamar terbaru.`, 1000),
        image_url: `https://${parsed.hostname}/favicon.ico`,
        url: parsed.href,
        posted_at: null,
        expires_at: null,
        observed_at: new Date().toISOString(),
        provenance: 'admin_submitted_url_fallback',
      };
    }
    const source = (await response.text()).slice(0, 1_500_000);
    const title = boundedText(extractMeta(source, 'og:title') || extractTagText(source, 'title') || parsed.hostname, 180);
    const description = boundedText(extractMeta(source, 'og:description') || extractMeta(source, 'description') || `Buka sumber asli untuk melihat detail lowongan dari ${parsed.hostname}.`, 1000);
    const image = extractMeta(source, 'og:image');
    const imageUrl = image && /^https:\/\//i.test(image) ? image.slice(0, 1000) : `https://${parsed.hostname}/favicon.ico`;
    const sourceLabel = parsed.hostname.replace(/^www\./, '');
    return {
      external_id: crypto.createHash('sha256').update(parsed.href).digest('hex').slice(0, 40),
      source: `job-url:${sourceLabel}`,
      source_label: sourceLabel,
      title,
      company: sourceLabel,
      city: /kendari|sultra|sulawesi tenggara/i.test(`${title} ${description} ${parsed.href}`) ? 'Kendari / Sulawesi Tenggara' : 'Sulawesi Tenggara',
      province: 'Sulawesi Tenggara',
      category: 'Lowongan Kerja',
      employment_type: 'Lihat sumber',
      salary_text: '',
      description,
      image_url: imageUrl,
      url: parsed.href,
      posted_at: null,
      expires_at: null,
      observed_at: new Date().toISOString(),
      provenance: 'admin_submitted_public_metadata',
    };
  } finally { clearTimeout(timer); }
};

const summarizeLinkCard = async row => {
  const fallback = boundedText(row.description || `Informasi dari ${row.source_label}. Buka sumber asli untuk melihat detail lengkap.`, 1000);
  if (!process.env.OPENAI_API_KEY) return { ...row, description: fallback, summary_source: 'metadata_fallback' };
  try {
    const response = await fetch(`${process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Ringkas metadata item marketplace atau lowongan menjadi deskripsi Bahasa Indonesia maksimal 2 kalimat dan 280 karakter. Jangan mengarang harga, kondisi, gaji, syarat, perusahaan, atau status aktif. Jika metadata hanya halaman pencarian, katakan bahwa ini halaman pencarian dan arahkan ke sumber asli. Balas JSON {"description":"..."}.' },
          { role: 'user', content: JSON.stringify({ title: row.title, company: row.company, city: row.city, category: row.category, source: row.source_label, description: row.description, url: row.url }) },
        ],
      }),
    });
    const payload = await response.json().catch(() => ({}));
    const candidate = parseJsonObject(payload.choices?.[0]?.message?.content);
    const description = boundedText(candidate.description || fallback, 1000);
    return {
      ...row,
      description,
      summary_source: candidate.description ? 'ai' : 'metadata_fallback',
      provenance: candidate.description ? 'admin_submitted_ai_metadata' : row.provenance,
    };
  } catch (error) {
    console.error('[job-ai-summary]', error.message);
    return { ...row, description: fallback, summary_source: 'metadata_fallback' };
  }
};

const universalLinkRow = async (url, categoryOverride = '') => {
  const base = await fetchJobUrlMetadata(url);
  const category = inferLinkCategory(`${base.title} ${base.description} ${base.url}`, categoryOverride);
  return {
    external_id: base.external_id,
    source: `link-url:${base.source_label}`,
    source_label: base.source_label,
    title: base.title,
    category,
    city: base.city,
    province: base.province,
    price: null,
    image_url: base.image_url,
    url: base.url,
    item_type: category === 'lowongan' ? 'job' : 'product',
    description: base.description,
    summary_source: 'metadata_fallback',
    is_demo: false,
    provenance: base.provenance,
    observed_at: base.observed_at,
  };
};

module.exports = {
  allowedJobHosts, hostnameAllowedForJob, decodeHtml, extractMeta, extractTagText,
  fetchJobUrlMetadata, summarizeLinkCard, universalLinkRow,
  persistExternalListing, persistExternalJob,
};
