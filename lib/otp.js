'use strict';

// Layanan OTP multi-channel (email + WhatsApp) — diekstrak dari server.js tanpa perubahan perilaku.
const crypto = require('node:crypto');
const { Resend } = require('resend');
const { sendWhatsAppOtp } = require('./whatsapp');
const { normalizeWhatsAppPhone } = require('./whatsapp');

const emailProviderConfig = () => {
  const provider = String(process.env.EMAIL_PROVIDER || 'resend').trim().toLowerCase();
  const isResend = provider === 'resend';
  const url = isResend ? 'https://api.resend.com/emails' : String(process.env.EMAIL_PROVIDER_URL || '').trim();
  const token = isResend
    ? String(process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_TOKEN || '').trim()
    : String(process.env.EMAIL_PROVIDER_TOKEN || '').trim();
  const from = String(process.env.EMAIL_FROM || '').trim();
  return { provider, isResend, url, token, from, configured: Boolean(url && from && token) };
};

const otpEmailContent = code => ({
  subject: 'Kode verifikasi SultraKita',
  text: `Kode verifikasi SultraKita Anda adalah ${code}. Kode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`,
  html: `<p>Kode verifikasi SultraKita Anda adalah <strong>${code}</strong>.</p><p>Kode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.</p>`,
});

const sendEmailOtp = async (email, code) => {
  const config = emailProviderConfig();
  if (!config.configured) return false;
  const content = otpEmailContent(code);
  if (config.isResend) {
    const resend = new Resend(config.token);
    const { error } = await resend.emails.send({
      from: config.from,
      to: [email],
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: String(process.env.EMAIL_REPLY_TO).trim() } : {}),
      ...content,
    });
    if (error) throw new Error(`Provider email gagal mengirim OTP: ${String(error.message || 'Resend error').slice(0, 200)}`);
    return true;
  }
  const payload = {
    from: config.from, to: email, ...content,
    ...(process.env.EMAIL_REPLY_TO ? { reply_to: String(process.env.EMAIL_REPLY_TO).trim() } : {}),
  };
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${config.token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Provider email gagal mengirim OTP (${response.status}): ${detail.slice(0, 200)}`);
  }
  return true;
};

const sendOtp = async (channel, destination, code) => {
  if (channel === 'email') return sendEmailOtp(destination, code);
  const whatsappConfigured = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_OTP_TEMPLATE_NAME);
  if (whatsappConfigured) return sendWhatsAppOtp(destination, code);
  if (!process.env.OTP_PROVIDER_URL) return false;
  const response = await fetch(process.env.OTP_PROVIDER_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(process.env.OTP_PROVIDER_TOKEN ? { authorization: `Bearer ${process.env.OTP_PROVIDER_TOKEN}` } : {}),
    },
    body: JSON.stringify({ phone: normalizeWhatsAppPhone(destination), code, channel: 'whatsapp' }),
  });
  if (!response.ok) throw new Error('Provider OTP WhatsApp gagal mengirim kode');
  return true;
};

const otpDestinationHash = (channel, destination) =>
  crypto.createHash('sha256').update(`${channel}:${destination}:${process.env.OTP_DESTINATION_PEPPER || ''}`).digest('hex');

const otpDestinationCooldownSeconds = () =>
  Math.min(300, Math.max(30, Number(process.env.OTP_DESTINATION_COOLDOWN_SECONDS || 60)));

module.exports = { emailProviderConfig, sendEmailOtp, sendOtp, otpDestinationHash, otpDestinationCooldownSeconds };
