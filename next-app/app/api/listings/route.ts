import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiError, badRequest, forbidden, internalError, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { getServerSupabase } from '@/lib/supabase/server';
import { fetchPublicListings } from '@/lib/listings-query';
import {
  createListingPayloadSchema,
  normalizeWhatsapp,
  sanitizeText,
} from '@/lib/marketplace-create';

// Data contoh hanya untuk development lokal: tampil HANYA bila
// ALLOW_DEMO_DATA=true DAN bukan production, dengan label jelas.
const fallbackListings = [
  { id: 'demo-tenun', title: 'Kain Tenun Buton Premium', description: 'Tenun lokal pilihan dari Baubau.', price: 450000, district: 'Baubau', city: 'Baubau', condition: 'new', is_featured: true, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-kuliner', title: 'Paket Ikan Bakar Sambal', description: 'Rasa lokal untuk keluarga.', price: 120000, district: 'Kendari', city: 'Kendari', condition: 'new', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-wakatobi', title: 'Paket Snorkeling Wakatobi', description: 'Jelajah laut Wakatobi bersama pemandu lokal.', price: 350000, district: 'Wakatobi', city: 'Wakatobi', condition: 'good', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
];

export async function GET(request: NextRequest) {
  // Fase 1.5: batasi 60 request/menit per IP untuk API publik.
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const rawMinPrice = params.get('minPrice'); const rawMaxPrice = params.get('maxPrice');
  const minPrice = Number(rawMinPrice); const maxPrice = Number(rawMaxPrice);
  if ((rawMinPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) || (rawMaxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))) return badRequest(request, 'Filter harga minimum/maksimum tidak valid.');
  if (rawMinPrice !== null && rawMaxPrice !== null && minPrice > maxPrice) return badRequest(request, 'Harga minimum tidak boleh lebih besar dari maksimum.');
  // Query terpusat di lib/listings-query.ts (satu sumber kebenaran dengan SSR halaman).
  const result = await fetchPublicListings({
    q: params.get('q') || undefined,
    district: params.get('district') || undefined,
    category: params.get('category') || undefined,
    condition: params.get('condition') || undefined,
    minPrice: rawMinPrice !== null && Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: rawMaxPrice !== null && Number.isFinite(maxPrice) ? maxPrice : undefined,
    limit: Number(params.get('limit')) || 30,
    sort: params.get('sort') || undefined,
  });
  if (!result.ok) {
    if (process.env.ALLOW_DEMO_DATA === 'true' && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: true, data: fallbackListings, source: 'demo', warning: 'Mode demo lokal aktif.' });
    // Format error konsisten Fase 1.4: { error: { code, message, requestId } }.
    return apiError('SERVICE_UNAVAILABLE', 'Listing sementara belum tersedia. Silakan coba lagi nanti.', 503, request, { source: 'unavailable' });
  }
  if ('warning' in result) return NextResponse.json({ ok: true, data: [], filters: result.filters, warning: result.warning });
  return NextResponse.json({ ok: true, data: result.items, filters: result.filters });
}

// ---- POST /api/listings: terbitkan listing marketplace ----
//
// Prosedur persetujuan otomatis ("ketentuan form post jual"):
// sebuah posting DISETUJUI OTOMATIS (langsung tayang, tanpa persetujuan
// manual admin) HANYA bila seluruh pemeriksaan di bawah lolos:
//   1. rate limit per IP tidak terlampaui,
//   2. token CSRF valid (anti pemalsuan form),
//   3. pengguna sudah login (auth),
//   4. payload lolos skema validasi form (createListingPayloadSchema):
//      judul 10-140 karakter, kategori resmi, kondisi valid, harga >= 0,
//      stok >= 1, deskripsi 20-5000 karakter, kota/kab di Sultra,
//      nomor WhatsApp valid, foto <= 8,
//   5. teks judul/deskripsi tersanitasi (anti XSS).
//
// Hasilnya dicatat di kolom moderation_status='auto_approved' +
// approved_at/approved_by agar admin bisa meninjau belakangan di
// /admin/listings (tarik/pulihkan). Bila satu saja gagal, posting DITOLAK
// dengan pesan kesalahan yang jelas — tidak pernah lolos diam-diam.
//
// RLS: server memakai anon key + cookie sesi, jadi policy "owners manage
// listings" (auth.uid() = owner_id) yang berlaku — tanpa subquery ke tabel
// listings sendiri sehingga bebas dari pola rekursi RLS.
type AutoApprovalCheck = { name: string; passed: boolean };
function evaluateAutoApproval(checks: AutoApprovalCheck[]): { approved: boolean; failed: string[] } {
  const failed = checks.filter((c) => !c.passed).map((c) => c.name);
  return { approved: failed.length === 0, failed };
}

/** Dedupe double-submit: best-effort per instance (serverless) dengan TTL.
 *  Jujur dicatat: ini BUKAN idempotency lintas instance — perlindungan utama
 *  tetap guard di client (tombol disabled + in-flight guard). */
const IDEMPOTENCY_TTL_MS = 10 * 60_000;
const recentPublishes = new Map<string, { listingId: string; title: string; expiresAt: number }>();

function checkDuplicate(userId: string, key: string): { listingId: string; title: string } | null {
  const now = Date.now();
  if (recentPublishes.size > 500) {
    const now2 = Date.now();
    recentPublishes.forEach((v, k) => { if (v.expiresAt <= now2) recentPublishes.delete(k); });
  }
  const mapKey = `${userId}:${key}`;
  const hit = recentPublishes.get(mapKey);
  if (!hit) return null;
  if (hit.expiresAt <= now) { recentPublishes.delete(mapKey); return null; }
  return { listingId: hit.listingId, title: hit.title };
}

