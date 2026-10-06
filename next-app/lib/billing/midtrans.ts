/**
 * Adapter pembayaran Midtrans (PRODUCTION) untuk SukiApps.
 *
 * Menggunakan Midtrans Snap API:
 *  - Checkout: POST /snap/v1/transactions -> { token, redirect_url }
 *  - Notifikasi: webhook memverifikasi signature_key =
 *    SHA512(order_id + status_code + gross_amount + server_key)
 *
 * ENV yang dibutuhkan:
 *  - MIDTRANS_SERVER_KEY   (wajib)
 *  - MIDTRANS_CLIENT_KEY   (wajib, untuk Snap.js di frontend)
 *  - MIDTRANS_IS_PRODUCTION ("true" untuk production)
 *
 * Dok: https://docs.midtrans.com
 */

import { createHash, timingSafeEqual } from 'node:crypto';

export const MIDTRANS_PROVIDER = 'midtrans' as const;

export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
}

export function getMidtransConfig(): MidtransConfig {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;
  if (!serverKey || !clientKey) {
    throw new Error('Layanan pembayaran Midtrans belum dikonfigurasi.');
  }
  return {
    serverKey,
    clientKey,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  };
}

function baseUrl(cfg: MidtransConfig): string {
  return cfg.isProduction ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';
}

function authHeader(cfg: MidtransConfig): string {
  return 'Basic ' + Buffer.from(cfg.serverKey + ':').toString('base64');
}

export interface SnapTransactionInput {
  orderId: string; // UUID order SukiApps (<= 50 char, unik)
  amount: number; // IDR, integer
  planName: string;
  customerEmail?: string;
  customerName?: string;
}

export interface SnapTransactionResult {
  token: string;
  redirectUrl: string;
}

/**
 * Membuat transaksi Snap di Midtrans. TIDAK memindahkan uang —
 * uang baru bergerak saat pelanggan menyelesaikan pembayaran di halaman Snap.
 */
export async function createSnapTransaction(
  cfg: MidtransConfig,
  input: SnapTransactionInput,
): Promise<SnapTransactionResult> {
  const res = await fetch(baseUrl(cfg) + '/snap/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader(cfg),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: Math.round(input.amount),
      },
      item_details: [
        {
          id: input.orderId,
          price: Math.round(input.amount),
          quantity: 1,
          name: input.planName.slice(0, 50),
        },
      ],
      customer_details: {
        email: input.customerEmail,
        first_name: (input.customerName || 'Pelanggan SUKI').slice(0, 50),
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Midtrans Snap API gagal (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { token?: string; redirect_url?: string };
  if (!data.token || !data.redirect_url) {
    throw new Error('Respons Midtrans tidak lengkap (token/redirect_url hilang).');
  }
  return { token: data.token, redirectUrl: data.redirect_url };
}

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string; // capture | settlement | pending | deny | cancel | expire
  fraud_status?: string; // accept | challenge | deny
  transaction_id?: string;
  payment_type?: string;
}

/**
 * Verifikasi signature_key notifikasi Midtrans (fail-CLOSED):
 * SHA512(order_id + status_code + gross_amount + server_key) harus sama.
 */
export function verifyNotificationSignature(
  cfg: MidtransConfig,
  n: MidtransNotification,
): boolean {
  if (!n.order_id || !n.status_code || !n.gross_amount || !n.signature_key) return false;
  const raw = n.order_id + n.status_code + n.gross_amount + cfg.serverKey;
  const expected = createHash('sha512').update(raw).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(n.signature_key, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export type MidtransOutcome = 'paid' | 'pending' | 'failed';

/**
 * Petakan transaction_status Midtrans -> outcome SukiApps.
 * - capture (fraud accept) / settlement -> paid
 * - pending / challenge -> pending
 * - deny / cancel / expire -> failed
 */
export function mapTransactionStatus(n: MidtransNotification): MidtransOutcome {
  const s = n.transaction_status;
  if (s === 'capture') {
    return n.fraud_status === 'challenge' ? 'pending' : 'paid';
  }
  if (s === 'settlement') return 'paid';
  if (s === 'pending') return 'pending';
  return 'failed'; // deny | cancel | expire | lainnya
}
