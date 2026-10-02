import type { SupabaseClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

// Kueri direktori bisnis /Business — lapisan lib untuk SSR publik & API.
// Pola mengikuti lib/listings-query.ts: satu sumber kebenaran agar filter
// server & API selalu konsisten. Semua teks UI dalam Bahasa Indonesia.

// ---------------------------------------------------------------------
// Kategori bisnis
// ---------------------------------------------------------------------
export const BUSINESS_CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'fashion', label: 'Fesyen' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'properti', label: 'Properti' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'otomotif', label: 'Otomotif' },
  { value: 'pertanian', label: 'Pertanian' },
  { value: 'pariwisata', label: 'Pariwisata' },
  { value: 'lainnya', label: 'Lainnya' },
];

function isValidCategory(value: string): boolean {
  return BUSINESS_CATEGORIES.some((entry) => entry.value === value);
}

// ---------------------------------------------------------------------
// Tipe
// ---------------------------------------------------------------------
export type PublicBusiness = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  city: string;
  province: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  hours: Record<string, unknown>;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
};

// Kolom publik (eksplisit) — owner_id TIDAK PERNAH ikut ke publik.
const PUBLIC_BUSINESS_COLUMNS =
  'id,name,slug,category,description,city,province,address,phone,whatsapp,email,website,logo_url,cover_url,hours,latitude,longitude,is_verified,is_featured,view_count,created_at';

// Semua kolom untuk pemilik/admin.
export type OwnerBusiness = PublicBusiness & {
  owner_id: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  updated_at: string;
};

// ---------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

async function resolveClient(client?: SupabaseClient): Promise<SupabaseClient> {
  return client ?? (await getServerSupabase());
}

function mapPublicBusiness(row: Record<string, unknown>): PublicBusiness {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    category: String(row.category ?? ''),
    description: (row.description as string | null) ?? null,
    city: String(row.city ?? ''),
    province: String(row.province ?? ''),
    address: (row.address as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    logo_url: (row.logo_url as string | null) ?? null,
    cover_url: (row.cover_url as string | null) ?? null,
    hours: ((row.hours as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
    latitude: (row.latitude as number | null) ?? null,
    longitude: (row.longitude as number | null) ?? null,
    is_verified: Boolean(row.is_verified),
    is_featured: Boolean(row.is_featured),
    view_count: Number(row.view_count ?? 0),
    created_at: String(row.created_at ?? ''),
  };
}

function mapOwnerBusiness(row: Record<string, unknown>): OwnerBusiness {
  return {
    ...mapPublicBusiness(row),
    owner_id: String(row.owner_id ?? ''),
    status: (row.status as OwnerBusiness['status']) ?? 'pending',
    updated_at: String(row.updated_at ?? ''),
  };
}

// ---------------------------------------------------------------------
// Daftar bisnis publik (hanya yang disetujui)
// ---------------------------------------------------------------------
export type PublicBusinessFilters = {
  q?: string;
  category?: string;
  city?: string;
  page?: number;
  limit?: number;
  featuredOnly?: boolean;
};

export type PublicBusinessResult = {
  items: PublicBusiness[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPublicBusinesses(
  filters: PublicBusinessFilters = {},
  client?: SupabaseClient,
): Promise<PublicBusinessResult> {
  const supa = await resolveClient(client);
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const limit = Math.min(50, Math.max(1, Math.floor(filters.limit ?? 12)));

  let query = supa
    .from('businesses')
    .select(PUBLIC_BUSINESS_COLUMNS, { count: 'exact' })
    .eq('status', 'approved');

  if (filters.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  const category = filters.category?.trim().toLowerCase();
  if (category && isValidCategory(category)) {
    query = query.eq('category', category);
  }

  const city = filters.city?.trim();
  if (city) {
    query = query.ilike('city', `%${escapeLike(city)}%`);
  }

  const q = filters.q?.trim();
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    query = query.or(`name.ilike.${pattern},description.ilike.${pattern},city.ilike.${pattern}`);
  }

  query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const { data, count, error } = await query.range(from, from + limit - 1);
  if (error) throw error;

  const total = count ?? 0;
  return {
    items: (data ?? []).map((row) => mapPublicBusiness(row as Record<string, unknown>)),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

// ---------------------------------------------------------------------
// Detail bisnis publik by slug (hanya yang disetujui)
// ---------------------------------------------------------------------
export async function fetchBusinessBySlug(
  slug: string,
  client?: SupabaseClient,
): Promise<PublicBusiness | null> {
  const supa = await resolveClient(client);
  const { data, error } = await supa
    .from('businesses')
    .select(PUBLIC_BUSINESS_COLUMNS)
    .eq('slug', slug.trim())
    .eq('status', 'approved')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  // Hitung tampilan — best effort, error diabaikan agar detail tetap tampil.
  try {
    await supa.rpc('increment_business_views', { p_id: (data as Record<string, unknown>).id });
  } catch {
    /* abaikan */
  }

  return mapPublicBusiness(data as Record<string, unknown>);
}

// ---------------------------------------------------------------------
// Detail bisnis untuk pemilik (SSR halaman pemilik)
// ---------------------------------------------------------------------
export async function fetchBusinessByIdForOwner(
  id: string,
  userId: string,
  client?: SupabaseClient,
): Promise<OwnerBusiness | null> {
  const supa = await resolveClient(client);
  const { data, error } = await supa.from('businesses').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as Record<string, unknown>;
  if (row.owner_id === userId) {
    return mapOwnerBusiness(row);
  }

  // Fallback ke role admin via profiles (RLS SELECT sudah melindungi,
  // tapi tetap validasi di kode).
  const { data: profile } = await supa
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  const role = (profile as Record<string, unknown> | null)?.role;
  if (role === 'admin' || role === 'super_admin') {
    return mapOwnerBusiness(row);
  }

  return null;
}

// ---------------------------------------------------------------------
// Semua bisnis milik satu user (semua status)
// ---------------------------------------------------------------------
export async function fetchOwnerBusinesses(
  userId: string,
  client?: SupabaseClient,
): Promise<OwnerBusiness[]> {
  const supa = await resolveClient(client);
  const { data, error } = await supa
    .from('businesses')
    .select('*')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapOwnerBusiness(row as Record<string, unknown>));
}

// ---------------------------------------------------------------------
// Statistik hero /Business — tidak pernah melempar (return nol bila
// tabel belum ada / migrasi belum diterapkan).
// ---------------------------------------------------------------------
export type BusinessStats = {
  total: number;
  cities: number;
};

export async function fetchBusinessStats(client?: SupabaseClient): Promise<BusinessStats> {
  try {
    const supa = await resolveClient(client);
    const { count: total } = await supa
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { data: cityRows } = await supa
      .from('businesses')
      .select('city')
      .eq('status', 'approved')
      .limit(1000);

    const cities = new Set(
      ((cityRows ?? []) as Array<Record<string, unknown>>)
        .map((row) => String(row.city ?? '').trim())
        .filter(Boolean),
    );

    return { total: total ?? 0, cities: cities.size };
  } catch {
    return { total: 0, cities: 0 };
  }
}