function rememberPublish(userId: string, key: string, listingId: string, title: string) {
  recentPublishes.set(`${userId}:${key}`, { listingId, title, expiresAt: Date.now() + IDEMPOTENCY_TTL_MS });
}

/** Petakan label kategori form (11 label UI) -> uuid tabel categories.
 *  Gagal/tidak ada padanan -> null (listing tetap terbit & ditemukan via
 *  pencarian teks + filter kota). */
async function resolveCategoryUuid(
  supabase: Awaited<ReturnType<typeof getServerSupabase>>,
  label: string,
): Promise<string | null> {
  try {
    const normalized = label.trim().toLowerCase();
    const { data, error } = await supabase.from('categories').select('id,slug,name').eq('is_active', true);
    if (error || !data) return null;
    const match = data.find((row) => {
      const slug = String(row.slug || '').toLowerCase();
      const name = String(row.name || '').toLowerCase();
      return slug === normalized || name === normalized;
    });
    return match ? String(match.id) : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  if (!verifyCsrfToken(request)) {
    return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman dan coba lagi.');
  }

  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized(request, 'Masuk dulu untuk memasang listing.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest(request, 'Isi permintaan tidak valid.');
  }

  const parsed = createListingPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 5).map((issue) => ({
      field: issue.path.join('.') || 'form',
      message: issue.message,
    }));
    return apiError('VALIDATION_ERROR', issues[0]?.message || 'Data listing tidak valid.', 422, request, { issues });
  }
  const input = parsed.data;

  // Idempotency best-effort (lihat catatan di atas).
  const idemKey = input.idempotencyKey?.trim();
  if (idemKey) {
    const dup = checkDuplicate(user.id, idemKey);
    if (dup) {
      return NextResponse.json({ ok: true, data: { id: dup.listingId, title: dup.title }, deduped: true });
    }
  }

  let whatsapp: string | null = null;
  try {
    whatsapp = normalizeWhatsapp(input.whatsapp || '');
  } catch (error) {
    return apiError('VALIDATION_ERROR', error instanceof Error ? error.message : 'Nomor WhatsApp tidak valid.', 422, request);
  }

  const categoryId = await resolveCategoryUuid(supabase, input.category);
  const title = sanitizeText(input.title, true);
  const description = sanitizeText(input.description);
  const imageUrls = input.photos.map((p) => p.url);

  // Prosedur auto-approve: semua pemeriksaan di atas sudah lolos pada titik
  // ini (rate limit, CSRF, auth, validasi zod, sanitasi). Evaluasi eksplisit
  // agar alurnya terbaca & tercatat — posting tanpa persetujuan admin
  // disetujui otomatis di sini, bukan diam-diam.
  const approval = evaluateAutoApproval([
    { name: 'rate_limit', passed: true },
    { name: 'csrf', passed: true },
    { name: 'auth', passed: true },
    { name: 'validasi_form', passed: true },
    { name: 'sanitasi', passed: title.length >= 10 && description.length >= 20 },
  ]);
  if (!approval.approved) {
    return apiError('VALIDATION_ERROR', `Posting gagal pemeriksaan otomatis: ${approval.failed.join(', ')}.`, 422, request);
  }
  const approvedAt = new Date().toISOString();

  // Foto disimpan di listings.images (kolom yang dibaca kartu marketplace).
  // listing_media TIDAK dipakai: skemanya cacat (bigint vs uuid).
  // Catatan skema production (terverifikasi 2026-10-03): category_id integer
  // (legacy) -> hanya diisi bila hasil resolusi berupa angka; kolom
  // is_negotiable/published_at/mode/location TIDAK ADA -> "bisa nego"
  // disimpan di specifications (jsonb) agar tak ada data yang hilang diam-diam.
  const categoryIdNum = categoryId && /^\d+$/.test(categoryId) ? parseInt(categoryId, 10) : null;
  const row = {
    owner_id: user.id,
    title,
    description,
    price: input.price,
    district: input.district,
    city: input.district,
    province: 'Sulawesi Tenggara',
    category_id: categoryIdNum,
    images: imageUrls,
    thumbnail_url: imageUrls[0] || null,
    condition: input.condition,
    stock_quantity: input.stock,
    specifications: { negotiable: input.negotiable, ...(whatsapp ? { whatsapp } : {}) },
    status: 'active',
    // Jejak auto-approve: langsung tayang + tercatat untuk ditinjau admin.
    // (Kolom ditambahkan migrasi 20261003090000; aman sebelum migrasi jalan
    //  karena migrasi tersebut wajib dijalankan agar POST berfungsi.)
    moderation_status: 'auto_approved',
    approved_at: approvedAt,
    approved_by: 'system:auto-approve',
  };

  const { data, error } = await supabase.from('listings').insert(row).select('id,title').single();
  if (error) {
    // 42501 = ditolak RLS; 23505 = konflik unik — pesan aman, detail di log server.
    if (error.code === '42501') return forbidden(request, 'Anda tidak memiliki izin memasang listing.');
    return internalError(request, 'Listing gagal disimpan. Silakan coba lagi.', error);
  }

  if (idemKey && data) rememberPublish(user.id, idemKey, String(data.id), String(data.title));
  return NextResponse.json(
    {
      ok: true,
      data: { id: data.id, title: data.title },
      approval: { status: 'auto_approved', approved_at: approvedAt, by: 'system:auto-approve' },
    },
    { status: 201 },
  );
}
