'use server';

// Server actions moderasi direktori bisnis /Business (admin).
// Pola mengikuti lib/admin/actions.ts: (1) otorisasi via requireAdminUser,
// (2) audit trail via logAuditEvent (fire-and-forget, tidak pernah throw),
// (3) revalidatePath. Return konsisten { ok, data?, error? }.

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminUser } from '@/lib/supabase/server';
import { AUDIT_ACTIONS, logAuditEvent } from '@/lib/security/audit';

const uuidSchema = z.string().uuid('ID bisnis tidak valid.');
const statusFilterSchema = z.enum(['review', 'pending', 'draft', 'approved', 'rejected', 'all']);
const decisionSchema = z.enum(['approved', 'rejected']);
const noteSchema = z
  .string()
  .trim()
  .max(1000, 'Catatan maksimal 1000 karakter.')
  .optional();
const pageSchema = z.coerce.number().int().min(1).default(1);
const limitSchema = z.coerce.number().int().min(1).max(50).default(20);
const querySchema = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => (value ? value.replace(/[%_,]/g, '') : undefined));

const listInputSchema = z.object({
  status: statusFilterSchema.default('review'),
  q: querySchema,
  page: pageSchema,
  limit: limitSchema,
});

const reviewInputSchema = z.object({
  id: uuidSchema,
  decision: decisionSchema,
  note: noteSchema,
});

const toggleInputSchema = z.object({
  id: uuidSchema,
  value: z.boolean(),
});

export type AdminBusinessItem = {
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
  status: string;
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  owner: { id: string; display_name: string | null; full_name: string | null } | null;
};

type ListResult =
  | { ok: true; data: { items: AdminBusinessItem[]; total: number; page: number; totalPages: number } }
  | { ok: false; error: string; data: { items: AdminBusinessItem[]; total: number; page: number; totalPages: number } };

type MutationResult = { ok: true } | { ok: false; error: string };

const EMPTY_PAGE = { items: [], total: 0, page: 1, totalPages: 1 };

const BUSINESS_COLUMNS =
  'id,name,slug,category,description,city,province,address,phone,whatsapp,email,website,status,is_verified,is_featured,view_count,created_at,owner_id';

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

async function fetchOwnerMap(supabase: Awaited<ReturnType<typeof requireAdminUser>>['supabase'], ownerIds: string[]) {
  if (!ownerIds.length) return new Map<string, { id: string; display_name: string | null; full_name: string | null }>();
  const { data, error } = await supabase.from('profiles').select('id,display_name,full_name').in('id', ownerIds);
  if (error) throw new Error('Data pemilik bisnis belum dapat dimuat.');
  const map = new Map<string, { id: string; display_name: string | null; full_name: string | null }>();
  for (const row of data ?? []) {
    map.set(row.id, { id: row.id, display_name: row.display_name ?? null, full_name: row.full_name ?? null });
  }
  return map;
}

export async function listAdminBusinesses(input?: {
  status?: 'review' | 'pending' | 'draft' | 'approved' | 'rejected' | 'all';
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ListResult> {
  try {
    const parsed = listInputSchema.parse(input ?? {});
    const { supabase } = await requireAdminUser();

    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = supabase.from('businesses').select(BUSINESS_COLUMNS, { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);

    if (parsed.status === 'review') query = query.in('status', ['pending', 'draft']);
    else if (parsed.status !== 'all') query = query.eq('status', parsed.status);

    if (parsed.q) query = query.or(`name.ilike.%${parsed.q}%,city.ilike.%${parsed.q}%`);

    const { data, error, count } = await query;
    if (error) throw new Error('Data bisnis belum dapat dimuat.');

    const ownerIds = Array.from(new Set((data ?? []).map((row) => row.owner_id as string).filter(Boolean)));
    const ownerMap = await fetchOwnerMap(supabase, ownerIds);

    const items: AdminBusinessItem[] = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      category: row.category,
      description: row.description ?? null,
      city: row.city,
      province: row.province,
      address: row.address ?? null,
      phone: row.phone ?? null,
      whatsapp: row.whatsapp ?? null,
      email: row.email ?? null,
      website: row.website ?? null,
      status: row.status,
      is_verified: row.is_verified,
      is_featured: row.is_featured,
      view_count: row.view_count,
      created_at: row.created_at,
      owner: ownerMap.get(row.owner_id as string) ?? null,
    }));

    const total = count ?? items.length;
    return { ok: true, data: { items, total, page: parsed.page, totalPages: Math.max(1, Math.ceil(total / parsed.limit)) } };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Data bisnis belum dapat dimuat.'), data: EMPTY_PAGE };
  }
}

