/**
 * POST /api/admin/moderate — Moderasi konten untuk bot superadmin.
 * Auth: x-bot-secret (SUKI_BOT_API_SECRET).
 *
 * Body: { table: 'listings', id: string, action: 'approve'|'reject'|'delete' }
 *
 * - approve: status -> 'published'
 * - reject: status -> 'rejected'
 * - delete: hapus row
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, clientIp } from '@/lib/admin/audit-log';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const Schema = z.object({
  table: z.enum(['listings', 'businesses']),
  id: z.string().min(1).max(80),
  action: z.enum(['approve', 'reject', 'delete']),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function authorized(request: NextRequest): boolean {
  const secret = process.env.SUKI_BOT_API_SECRET;
  return !!secret && request.headers.get('x-bot-secret') === secret;
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'Akses ditolak.' },
      { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid.' },
      { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Input tidak valid.' },
      { status: 422 });
  }
  const { table, id, action } = parsed.data;

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ ok: false, error: 'Supabase belum dikonfigurasi.' },
      { status: 503 });
  }

  const ip = clientIp(request.headers);

  try {
    if (action === 'delete') {
      const { error } = await admin.from(table).delete().eq('id', id);
      if (error) throw error;
    } else {
      const status = action === 'approve' ? 'published' : 'rejected';
      const { error } = await admin.from(table).update({ status }).eq('id', id);
      if (error) throw error;
    }
    await writeAuditLog(admin, {
      route: '/api/admin/moderate',
      action,
      targetTable: table,
      targetId: id,
      ip,
      ok: true,
    });
    return NextResponse.json({ ok: true, data: { table, id, action } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Gagal memproses.';
    await writeAuditLog(admin, {
      route: '/api/admin/moderate',
      action,
      targetTable: table,
      targetId: id,
      ip,
      ok: false,
      error: msg,
    });
    return NextResponse.json({ ok: false, error: msg.slice(0, 200) },
      { status: 500 });
  }
}
