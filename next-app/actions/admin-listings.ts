'use server';

// Server actions moderasi listing marketplace — halaman /admin/listings.
// Menghubungkan posting/jual marketplace ke dashboard admin:
// setiap listing yang terbit (termasuk yang disetujui otomatis) bisa
// ditinjau di sini — ditarik (takedown) atau dipulihkan (restore).
//
// Pola mengikuti actions/admin-businesses.ts:
//  (1) otorisasi via requireAdminUser,
//  (2) operasi data memakai service-role client — RLS listings hanya
//      mengizinkan publik membaca listing aktif & pemilik mengelola
//      miliknya, sedangkan admin perlu melihat & menindak SEMUA listing
//      (termasuk yang sudah ditarik / rejected),
//  (3) audit trail via logAuditEvent (fire-and-forget),
//  (4) revalidatePath. Return konsisten { ok, data?, error? }.
//
// Ketahanan skema: kolom jejak approval (approved_at, approved_by,
// rejection_reason) ditambahkan migrasi 20261003090000 yang masih pending
// di production — di-probe sekali per instance agar halaman admin tetap
// berfungsi sebelum migrasi dijalankan (kolom opsional di-skip).

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireAdminUser } from '@/lib/supabase/server';
import { AUDIT_ACTIONS, logAuditEvent } from '@/lib/security/audit';

const statusFilterSchema = z.enum(['auto', 'approved', 'rejected', 'pending', 'all']);
const idSchema = z.string().trim().min(1, 'ID listing tidak valid.').max(64);
const reasonSchema = z.string().trim().min(3, 'Alasan wajib diisi (min. 3 karakter).').max(1000, 'Alasan maksimal 1000 karakter.');
const pageSchema = z.coerce.number().int().min(1).default(1);
const limitSchema = z.coerce.number().int().min(1).max(50).default(20);
const querySchema = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => (value ? value.replace(/[%_,]/g, '') : undefined));

const listInputSchema = z.object({
  status: statusFilterSchema.default('auto'),
  q: querySchema,
  page: pageSchema,
  limit: limitSchema,
});

const takedownInputSchema = z.object({
  id: idSchema,
  reason: reasonSchema,
});

const restoreInputSchema = z.object({
  id: idSchema,
});

export type AdminListingItem = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  district: string | null;
  city: string | null;
  status: string;
  moderation_status: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  thumbnail_url: string | null;
  created_at: string | null;
  owner: { id: string; display_name: string | null } | null;
};

type ListResult =
  | { ok: true; data: { items: AdminListingItem[]; total: number; page: number; totalPages: number } }
  | { ok: false; error: string; data: { items: AdminListingItem[]; total: number; page: number; totalPages: number } };

type MutationResult = { ok: true } | { ok: false; error: string };

const EMPTY_PAGE = { items: [], total: 0, page: 1, totalPages: 1 };

const BASE_COLUMNS =
  'id,title,description,price,condition,district,city,status,moderation_status,created_at,owner_id';
// Kolom dari migrasi pending 20261003090000 (images/thumbnail_url/specifications/
// owner_id) + jejak approval (approved_at/approved_by/rejection_reason).
const EXTENDED_COLUMNS = 'thumbnail_url,approved_at,approved_by,rejection_reason';

/** Client service-role (bypass RLS) khusus operasi admin atas listings. */
function getAdminListingsClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Probe kolom tambahan (migrasi pending) — sekali per instance (pola lib/listings-query.ts). */
let extendedColumnsAvailable: boolean | null = null;
async function hasExtendedColumns(): Promise<boolean> {
  if (extendedColumnsAvailable !== null) return extendedColumnsAvailable;
  try {
    const client = getAdminListingsClient();
    const { error } = await client.from('listings').select(EXTENDED_COLUMNS).limit(1);
    extendedColumnsAvailable = !error;
  } catch {
    extendedColumnsAvailable = false;
  }
  return extendedColumnsAvailable;
}

/** Pesan error aman: hanya pesan guard yang dikenal yang diteruskan apa adanya. */
function toSafeError(error: unknown, fallback: string): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message ?? 'Input tidak valid.';
  }
  if (error instanceof Error && (error.message === 'Sesi login diperlukan.' || error.message === 'Akses admin diperlukan.')) {
    return error.message;
  }
  return fallback;
}

async function fetchOwnerMap(
  client: SupabaseClient,
  ownerIds: string[],
): Promise<Map<string, { id: string; display_name: string | null }>> {
  const map = new Map<string, { id: string; display_name: string | null }>();
  if (!ownerIds.length) return map;
  const { data, error } = await client.from('profiles').select('id,display_name').in('id', ownerIds);
  if (error) throw new Error('Data pemilik listing belum dapat dimuat.');
  for (const row of data ?? []) {
    map.set(String(row.id), { id: String(row.id), display_name: (row.display_name as string | null) ?? null });
  }
  return map;
}

