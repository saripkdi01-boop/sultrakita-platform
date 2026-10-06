'use strict';

// Klien WhatsApp Cloud API — diekstrak dari server.js tanpa perubahan perilaku.
const normalizeWhatsAppPhone = phone => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('08')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  if (digits.startsWith('62')) return digits;
  return null;
};

const whatsappApi = async (phoneNumberId, accessToken, payload, version) => {
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', ...payload }),
  });
  return response;
};

const sendWhatsAppOtp = async (phone, code) => {
  const to = normalizeWhatsAppPhone(phone);
  if (!to) return false;
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  const components = [{ type: 'body', parameters: [{ type: 'text', text: String(code) }] }];
  const response = await whatsappApi(process.env.WHATSAPP_PHONE_NUMBER_ID, process.env.WHATSAPP_ACCESS_TOKEN, {
    to, type: 'template',
    template: {
      name: process.env.WHATSAPP_OTP_TEMPLATE_NAME,
      language: { code: process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE || 'id' },
      components,
    },
  }, version);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`WhatsApp OTP gagal dikirim (${response.status}): ${detail.slice(0, 200)}`);
  }
  return true;
};

const sendWhatsAppText = async (phone, body) => {
  const to = normalizeWhatsAppPhone(phone);
  if (!to || !process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) return { sent: false, reason: 'not_configured' };
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  const response = await whatsappApi(process.env.WHATSAPP_PHONE_NUMBER_ID, process.env.WHATSAPP_ACCESS_TOKEN, {
    to, type: 'text', text: { preview_url: false, body: String(body).slice(0, 3500) },
  }, version);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`WhatsApp provider gagal mengirim notifikasi (${response.status}): ${detail.slice(0, 200)}`);
  }
  return { sent: true };
};

const sendWhatsAppTemplate = async (phone, variables) => {
  const to = normalizeWhatsAppPhone(phone);
  if (!to || !process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_TEMPLATE_NAME) {
    return { sent: false, reason: 'template_not_configured' };
  }
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  const components = [{
    type: 'body',
    parameters: Object.values(variables).slice(0, 4).map(value => ({ type: 'text', text: String(value ?? '-').slice(0, 900) })),
  }];
  const response = await whatsappApi(process.env.WHATSAPP_PHONE_NUMBER_ID, process.env.WHATSAPP_ACCESS_TOKEN, {
    to, type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'id' },
      components,
    },
  }, version);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Template WhatsApp gagal dikirim (${response.status}): ${detail.slice(0, 200)}`);
  }
  return { sent: true };
};

const notifySellerWhatsApp = async ({ phone, sellerName, listingTitle, senderName, message, channel = 'pertanyaan' }) => {
  if (!phone) return;
  try {
    const result = await sendWhatsAppTemplate(phone, { sellerName, listingTitle, senderName, message });
    if (result.reason === 'template_not_configured') console.info('[whatsapp-notification] template belum dikonfigurasi; notifikasi dilewati');
  } catch (error) {
    console.error('[whatsapp-notification]', error.message);
  }
};

module.exports = { normalizeWhatsAppPhone, sendWhatsAppOtp, sendWhatsAppText, sendWhatsAppTemplate, notifySellerWhatsApp };
