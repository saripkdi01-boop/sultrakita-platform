'use strict';

const { query } = require('./database');
const { normalizeRole } = require('./rbac');

const elevated = req => ['admin', 'super_admin'].includes(normalizeRole(req.user?.role));

function requireOwnership(getOwnerId) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
    try {
      const ownerId = await getOwnerId(req);
      if (elevated(req) || Number(ownerId) === Number(req.user.id)) return next();
      return res.status(403).json({ success: false, error: 'Akses tidak diizinkan' });
    } catch (error) { return next(error); }
  };
}

function requireConversationMember() {
  const ownership = requireOwnership(async req => {
    const conversationId = Number(req.params.id);
    const [conversation] = await query('SELECT buyer_id, seller_id FROM conversations WHERE id = ?', [conversationId]);
    if (!conversation) return null;
    return Number(conversation.buyer_id) === Number(req.user.id) || Number(conversation.seller_id) === Number(req.user.id) ? req.user.id : null;
  });
  return (req, res, next) => {
    const conversationId = Number(req.params.id);
    if (!Number.isSafeInteger(conversationId) || conversationId < 1) return res.status(400).json({ success: false, error: 'ID percakapan tidak valid' });
    return ownership(req, res, next);
  };
}

function requireSellerOwnership(getSellerId) {
  return requireOwnership(getSellerId);
}

module.exports = { requireOwnership, requireConversationMember, requireSellerOwnership };
