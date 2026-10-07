/**
 * POST /api/admin/write — Generic write untuk superadmin bot.
 * Auth: x-bot-secret (SUKI_BOT_API_SECRET).
 *
 * Body: {
 *   table: 'profiles'|'listings'|'businesses'|'jala_players'|'billing_orders',
 *   id: string,
 *   op: 'update'|'delete',
 *   fields?: Record<string, unknown>  // untuk op=update
 * }
 *
 * SAFETY:
 * - Hanya tabel whitelist
 * - Tidak bisa hapus profiles (cegah hapus user)
 * - Semua dicatat (caller harus audit log)
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, clientIp } from '@/lib/admin/audit-log';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const TABLES = ['profiles', 'listings', 'businesses', 'jala_players',
  'billing_orders'] as const;

const Schema = z.object({
  table: z.enum(TABLES),
  id: z.string().min(1).max(80),
  op: z.enum(['update', 'delete']),
  fields: z.record(z.string(), z.unknown()).optional(),
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

// Field yang boleh diubah per tabel (whitelist).
// KEAMANAN (P1 audit 8 Okt 2026): `role` SENGAJA TIDAK ADA di sini.
// Perubahan role user hanya via dashboard admin (auth terpisah),
// bukan via bot dengan satu secret — cegah eskalasi privilege.
const ALLOWED_FIELDS: Record<string, string[]> = {
  profiles: ['display_name', 'username', 'is_banned'],
  listings: ['title', 'price', 'status', 'description', 'is_featured'],
  businesses: ['name', 'category', 'status', 'description', 'is_verified'],
  jala_players: ['coins', 'username'],
  billing_orders: ['status', 'notes'],
};

export async function POST(request: NextRequest) {
  // Rate limit dulu (sebelum auth) agar brute-force secret terhambat.
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
  const { table, id, op, fields } = parsed.data;

  // Safety: tidak bisa hapus profiles
  if (table === 'profiles' && op === 'delete') {
    return NextResponse.json(
      { ok: false, error: 'Hapus pengguna dilarang via bot. Gunakan dashboard.' },
      { status: 403 });
  }

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ ok: false, error: 'Supabase belum dikonfigurasi.' },
      { status: 503 });
  }

  const ip = clientIp(request.headers);

  try {
    if (op === 'delete') {
      const { error } = await admin.from(table).delete().eq('id', id);
      if (error) throw error;
    } else {
      // Filter hanya field yang diizinkan
      const allowed = ALLOWED_FIELDS[table] || [];
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(fields || {})) {
        if (allowed.includes(k)) clean[k] = v;
      }
      if (Object.keys(clean).length === 0) {
        return NextResponse.json(
          { ok: false, error: 'Tidak ada field valid untuk diubah.' },
          { status: 422 });
      }
      const { error } = await admin.from(table).update(clean).eq('id', id);
      if (error) throw error;
    }
    // Audit log append-only (best-effort, ditulis dari route sendiri)
    await writeAuditLog(admin, {
      route: '/api/admin/write',
      action: op,
      targetTable: table,
      targetId: id,
      detail: op === 'update' ? { fields: Object.keys(fields || {}) } : null,
      ip,
      ok: true,
    });
    return NextResponse.json({ ok: true, data: { table, id, op } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Gagal memproses.';
    await writeAuditLog(admin, {
      route: '/api/admin/write',
      action: op,
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
