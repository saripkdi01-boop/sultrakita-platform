'use strict';

// Bot admin Telegram — diekstrak dari server.js tanpa perubahan perilaku.
const telegramConfigured = () =>
  Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID && process.env.TELEGRAM_WEBHOOK_SECRET);

const telegramAdminAllowed = update => {
  const message = update?.message || update?.channel_post;
  if (!message) return false;
  const chatId = String(message.chat?.id || '');
  const userId = String(message.from?.id || '');
  return chatId === String(process.env.TELEGRAM_ADMIN_CHAT_ID)
    && (!process.env.TELEGRAM_ADMIN_USER_ID || userId === String(process.env.TELEGRAM_ADMIN_USER_ID));
};

const telegramText = update => String(update?.message?.text || update?.channel_post?.text || '').trim();

const telegramSend = async (chatId, text) => {
  if (!process.env.TELEGRAM_BOT_TOKEN) return false;
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: String(text).slice(0, 3900), disable_web_page_preview: true }),
  });
  return response.ok;
};

const formatDonationStatus = donation =>
  donation
    ? `Transaksi ${donation.transaction_id}\nStatus: ${donation.payment_status}\nNominal: Rp${Number(donation.amount).toLocaleString('id-ID')}\nMetode: ${donation.payment_method}\nDibuat: ${donation.created_at}`
    : 'Transaksi tidak ditemukan.';

module.exports = { telegramConfigured, telegramAdminAllowed, telegramText, telegramSend, formatDonationStatus };
