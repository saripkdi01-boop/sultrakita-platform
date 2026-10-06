'use strict';

// Integrasi payment provider (Midtrans/Xendit/Aulaa) — diekstrak dari server.js tanpa perubahan perilaku.
const crypto = require('node:crypto');
const { run } = require('../database');
const { safeEqual } = require('./crypto');

const paymentOrderId = () => `SK-${Date.now()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

const configuredPaymentProvider = () =>
  ['midtrans', 'xendit', 'aulaa'].includes(String(process.env.PAYMENT_PROVIDER || '').toLowerCase())
    ? String(process.env.PAYMENT_PROVIDER).toLowerCase()
    : null;

const providerRequest = async (url, options) => {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = null; }
  if (!response.ok) throw new Error(`Payment provider error ${response.status}: ${String(body?.error_messages?.[0] || body?.message || text).slice(0, 180)}`);
  return body;
};

const createPaymentUrl = async ({ provider, transactionId, amount, name, email, paymentMethod }) => {
  if (!['qris', 'virtual_account'].includes(paymentMethod)) throw new Error('Metode pembayaran belum didukung');
  if (provider === 'midtrans') {
    if (!process.env.MIDTRANS_SERVER_KEY) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi');
    const baseUrl = process.env.MIDTRANS_MODE === 'production' ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';
    const enabledPayments = paymentMethod === 'qris'
      ? ['gopay', 'qris']
      : ['bca_va', 'bni_va', 'bri_va', 'permata_va', 'cimb_va', 'danamon_va', 'bsi_va', 'other_va', 'echannel'];
    const body = {
      transaction_details: { order_id: transactionId, gross_amount: amount },
      customer_details: { first_name: name, email: email || undefined },
      enabled_payments: enabledPayments,
    };
    const result = await providerRequest(`${baseUrl}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    return { provider: 'midtrans', payment_url: result.redirect_url || `${baseUrl}/snap/v2/vtweb/${result.token}`, provider_reference: result.token || transactionId };
  }
  if (provider === 'aulaa') {
    if (!process.env.AULAA_API_KEY) throw new Error('AULAA_API_KEY belum dikonfigurasi');
    const aulaaMethod = paymentMethod === 'qris' ? 'qris' : (process.env.AULAA_VA_METHOD || 'bca_va');
    const baseUrl = (process.env.AULAA_API_BASE || 'https://api.aulaa.co/v1').replace(/\/$/, '');
    const result = await providerRequest(`${baseUrl}/payments`, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.AULAA_API_KEY}`, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ order_id: transactionId, amount, payment_method: aulaaMethod, redirect_url: process.env.PAYMENT_SUCCESS_URL || undefined }),
    });
    if (!result?.id) throw new Error('Respons Aulaa tidak memiliki invoice id');
    return { provider: 'aulaa', payment_url: `https://payment.aulaa.co/pay/${encodeURIComponent(result.id)}`, provider_reference: result.id };
  }
  if (provider === 'xendit') {
    if (!process.env.XENDIT_SECRET_KEY) throw new Error('XENDIT_SECRET_KEY belum dikonfigurasi');
    const body = {
      external_id: transactionId,
      amount,
      payer_email: email || undefined,
      description: `Dukungan SultraKita oleh ${name}`,
      payment_methods: paymentMethod === 'qris' ? ['QRIS'] : ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA'],
      should_send_email: false,
      success_redirect_url: process.env.PAYMENT_SUCCESS_URL || undefined,
      failure_redirect_url: process.env.PAYMENT_FAILURE_URL || undefined,
    };
    const result = await providerRequest('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64')}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    return { provider: 'xendit', payment_url: result.invoice_url, provider_reference: result.id || transactionId };
  }
  return { provider: 'not_configured', payment_url: null, provider_reference: null };
};

