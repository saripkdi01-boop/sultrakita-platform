'use server';

// FASE B4 — aksi kelola pengumuman (hanya admin/super_admin).

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/admin/guards';
import { getServerSupabase } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/security/audit';

export interface AnnouncementInput {
  title: string;
  body: string;
  link_url?: string;
  link_label?: string;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
}

function clean(input: AnnouncementInput) {
  const title = input.title.trim().slice(0, 120);
  const body = input.body.trim().slice(0, 500);
  if (!title || !body) throw new Error('Judul dan isi wajib diisi.');
  const link_url = (input.link_url || '').trim().slice(0, 500);
  if (link_url && !/^(\/|https?:\/\/)/i.test(link_url)) throw new Error('Link harus diawali / atau http(s)://');
  return {
    title,
    body,
    link_url: link_url || null,
    link_label: (input.link_label || '').trim().slice(0, 60) || null,
    starts_at: input.starts_at ? new Date(input.starts_at).toISOString() : new Date().toISOString(),
    ends_at: input.ends_at ? new Date(input.ends_at).toISOString() : null,
    is_active: input.is_active !== false,
  };
}

export async function createAnnouncement(input: AnnouncementInput): Promise<{ ok: boolean; error?: string }> {
  let session;
  try {
    session = await requireRole('admin', 'super_admin');
  } catch {
    return { ok: false, error: 'Akses admin diperlukan.' };
  }
  try {
    const supabase = await getServerSupabase();
    const row = clean(input);
    const { data, error } = await supabase
      .from('announcements')
      .insert({ ...row, created_by: session.userId })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };
    await logAuditEvent(supabase, { actorId: session.userId, action: 'announcement.create', targetType: 'announcements', targetId: data?.id ?? null, reason: null, metadata: { title: row.title } });
    revalidatePath('/admin/announcements');
    revalidatePath('/api/announcements/active');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal membuat pengumuman.' };
  }
}

export async function toggleAnnouncement(id: string, is_active: boolean): Promise<{ ok: boolean; error?: string }> {
  let session;
  try {
    session = await requireRole('admin', 'super_admin');
  } catch {
    return { ok: false, error: 'Akses admin diperlukan.' };
  }
  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('announcements').update({ is_active }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    await logAuditEvent(supabase, { actorId: session.userId, action: is_active ? 'announcement.activate' : 'announcement.deactivate', targetType: 'announcements', targetId: id, reason: null, metadata: {} });
    revalidatePath('/admin/announcements');
    revalidatePath('/api/announcements/active');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal memperbarui.' };
  }
}

export async function deleteAnnouncement(id: string): Promise<{ ok: boolean; error?: string }> {
  let session;
  try {
    session = await requireRole('admin', 'super_admin');
  } catch {
    return { ok: false, error: 'Akses admin diperlukan.' };
  }
  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    await logAuditEvent(supabase, { actorId: session.userId, action: 'announcement.delete', targetType: 'announcements', targetId: id, reason: null, metadata: {} });
    revalidatePath('/admin/announcements');
    revalidatePath('/api/announcements/active');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal menghapus.' };
  }
}
