'use server';

// SLICE-B: server actions untuk modul admin (overview, users, moderation, settings).
// Setiap mutasi: (1) otorisasi server-side via requireRole,
// (2) catat audit trail via logAuditEvent (kontrak milik SLICE-A), (3) revalidatePath.

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, requireSuperAdmin, type StaffRole } from './guards';
import { logAuditEvent } from '@/lib/security/audit';

type ActionResult = { ok: true } | { ok: false; error: string };

const reasonSchema = z.string().trim().min(3, 'Alasan wajib diisi (min. 3 karakter).').max(1000);
const uuidSchema = z.string().uuid('ID tidak valid.');

function fail(error: unknown): ActionResult {
  if (error instanceof z.ZodError) return { ok: false, error: error.errors[0]?.message ?? 'Input tidak valid.' };
  return { ok: false, error: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
}

// ---------------------------------------------------------------- users ----

export async function suspendUser(userId: string, reason: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(userId);
    reasonSchema.parse(reason);
    const actor = await requireRole('admin', 'super_admin');
    if (actor.userId === userId) return { ok: false, error: 'Tidak dapat menangguhkan akun sendiri.' };
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('profiles').update({ is_suspended: true }).eq('id', userId);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.user.suspend',
      targetType: 'profile',
      targetId: userId,
      reason,
      metadata: { by: actor.email },
    });
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function restoreUser(userId: string, reason: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(userId);
    reasonSchema.parse(reason);
    const actor = await requireRole('admin', 'super_admin');
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('profiles').update({ is_suspended: false }).eq('id', userId);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.user.restore',
      targetType: 'profile',
      targetId: userId,
      reason,
      metadata: { by: actor.email },
    });
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const MANAGEABLE_ROLES: StaffRole[] = ['admin', 'moderator', 'support'];
const PUBLIC_ROLES = ['user', 'buyer', 'seller', 'creator', 'community'] as const;

export async function changeUserRole(userId: string, role: string, reason: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(userId);
    reasonSchema.parse(reason);
    const allowed = [...MANAGEABLE_ROLES, ...PUBLIC_ROLES, 'super_admin'];
    if (!allowed.includes(role)) return { ok: false, error: 'Peran tidak dikenal.' };
    const actor = await requireSuperAdmin(); // HANYA super_admin
    if (actor.userId === userId) return { ok: false, error: 'Tidak dapat mengubah peran sendiri.' };
    const supabase = await getServerSupabase();
    const { data: before } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.user.change_role',
      targetType: 'profile',
      targetId: userId,
      reason,
      metadata: { from: before?.role ?? null, to: role, by: actor.email },
    });
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function saveAdminNotes(userId: string, notes: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(userId);
    const clean = z.string().trim().max(2000).parse(notes ?? '');
    const actor = await requireRole('admin', 'super_admin');
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('profiles').update({ admin_notes: clean || null }).eq('id', userId);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.user.update_notes',
      targetType: 'profile',
      targetId: userId,
      reason: 'Catatan internal diperbarui.',
      metadata: { by: actor.email },
    });
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

// ------------------------------------------------------------ moderation ----

const REPORT_STATUSES = ['pending', 'under_review', 'resolved', 'dismissed'] as const;

export async function setReportStatus(reportId: string, status: string, reason: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(reportId);
    reasonSchema.parse(reason);
    if (!(REPORT_STATUSES as readonly string[]).includes(status)) {
      return { ok: false, error: 'Status laporan tidak dikenal.' };
    }
    const actor = await requireRole('admin', 'super_admin', 'moderator');
    const supabase = await getServerSupabase();
    const { error } = await supabase
      .from('marketplace_reports')
      .update({
        status,
        resolution: status === 'pending' || status === 'under_review' ? null : reason,
        resolved_by: status === 'resolved' || status === 'dismissed' ? actor.userId : null,
        resolved_at: status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : null,
      })
      .eq('id', reportId);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: `admin.moderation.report_${status}`,
      targetType: 'marketplace_report',
      targetId: reportId,
      reason,
      metadata: { by: actor.email },
    });
    revalidatePath('/admin/moderation');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/** Takedown listing terkait laporan: arsipkan listing + tandai laporan resolved. */