const paymentOperation = async ({ provider, transactionId, providerReference, operation, amount, reason }) => {
  if (provider === 'midtrans') {
    if (!process.env.MIDTRANS_SERVER_KEY) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi');
    const baseUrl = process.env.MIDTRANS_MODE === 'production' ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';
    const path = operation === 'cancel' ? `/v2/${encodeURIComponent(transactionId)}/cancel` : `/v2/${encodeURIComponent(transactionId)}/refund`;
    const body = operation === 'refund' ? { refund_key: `SK-${transactionId}-${Date.now()}`, amount, reason: reason || 'Donasi dikembalikan' } : undefined;
    const result = await providerRequest(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { provider: 'midtrans', reference: result?.refund_chargeback_id || result?.order_id || transactionId, raw_status: result?.status_code || 'accepted' };
  }
  if (provider === 'aulaa') {
    if (!process.env.AULAA_API_KEY) throw new Error('AULAA_API_KEY belum dikonfigurasi');
    if (operation !== 'cancel') throw new Error('Refund Aulaa harus diproses melalui dashboard Aulaa sampai endpoint refund resmi tersedia.');
    const baseUrl = (process.env.AULAA_API_BASE || 'https://api.aulaa.co/v1').replace(/\/$/, '');
    const result = await providerRequest(`${baseUrl}/payments/${encodeURIComponent(providerReference || transactionId)}/cancel`, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.AULAA_API_KEY}`, accept: 'application/json' },
    });
    return { provider: 'aulaa', reference: result?.id || providerReference || transactionId, raw_status: 'cancelled' };
  }
  if (provider === 'xendit') {
    if (!process.env.XENDIT_SECRET_KEY) throw new Error('XENDIT_SECRET_KEY belum dikonfigurasi');
    if (operation === 'cancel') {
      const result = await providerRequest(`https://api.xendit.co/invoices/${encodeURIComponent(providerReference || transactionId)}/expire!`, {
        method: 'POST',
        headers: {
          authorization: `Basic ${Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64')}`,
          accept: 'application/json',
        },
      });
      return { provider: 'xendit', reference: result?.id || providerReference || transactionId, raw_status: 'expired' };
    }
    const refundId = `SK-REFUND-${transactionId}-${Date.now()}`;
    const result = await providerRequest(process.env.XENDIT_REFUND_URL || 'https://api.xendit.co/refunds', {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64')}`,
        'idempotency-key': refundId,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ reference_id: transactionId, amount, currency: 'IDR', reason: reason || 'Donasi dikembalikan' }),
    });
    return { provider: 'xendit', reference: result?.id || refundId, raw_status: result?.status || 'PENDING' };
  }
  throw new Error('Provider pembayaran tidak aktif');
};

const verifyMidtransSignature = ({ order_id, status_code, gross_amount, signature_key }) => {
  if (!process.env.MIDTRANS_SERVER_KEY || !signature_key) return false;
  const expected = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
  return safeEqual(expected, signature_key);
};

const verifyAulaaSignature = (rawBody, signature) => {
  if (!process.env.AULAA_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto.createHmac('sha256', process.env.AULAA_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
};

const isSuccessfulPayment = (transactionStatus, fraudStatus) =>
  ['settlement', 'capture'].includes(transactionStatus) && (!fraudStatus || fraudStatus === 'accept');

const recordWebhook = async ({ provider, transactionId, eventStatus, httpStatus, signatureValid, payload, errorMessage = null }) => {
  try {
    await run(
      'INSERT INTO webhook_logs (provider, transaction_id, event_status, http_status, signature_valid, payload, error_message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [provider, transactionId || null, eventStatus || null, httpStatus, signatureValid ? 1 : 0, JSON.stringify(payload || {}).slice(0, 20000), errorMessage]
    );
  } catch (error) { console.error('[webhook-log]', error.message); }
};

module.exports = {
  paymentOrderId, configuredPaymentProvider, providerRequest, createPaymentUrl, paymentOperation,
  verifyMidtransSignature, verifyAulaaSignature, isSuccessfulPayment, recordWebhook,
};