export async function reviewBusiness(input: { id: string; decision: 'approved' | 'rejected'; note?: string }): Promise<MutationResult> {
  try {
    const parsed = reviewInputSchema.parse(input);
    if (parsed.decision === 'rejected' && (!parsed.note || parsed.note.length < 3)) {
      return { ok: false, error: 'Alasan penolakan wajib diisi (min. 3 karakter).' };
    }

    const { supabase, user } = await requireAdminUser();

    const { data: current, error: fetchError } = await supabase
      .from('businesses')
      .select('id,name,slug,status')
      .eq('id', parsed.id)
      .maybeSingle();
    if (fetchError) throw new Error('Bisnis belum dapat ditinjau.');
    if (!current) return { ok: false, error: 'Bisnis tidak ditemukan.' };

    const { error } = await supabase.from('businesses').update({ status: parsed.decision }).eq('id', parsed.id);
    if (error) throw new Error('Status bisnis belum dapat diperbarui.');

    // Audit fire-and-forget: kegagalan pencatatan tidak membatalkan aksi.
    await logAuditEvent(supabase, {
      actorId: user.id,
      action: parsed.decision === 'approved' ? AUDIT_ACTIONS.BUSINESS_APPROVE : AUDIT_ACTIONS.BUSINESS_REJECT,
      targetType: 'business',
      targetId: parsed.id,
      reason: parsed.decision === 'rejected' ? parsed.note ?? null : null,
      metadata: { name: current.name, slug: current.slug, previousStatus: current.status, by: user.email ?? undefined },
    });

    revalidatePath('/admin/businesses');
    revalidatePath('/Business/direktori');
    if (parsed.decision === 'approved') revalidatePath(`/Business/${current.slug}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Status bisnis belum dapat diperbarui.') };
  }
}

export async function setBusinessFeatured(input: { id: string; value: boolean }): Promise<MutationResult> {
  try {
    const parsed = toggleInputSchema.parse(input);
    const { supabase, user } = await requireAdminUser();

    const { data: current, error: fetchError } = await supabase.from('businesses').select('id,name,slug').eq('id', parsed.id).maybeSingle();
    if (fetchError) throw new Error('Bisnis belum dapat diperbarui.');
    if (!current) return { ok: false, error: 'Bisnis tidak ditemukan.' };

    const { error } = await supabase.from('businesses').update({ is_featured: parsed.value }).eq('id', parsed.id);
    if (error) throw new Error('Status unggulan belum dapat diperbarui.');

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: AUDIT_ACTIONS.BUSINESS_FEATURE,
      targetType: 'business',
      targetId: parsed.id,
      metadata: { name: current.name, slug: current.slug, featured: parsed.value, by: user.email ?? undefined },
    });

    revalidatePath('/admin/businesses');
    revalidatePath('/Business');
    revalidatePath('/Business/direktori');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Status unggulan belum dapat diperbarui.') };
  }
}

export async function setBusinessVerified(input: { id: string; value: boolean }): Promise<MutationResult> {
  try {
    const parsed = toggleInputSchema.parse(input);
    const { supabase, user } = await requireAdminUser();

    const { data: current, error: fetchError } = await supabase.from('businesses').select('id,name,slug').eq('id', parsed.id).maybeSingle();
    if (fetchError) throw new Error('Bisnis belum dapat diperbarui.');
    if (!current) return { ok: false, error: 'Bisnis tidak ditemukan.' };

    const { error } = await supabase.from('businesses').update({ is_verified: parsed.value }).eq('id', parsed.id);
    if (error) throw new Error('Status verifikasi belum dapat diperbarui.');

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: AUDIT_ACTIONS.BUSINESS_VERIFY,
      targetType: 'business',
      targetId: parsed.id,
      metadata: { name: current.name, slug: current.slug, verified: parsed.value, by: user.email ?? undefined },
    });

    revalidatePath('/admin/businesses');
    revalidatePath('/Business/direktori');
    revalidatePath(`/Business/${current.slug}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toSafeError(error, 'Status verifikasi belum dapat diperbarui.') };
  }
}
