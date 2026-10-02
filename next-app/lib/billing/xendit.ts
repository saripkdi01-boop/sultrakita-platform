/**
 * BILLING-LIVE SCAFFOLD — Klien Xendit (Invoice API) untuk SukiApps.
 *
 * =====================================================================
 * STATUS: TEST/SCAFFOLD. Tanpa kredensial asli file ini tidak melakukan
 * apa pun — semua pemanggil wajib menolak jujur (503 not_configured)
 * bila XENDIT_API_KEY kosong. JANGAN commit API key ke repo.
 *
 * Kunci TEST diawali `xnd_development_`, kunci LIVE diawali
 * `xnd_production_`. Guard `assertTestKeyAllowed()` menolak kunci LIVE
 * kecuali env SUKI_BILLING_ALLOW_LIVE='true' — mencegah tagihan nyata
 * yang tidak disengaja saat scaffold diuji.
 * =====================================================================
 *
 * Referensi: Xendit Invoice API v2 — POST /v2/invoices (Basic auth:
 * base64("<api_key>:"), response invoice_url untuk redirect user).
 */

export const XENDIT_API_BASE = 'https://api.xendit.co';

/** Durasi default invoice: 24 jam (detik). */
export const XENDIT_INVOICE_DURATION_SEC = 86_400;

export interface XenditInvoiceInput {
  /** ID eksternal unik milik kita. Format: `suki_<orderId>` (UUID). */
  externalId: string;
  /** Nominal IDR, integer positif. */
  amount: number;
  /** Deskripsi tampil di halaman invoice Xendit. */
  description: string;
  payerEmail?: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  invoiceDurationSec?: number;
}

export interface XenditInvoiceResult {
  xenditId: string;
  externalId: string;
  invoiceUrl: string;
  /** Status saat dibuat — selalu PENDING. */
  status: string;
  expiryDate: string;
}

export interface XenditInvoiceStatus {
  id: string;
  external_id: string;
  status: string; // PENDING | PAID | SETTLED | EXPIRED | FAILED
  amount: number;
  paid_amount: number | null;
  payment_method: string | null;
}

function readApiKey(): string | null {
  const key = process.env.XENDIT_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
}

/** True bila Xendit terkonfigurasi (ada API key). */
export function isXenditConfigured(): boolean {
  return readApiKey() !== null;
}

/** True bila key adalah kunci LIVE Xendit. */
export function isLiveKey(key: string): boolean {
  return key.startsWith('xnd_production_');
}

/**
 * Guard anti-kecelakaan: tolak kunci LIVE kecuali SUKI_BILLING_ALLOW_LIVE='true'.
 * Dipanggil setiap kali akan memanggil API Xendit.
 */
export function assertKeyAllowed(): void {
  const key = readApiKey();
  if (!key) throw new Error('XENDIT_API_KEY belum dikonfigurasi.');
  if (isLiveKey(key) && process.env.SUKI_BILLING_ALLOW_LIVE !== 'true') {
    throw new Error(
      'Kunci LIVE Xendit terdeteksi tetapi SUKI_BILLING_ALLOW_LIVE!=true. ' +
        'Scaffold menolak memproses agar tidak terjadi tagihan nyata.',
    );
  }
}

async function xenditFetch(path: string, init: RequestInit): Promise<Response> {
  const key = readApiKey();
  if (!key) throw new Error('XENDIT_API_KEY belum dikonfigurasi.');
  const auth = Buffer.from(`${key}:`, 'utf8').toString('base64');
  return fetch(`${XENDIT_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

/**
 * Buat invoice Xendit. Mengembalikan URL halaman pembayaran hosted
 * (invoice_url) untuk redirect user.
 */
export async function createXenditInvoice(input: XenditInvoiceInput): Promise<XenditInvoiceResult> {
  assertKeyAllowed();
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error('Nominal invoice harus integer positif (IDR).');
  }
  const res = await xenditFetch('/v2/invoices', {
    method: 'POST',
    body: JSON.stringify({
      external_id: input.externalId,
      amount: input.amount,
      description: input.description,
      payer_email: input.payerEmail,
      invoice_duration: input.invoiceDurationSec ?? XENDIT_INVOICE_DURATION_SEC,
      success_redirect_url: input.successRedirectUrl,
      failure_redirect_url: input.failureRedirectUrl,
      currency: 'IDR',
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Xendit invoice gagal (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    id: string;
    external_id: string;
    invoice_url: string;
    status: string;
    expiry_date: string;
  };
  if (!data?.id || !data?.invoice_url) {
    throw new Error('Respons Xendit tidak lengkap (id/invoice_url hilang).');
  }
  return {
    xenditId: data.id,
    externalId: data.external_id,
    invoiceUrl: data.invoice_url,
    status: data.status,
    expiryDate: data.expiry_date,
  };
}

/**
 * Ambil status invoice terkini dari Xendit — dipakai webhook untuk
 * verifikasi ulang SEBELUM memberikan entitlement (anti-spoofing).
 */
export async function getXenditInvoice(invoiceId: string): Promise<XenditInvoiceStatus> {
  assertKeyAllowed();
  const res = await xenditFetch(`/v2/invoices/${encodeURIComponent(invoiceId)}`, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Xendit get invoice gagal (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    id: string;
    external_id: string;
    status: string;
    amount: number;
    paid_amount: number | null;
    payment_method: string | null;
  };
  return {
    id: data.id,
    external_id: data.external_id,
    status: data.status,
    amount: data.amount,
    paid_amount: data.paid_amount,
    payment_method: data.payment_method,
  };
}