export async function takedownListingFromReport(reportId: string, reason: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(reportId);
    reasonSchema.parse(reason);
    const actor = await requireRole('admin', 'super_admin', 'moderator');
    const supabase = await getServerSupabase();
    const { data: report, error: reportError } = await supabase
      .from('marketplace_reports')
      .select('id, reported_listing_id')
      .eq('id', reportId)
      .maybeSingle();
    if (reportError) throw reportError;
    if (!report?.reported_listing_id) {
      return { ok: false, error: 'Laporan ini tidak terkait listing manapun.' };
    }
    const { error: listingError } = await supabase
      .from('listings')
      .update({ status: 'archived' })
      .eq('id', report.reported_listing_id);
    if (listingError) throw listingError;
    await supabase
      .from('marketplace_reports')
      .update({
        status: 'resolved',
        resolution: reason,
        resolved_by: actor.userId,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId);
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.moderation.listing_takedown',
      targetType: 'listing',
      targetId: report.reported_listing_id,
      reason,
      metadata: { report_id: reportId, by: actor.email },
    });
    revalidatePath('/admin/moderation');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

// -------------------------------------------------------------- settings ----

const settingKeySchema = z
  .string()
  .trim()
  .min(2, 'Key minimal 2 karakter.')
  .max(64)
  .regex(/^[a-z0-9_]+$/, 'Key hanya boleh huruf kecil, angka, dan underscore.');

const RESERVED_FLAGS = ['maintenance_mode', 'signup_enabled'] as const;

export async function upsertSetting(key: string, rawValue: string, description: string): Promise<ActionResult> {
  try {
    const cleanKey = settingKeySchema.parse(key);
    if (rawValue.length > 20_000) return { ok: false, error: 'Nilai terlalu besar (maks 20.000 karakter).' };
    let value: unknown;
    try {
      value = JSON.parse(rawValue);
    } catch {
      return { ok: false, error: 'Nilai harus berupa JSON yang valid (mis. true, "teks", 123, {...}).' };
    }
    const cleanDescription = z.string().trim().max(500).parse(description ?? '');
    const actor = await requireRole('admin', 'super_admin');
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('site_settings').upsert(
      { key: cleanKey, value, description: cleanDescription || null, updated_by: actor.userId, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.settings.upsert',
      targetType: 'site_setting',
      targetId: cleanKey,
      reason: `Pengaturan "${cleanKey}" diubah.`,
      metadata: { value, by: actor.email },
    });
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function toggleMaintenanceMode(enabled: boolean, reason: string): Promise<ActionResult> {
  try {
    reasonSchema.parse(reason);
    const actor = await requireRole('admin', 'super_admin');
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('site_settings').upsert(
      {
        key: 'maintenance_mode',
        value: enabled,
        description: 'Bila true, middleware menampilkan halaman perawatan ke semua pengunjung non-admin.',
        updated_by: actor.userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: enabled ? 'admin.settings.maintenance_on' : 'admin.settings.maintenance_off',
      targetType: 'site_setting',
      targetId: 'maintenance_mode',
      reason,
      metadata: { by: actor.email },
    });
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteSetting(key: string, reason: string): Promise<ActionResult> {
  try {
    const cleanKey = settingKeySchema.parse(key);
    reasonSchema.parse(reason);
    if ((RESERVED_FLAGS as readonly string[]).includes(cleanKey)) {
      return { ok: false, error: `Pengaturan "${cleanKey}" dilindungi dan tidak boleh dihapus.` };
    }
    const actor = await requireRole('admin', 'super_admin');
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('site_settings').delete().eq('key', cleanKey);
    if (error) throw error;
    await logAuditEvent(supabase, {
      actorId: actor.userId,
      action: 'admin.settings.delete',
      targetType: 'site_setting',
      targetId: cleanKey,
      reason,
      metadata: { by: actor.email },
    });
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
