/**
 * KONTRAK BERSAMA — Taksonomi event analytics SukiApps (milik SLICE-D).
 *
 * Nama event di bawah ini FINAL. Slice lain hanya mengimpor dari file ini;
 * menambah/mengubah nama event harus dikoordinasikan dengan pemilik kontrak.
 *
 * ── ASUMSI PRIVASI (wajib dibaca sebelum memanggil trackEvent) ─────────────
 * 1. `props` TIDAK BOLEH berisi PII: tanpa email, nomor telepon/WhatsApp, nama
 *    lengkap, alamat persis, NIK, foto identitas, atau koordinat presisi tinggi.
 *    Yang boleh: id internal (listing_id, job_id, order_id), kategori/label umum,
 *    nominal harga, flag boolean, dan angka agregat (results_count).
 * 2. `userId` adalah id internal auth (pseudonim), bukan identitas langsung.
 * 3. `sessionId` harus token acak anonim per sesi browser (lihat `newSessionId()`),
 *    BUKAN fingerprint perangkat atau pengenal lintas-situs.
 * 4. `path` otomatis dipotong pada query string (`/cari?q=...` → `/cari`) karena
 *    query bisa mengandung PII atau token.
 * 5. Event `search`: kolom `query` adalah ketikan mentah pengguna (dipotong 120
 *    karakter). Anggap kolom ini sensitif: jangan tampilkan mentah di dashboard
 *    publik, dan jangan ekspor tanpa agregasi.
 * 6. Retensi: baris analytics_events dihapus setelah 180 hari (lihat migrasi
 *    20261001140004_analytics_events.sql).
 *
 * `trackEvent` dirancang server-side (Server Action / Route Handler) dan TIDAK
 * PERNAH throw — kegagalan dicatat ke console dan dikembalikan sebagai
 * `{ ok: false }` agar tidak mengganggu alur utama pengguna.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/** Daftar nama event final. Gunakan `EventName` sebagai tipe, bukan string bebas. */
