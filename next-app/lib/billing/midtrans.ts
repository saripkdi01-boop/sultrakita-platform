import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * BILLING MIDTRANS — Klien Midtrans Snap API untuk SukiApps.
 *
 * =====================================================================
 * STATUS: SCAFFOLD. Tanpa kredensial asli file ini tidak melakukan
 * apa pun — semua pemanggil wajib menolak jujur (503 not_configured)
 * bila MIDTRANS_SERVER_KEY kosong. JANGAN commit API key ke repo.
 * JANGAN pernah log nilai key dalam keadaan apa pun.
 *
 * Kunci SANDBOX diawali `SB-Mid-server-`, kunci PRODUCTION diawali
 * `Mid-server-`. Guard `assertKeyAllowed()` menolak kunci PRODUCTION
 * kecuali env SUKI_BILLING_ALLOW_LIVE='true' — mencegah tagihan nyata
 * yang tidak disengaja saat scaffold diuji.
 * =====================================================================
 *
 * Referensi: Midtrans Snap API — POST /snap/v1/transactions
 * (Basic auth: base64("<server_key>:"), response token + redirect_url).
 * Verifikasi notifikasi: signature_key =
 *   SHA512(order_id + status_code + gross_amount + server_key).
 */

export const MIDTRANS_SNAP_SANDBOX_BASE = 'https://app.sandbox.midtrans.com';
export const MIDTRANS_SNAP_PRODUCTION_BASE = 'https://app.midtrans.com';
export const MIDTRANS_API_SANDBOX_BASE = 'https://api.sandbox.midtrans.com';
export const MIDTRANS_API_PRODUCTION_BASE = 'https://api.midtrans.com';

export interface MidtransSnapItem {
  id: string;
  price: number; // IDR, integer
  quantity: number;
  name: string;
}

export interface MidtransSnapInput {
  /** ID order versi Midtrans. Format: `suki_<orderId>` (UUID kita). */
  orderId: string;
  /** Nominal IDR, integer positif. Harus = total item_details. */
  grossAmount: number;
  customerEmail?: string;
  customerFirstName?: string;
  items: MidtransSnapItem[];
}

export interface MidtransSnapResult {
  /** Snap token (untuk Snap.js bila dipakai di frontend nanti). */
  token: string;
  /** URL halaman pembayaran Midtrans — redirect user ke sini. */
  redirectUrl: string;
}

export interface MidtransStatusResult {
  orderId: string;
  /** capture | settlement | pending | deny | cancel | expire | failure | refund | ... */
  transactionStatus: string;
  /** Untuk kartu kredit: challenge | accept | deny. */
  fraudStatus: string | null;
  /** String desimal dari Midtrans, mis. "49000.00". */
  grossAmount: string;
  paymentType: string | null;
  transactionId: string | null;
}

function readServerKey(): string | null {
  const key = process.env.MIDTRANS_SERVER_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
}

/** True bila Midtrans terkonfigurasi (ada server key). */
export function isMidtransConfigured(): boolean {
  return readServerKey() !== null;
}

/** True bila key adalah kunci SANDBOX Midtrans (`SB-Mid-server-...`). */
export function isSandboxKey(key: string): boolean {
  return key.startsWith('SB-Mid-server-');
}

/** True bila key adalah kunci PRODUCTION Midtrans (`Mid-server-...`, bukan SB-). */
export function isProductionKey(key: string): boolean {
  return key.startsWith('Mid-server-') && !isSandboxKey(key);
}

/**
 * Guard anti-kecelakaan: tolak kunci PRODUCTION kecuali
 * SUKI_BILLING_ALLOW_LIVE='true'. Dipanggil setiap kali akan
 * memanggil API Midtrans.
 */
export function assertKeyAllowed(): void {
  const key = readServerKey();
  if (!key) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi.');
  if (isProductionKey(key) && process.env.SUKI_BILLING_ALLOW_LIVE !== 'true') {
    throw new Error(
      'Kunci PRODUCTION Midtrans terdeteksi tetapi SUKI_BILLING_ALLOW_LIVE!=true. ' +
        'Scaffold menolak memproses agar tidak terjadi tagihan nyata.',
    );
  }
}

