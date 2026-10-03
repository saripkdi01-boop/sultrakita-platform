'use server';

// FASE B1 — aksi Error Inbox (hanya admin/super_admin).

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/admin/guards';
import { getServerSupabase } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/security/audit';

export async function setErrorResolved(id: string, resolved: boolean): Promise<{ ok: boolean; error?: string }> {
  let session;
  try {
    session = await requireRole('admin', 'super_admin');
  } catch {
    return { ok: false, error: 'Akses admin diperlukan.' };
  }
  if (!id || typeof id !== 'string') return { ok: false, error: 'ID tidak valid.' };
  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase
      .from('error_events')
      .update({
        resolved,
        resolved_at: resolved ? new Date().toISOString() : null,
        resolved_by: resolved ? session.userId : null,
      })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    await logAuditEvent(supabase, {
      actorId: session.userId,
      action: resolved ? 'error.resolve' : 'error.reopen',
      targetType: 'error_events',
      targetId: id,
      reason: null,
      metadata: {},
    });
    revalidatePath('/admin/errors');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal memperbarui status.' };
  }
}