export const EVENT_NAMES = {
  view_listing: 'view_listing',
  search: 'search',
  filter_apply: 'filter_apply',
  save_listing: 'save_listing',
  contact_seller: 'contact_seller',
  create_listing: 'create_listing',
  publish_listing: 'publish_listing',
  signup: 'signup',
  login: 'login',
  report_content: 'report_content',
  checkout_started: 'checkout_started',
  purchase_sandbox_completed: 'purchase_sandbox_completed',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

/**
 * Skema payload per event. Semua field opsional-ketat: hanya kirim data nyata
 * yang tersedia; jangan mengarang nilai (mis. jangan kirim results_count tebakan).
 */
export interface EventPayloads {
  /** Pengguna membuka halaman detail listing. */
  view_listing: {
    listing_id: string;
    listing_type: 'marketplace' | 'property' | 'job';
    source?: string;
  };
  /** Pengguna menjalankan pencarian. `query` = ketikan mentah (sensitif, lihat catatan privasi). */
  search: {
    query: string;
    scope: 'marketplace' | 'property' | 'jobs' | 'groups' | 'global';
    results_count?: number;
  };
  /** Pengguna menerapkan filter di halaman listing. */
  filter_apply: {
    scope: 'marketplace' | 'property' | 'jobs';
    filters: Record<string, string>;
  };
  /** Pengguna menyimpan listing ke favorit. */
  save_listing: {
    listing_id: string;
    listing_type: 'marketplace' | 'property' | 'job';
  };
  /** Pengguna menekan tombol hubungi penjual/pemberi kerja. */
  contact_seller: {
    listing_id: string;
    listing_type: 'marketplace' | 'property' | 'job';
    channel?: 'whatsapp' | 'telepon' | 'chat' | 'formulir';
  };
  /** Pengguna mulai membuat listing (draf dibuat). */
  create_listing: {
    listing_type: 'marketplace' | 'property' | 'job';
  };
  /** Listing diterbitkan (status → aktif/tayang). */
  publish_listing: {
    listing_id: string;
    listing_type: 'marketplace' | 'property' | 'job';
  };
  /** Pendaftaran akun berhasil. */
  signup: {
    method?: 'email' | 'google' | 'phone';
  };
  /** Login berhasil. */
  login: {
    method?: 'email' | 'google' | 'phone';
  };
  /** Pengguna melaporkan konten. `reason` = kode kategori, bukan teks bebas. */
  report_content: {
    target_type: 'listing' | 'post' | 'comment' | 'user' | 'group';
    target_id: string;
    reason: string;
  };
  /** Checkout sandbox dimulai (SLICE-C). Tanpa nominal sensitif di luar harga paket. */
  checkout_started: {
    plan_id: string;
    amount_idr?: number;
  };
  /** Pembayaran SANDBOX selesai. JANGAN pakai untuk transaksi nyata. */
  purchase_sandbox_completed: {
    order_id: string;
    plan_id: string;
    amount_idr?: number;
  };
}

export type EventPayload<N extends EventName> = EventPayloads[N];

export interface TrackEventInput<N extends EventName = EventName> {
  eventName: N;
  /** Id internal auth pengguna (opsional; null = anonim). */
  userId?: string | null;
  /** Token sesi anonim (opsional; null = tanpa sesi). */
  sessionId?: string | null;
  /** Payload sesuai EventPayloads[N]. Tanpa PII. */
  props?: EventPayload<N>;
  /** Pathname halaman; query string dipotong otomatis. */
  path?: string | null;
}

/**
 * Buat token sesi anonim baru. Simpan di cookie httpOnly (SameSite=Lax) sisi
 * server, atau teruskan dari klien sebagai nilai buram — jangan diisi data
 * yang bisa mengidentifikasi pengguna.
 */
export function newSessionId(): string {
  return crypto.randomUUID();
}

/** Batas panjang agar satu event nakal tidak membengkakkan tabel. */
const MAX_PATH_LENGTH = 500;
const MAX_QUERY_LENGTH = 120;

function sanitizeProps<N extends EventName>(eventName: N, props: EventPayload<N> | undefined): Record<string, unknown> {
  const raw = (props ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (typeof value === 'string') {
      // search.query dipotong; field string lain juga dibatasi wajar.
      const limit = eventName === 'search' && key === 'query' ? MAX_QUERY_LENGTH : 500;
      out[key] = value.slice(0, limit);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    } else if (value !== null && typeof value === 'object') {
      // Objek nested (mis. filters) diizinkan; string di dalamnya ikut dipotong.
      try {
        out[key] = JSON.parse(JSON.stringify(value, (_k, v) => (typeof v === 'string' ? v.slice(0, 200) : v)));
      } catch {
        // Nilai tidak bisa diserialisasi → buang agar insert tidak gagal.
      }
    }
  }
  return out;
}

/**
 * Catat satu event analytics ke tabel `public.analytics_events`.
 * Server-side only. Tidak pernah throw; kegagalan → `{ ok: false }`.
 */
export async function trackEvent<N extends EventName>(
  supabase: SupabaseClient,
  input: TrackEventInput<N>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!input || !(Object.values(EVENT_NAMES) as string[]).includes(input.eventName)) {
      return { ok: false, error: 'eventName tidak dikenal' };
    }
    const rawPath = typeof input.path === 'string' ? input.path : null;
    const path = rawPath ? rawPath.split('?')[0].slice(0, MAX_PATH_LENGTH) || null : null;

    const { error } = await supabase.from('analytics_events').insert({
      event_name: input.eventName,
      user_id: input.userId ?? null,
      session_id: input.sessionId ?? null,
      props: sanitizeProps(input.eventName, input.props),
      path,
    });

    if (error) {
      console.warn('[analytics] trackEvent gagal:', input.eventName, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.warn('[analytics] trackEvent exception:', message);
    return { ok: false, error: message };
  }
}