/** True bila memakai endpoint production (env MIDTRANS_IS_PRODUCTION='true'). */
export function isProductionMode(): boolean {
  return process.env.MIDTRANS_IS_PRODUCTION === 'true';
}

function snapBase(): string {
  return isProductionMode() ? MIDTRANS_SNAP_PRODUCTION_BASE : MIDTRANS_SNAP_SANDBOX_BASE;
}

function apiBase(): string {
  return isProductionMode() ? MIDTRANS_API_PRODUCTION_BASE : MIDTRANS_API_SANDBOX_BASE;
}

function basicAuthHeader(): string {
  const key = readServerKey();
  if (!key) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi.');
  // Nilai key TIDAK PERNAH di-log — hanya dipakai di header Authorization.
  return `Basic ${Buffer.from(`${key}:`, 'utf8').toString('base64')}`;
}

/**
 * Buat transaksi Snap. Mengembalikan token + redirect_url halaman
 * pembayaran Midtrans (QRIS/VA/e-wallet/kartu/retail).
 */
export async function createSnapTransaction(input: MidtransSnapInput): Promise<MidtransSnapResult> {
  assertKeyAllowed();
  if (!Number.isInteger(input.grossAmount) || input.grossAmount <= 0) {
    throw new Error('Nominal transaksi harus integer positif (IDR).');
  }
  const itemsTotal = input.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  if (itemsTotal !== input.grossAmount) {
    throw new Error('gross_amount harus sama dengan total item_details.');
  }
  const res = await fetch(`${snapBase()}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      customer_details: {
        first_name: input.customerFirstName ?? 'Pelanggan SUKI',
        email: input.customerEmail ?? undefined,
      },
      item_details: input.items.map((it) => ({
        id: it.id,
        price: it.price,
        quantity: it.quantity,
        name: it.name,
      })),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Midtrans Snap API error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { token?: string; redirect_url?: string };
  if (!data.token || !data.redirect_url) {
    throw new Error('Respons Snap API tidak memuat token/redirect_url.');
  }
  return { token: data.token, redirectUrl: data.redirect_url };
}

/**
 * Konfirmasi ulang status transaksi ke Midtrans (anti-spoofing lapis kedua
 * untuk webhook). Auth Basic dengan server key.
 */
export async function getTransactionStatus(orderId: string): Promise<MidtransStatusResult> {
  assertKeyAllowed();
  const res = await fetch(`${apiBase()}/v2/${encodeURIComponent(orderId)}/status`, {
    method: 'GET',
    headers: {
      Authorization: basicAuthHeader(),
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Midtrans Status API error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    order_id?: string;
    transaction_status?: string;
    fraud_status?: string;
    gross_amount?: string;
    payment_type?: string;
    transaction_id?: string;
  };
  if (!data.transaction_status || !data.gross_amount) {
    throw new Error('Respons Status API tidak memuat transaction_status/gross_amount.');
  }
  return {
    orderId: data.order_id ?? orderId,
    transactionStatus: data.transaction_status,
    fraudStatus: data.fraud_status ?? null,
    grossAmount: data.gross_amount,
    paymentType: data.payment_type ?? null,
    transactionId: data.transaction_id ?? null,
  };
}

/**
 * Verifikasi signature_key notifikasi Midtrans:
 *   SHA512(order_id + status_code + gross_amount + server_key)
 * dengan perbandingan timing-safe. FAIL-CLOSED: server key kosong
 * atau signature tidak cocok -> false (pemanggil wajib 401).
 */
export function verifyNotificationSignature(args: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): boolean {
  const serverKey = readServerKey();
  if (!serverKey) return false;
  if (!args.signatureKey) return false;
  const expected = createHash('sha512')
    .update(`${args.orderId}${args.statusCode}${args.grossAmount}${serverKey}`, 'utf8')
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(args.signatureKey, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}