export async function listAdminListings(input?: {
  status?: 'auto' | 'approved' | 'rejected' | 'pending' | 'all';
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ListResult> {
  try {
    const parsed = listInputSchema.parse(input ?? {});
    const { supabase } = await requireAdminUser();
    const admin = getAdminListingsClient();

    const withApproval = await hasExtendedColumns();
    const columns = withApproval ? `${BASE_COLUMNS},${EXTENDED_COLUMNS}` : BASE_COLUMNS;

    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = admin.from('listings').select(columns, { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);

    if (parsed.status === 'auto') query = query.eq('moderation_status', 'auto_approved');
    else if (parsed.status !== 'all') query = query.eq('moderation_status', parsed.status);

    if (parsed.q) query = query.or(`title.ilike.%${parsed.q}%,district.ilike.%${parsed.q}%,city.ilike.%${parsed.q}%`);

    const { data, error, count } = await query;
    if (error) throw new Error('Data listing belum dapat dimuat.');

    const ownerIds = Array.from(
      new Set(
        (data ?? [])
          .map((row) => (row as { owner_id?: unknown }).owner_id)
          .filter((v): v is string => typeof v === 'string' && v.length > 0),
      ),
    );
    const ownerMap = await fetchOwnerMap(admin, ownerIds);

    const rows = (data ?? []) as unknown[];
    const items: AdminListingItem[] = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const ownerId = String(r.owner_id ?? '');
      return {
        id: String(r.id),
        title: String(r.title ?? '(tanpa judul)'),
        description: (r.description as string | null) ?? null,
        price: typeof r.price === 'number' ? r.price : null,
        condition: (r.condition as string | null) ?? null,
        district: (r.district as string | null) ?? null,
        city: (r.city as string | null) ?? null,
        status: String(r.status ?? ''),
        moderation_status: (r.moderation_status as string | null) ?? null,
        approved_at: (r.approved_at as string | null) ?? null,
        approved_by: (r.approved_by as string | null) ?? null,
        rejection_reason: (r.rejection_reason as string | null) ?? null,
        thumbnail_url: (r.thumbnail_url as string | null) ?? null,
        created_at: (r.created_at as string | null) ?? null,
        owner: ownerId ? (ownerMap.get(ownerId) ?? null) : null,
      };
    });

    const total = count ?? items.length;
    return { ok: true, data: { items, total, page: parsed.page, totalPages: Math.max(1, Math.ceil(total / parsed.limit)) } };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Data listing belum dapat dimuat.'), data: EMPTY_PAGE };
  }
}

/** Tarik listing dari publik: status -> rejected (wajib alasan, tercatat di audit). */
export async function takedownListing(input: { id: string; reason: string }): Promise<MutationResult> {
  try {
    const parsed = takedownInputSchema.parse(input);
    const { supabase, user } = await requireAdminUser();
    const admin = getAdminListingsClient();

    const { data: current, error: fetchError } = await admin
      .from('listings')
      .select('id,title,status,moderation_status')
      .eq('id', parsed.id)
      .maybeSingle();
    if (fetchError) throw new Error('Listing belum dapat ditinjau.');
    if (!current) return { ok: false, error: 'Listing tidak ditemukan.' };

    const withApproval = await hasExtendedColumns();
    const patch: Record<string, unknown> = {
      status: 'rejected',
      moderation_status: 'rejected',
      ...(withApproval ? { rejection_reason: parsed.reason } : {}),
    };
    const { error } = await admin.from('listings').update(patch).eq('id', parsed.id);
    if (error) throw new Error('Listing belum dapat ditarik.');

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: AUDIT_ACTIONS.LISTING_TAKEDOWN,
      targetType: 'listing',
      targetId: parsed.id,
      reason: parsed.reason,
      metadata: {
        title: (current as { title: string }).title,
        previousStatus: (current as { status: string }).status,
        by: user.email ?? undefined,
      },
    });

    revalidatePath('/admin/listings');
    revalidatePath('/marketplace');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Listing belum dapat ditarik.') };
  }
}

/** Pulihkan listing yang ditarik: kembali tayang sebagai disetujui admin. */
export async function restoreListing(input: { id: string }): Promise<MutationResult> {
  try {
    const parsed = restoreInputSchema.parse(input);
    const { supabase, user } = await requireAdminUser();
    const admin = getAdminListingsClient();

    const { data: current, error: fetchError } = await admin
      .from('listings')
      .select('id,title,status,moderation_status')
      .eq('id', parsed.id)
      .maybeSingle();
    if (fetchError) throw new Error('Listing belum dapat ditinjau.');
    if (!current) return { ok: false, error: 'Listing tidak ditemukan.' };

    const withApproval = await hasExtendedColumns();
    const patch: Record<string, unknown> = {
      status: 'active',
      moderation_status: 'approved',
      ...(withApproval
        ? { approved_at: new Date().toISOString(), approved_by: `admin:${user.email ?? user.id}`, rejection_reason: null }
        : {}),
    };
    const { error } = await admin.from('listings').update(patch).eq('id', parsed.id);
    if (error) throw new Error('Listing belum dapat dipulihkan.');

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: AUDIT_ACTIONS.LISTING_RESTORE,
      targetType: 'listing',
      targetId: parsed.id,
      metadata: {
        title: (current as { title: string }).title,
        previousStatus: (current as { status: string }).status,
        by: user.email ?? undefined,
      },
    });

    revalidatePath('/admin/listings');
    revalidatePath('/marketplace');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Listing belum dapat dipulihkan.') };
  }
}
