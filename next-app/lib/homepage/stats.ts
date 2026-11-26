/**
 * Angka hidup homepage — dihitung server-side dari database pusat (Supabase).
 *
 * - Memakai klien anon TANPA cookie supaya halaman tetap statis + ISR
 *   (app/page.tsx: revalidate 300 detik). Hanya baris publik yang terhitung (RLS).
 * - Setiap hitungan dibatasi timeout; gagal → null, tidak pernah throw.
 * - Bila database tidak terbaca, UI memakai CONTOH_COUNTS dan WAJIB menampilkan
 *   label "contoh" — angka contoh tidak boleh tampil seolah nyata.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { KENDARI_KATEGORI } from '@/lib/seo/lokal-kendari';
import type { DoorId } from './content';

export type LiveCount = {
  value: number;
  /** live = dari database/kode; contoh = angka contoh [CONTOH]. */
  source: 'live' | 'contoh';
};

export type HomeStats = Record<DoorId, LiveCount>;

/* [CONTOH] — angka contoh, BUKAN data nyata. Hanya dipakai bila database pusat
   tidak terbaca, dan UI selalu menempelkan label "contoh". Cari-ganti "[CONTOH]". */
export const CONTOH_COUNTS: Record<Exclude<DoorId, 'kendari'>, number> = {
  marketplace: 120, // [CONTOH]
  properti: 40, // [CONTOH]
  lowongan: 15, // [CONTOH]
  komunitas: 8, // [CONTOH]
  bisnis: 25, // [CONTOH]
};

const TIMEOUT_MS = 2500;

function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) }),
    },
  });
}

type CountQuery = ReturnType<ReturnType<SupabaseClient['from']>['select']>;

async function countRows(
  client: SupabaseClient,
  table: string,
  narrow: (query: CountQuery) => CountQuery,
): Promise<number | null> {
  try {
    const { count, error } = await narrow(client.from(table).select('id', { count: 'exact', head: true }));
    if (error || typeof count !== 'number') return null;
    return count;
  } catch (error) {
    // Timeout / jaringan / tabel belum ada → jatuh ke angka contoh berlabel.
    if (process.env.NODE_ENV !== 'production') console.warn('[homepage] hitung gagal:', table, error);
    return null;
  }
}

function pick(id: Exclude<DoorId, 'kendari'>, live: number | null): LiveCount {
  return live === null ? { value: CONTOH_COUNTS[id], source: 'contoh' } : { value: live, source: 'live' };
}

export async function getHomeStats(): Promise<HomeStats> {
  const client = anonClient();
  const [marketplace, properti, lowongan, komunitas, bisnis] = client
    ? await Promise.all([
        countRows(client, 'listings', (q) => q.in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false')),
        countRows(client, 'properties', (q) => q.eq('status', 'available')),
        countRows(client, 'jobs', (q) => q.eq('status', 'published')),
        countRows(client, 'groups', (q) => q.eq('privacy', 'public')),
        countRows(client, 'businesses', (q) => q.eq('status', 'approved')),
      ])
    : [null, null, null, null, null];

  return {
    marketplace: pick('marketplace', marketplace),
    properti: pick('properti', properti),
    lowongan: pick('lowongan', lowongan),
    komunitas: pick('komunitas', komunitas),
    bisnis: pick('bisnis', bisnis),
    // Nyata dari kode: jumlah halaman panduan /kendari/[slug].
    kendari: { value: KENDARI_KATEGORI.length, source: 'live' },
  };
}
