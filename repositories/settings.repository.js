const { query, run } = require('../database');

async function getAccountBundle(userId) {
  const [row] = await query(`SELECT u.id,u.name,u.email,u.phone,u.district,u.bio,u.avatar_url,u.created_at,u.deleted_at,u.deletion_scheduled_at,
    us.dark_mode,us.language,us.app_icon,us.notifications_enabled,us.autoplay_videos,us.reduce_motion,us.personalized_feed,us.personalized_ads,us.show_sensitive_content,us.save_link_history,
    ps.profile_visibility,ps.show_activity_status,ps.allow_tagging,ps.data_sharing_consent,ps.activity_visibility,ps.phone_visibility,ps.email_visibility,ps.searchable_by_email,ps.searchable_by_phone,ps.allow_messages_from,ps.allow_comments_from,ps.personalized_recommendations,ps.data_collection_analytics,
    ns.email_notifications,ns.push_notifications,ns.sms_notifications,ns.comments,ns.replies,ns.messages,ns.order_updates,ns.payment_updates,ns.seller_updates,ns.security_alerts,ns.promotions,ns.quiet_hours_enabled,ns.quiet_hours_start,ns.quiet_hours_end
    FROM users u LEFT JOIN user_settings us ON us.user_id=u.id LEFT JOIN privacy_settings ps ON ps.user_id=u.id LEFT JOIN notification_settings ns ON ns.user_id=u.id WHERE u.id=? LIMIT 1`, [userId]);
  return row || null;
}

async function upsertPreferences(userId, values) {
  const fields = ['dark_mode','language','app_icon','notifications_enabled','autoplay_videos','reduce_motion','personalized_feed','personalized_ads','show_sensitive_content','save_link_history'];
  const payload = fields.map(field => values[field]);
  return query(`INSERT INTO user_settings (user_id,${fields.join(',')}) VALUES (?,${fields.map(() => '?').join(',')}) ON CONFLICT (user_id) DO UPDATE SET ${fields.map(field => `${field}=EXCLUDED.${field}`).join(',')},updated_at=CURRENT_TIMESTAMP RETURNING ${fields.join(',')}`, [userId, ...payload]);
}

async function upsertPrivacy(userId, values) {
  const fields = ['profile_visibility','show_activity_status','allow_tagging','data_sharing_consent','activity_visibility','phone_visibility','email_visibility','searchable_by_email','searchable_by_phone','allow_messages_from','allow_comments_from','personalized_recommendations','data_collection_analytics'];
  return query(`INSERT INTO privacy_settings (user_id,${fields.join(',')}) VALUES (?,${fields.map(() => '?').join(',')}) ON CONFLICT (user_id) DO UPDATE SET ${fields.map(field => `${field}=EXCLUDED.${field}`).join(',')},updated_at=CURRENT_TIMESTAMP RETURNING ${fields.join(',')}`, [userId, ...fields.map(field => values[field])]);
}

async function upsertNotifications(userId, values) {
  const fields = ['email_notifications','push_notifications','sms_notifications','comments','replies','messages','order_updates','payment_updates','seller_updates','security_alerts','promotions','quiet_hours_enabled','quiet_hours_start','quiet_hours_end'];
  return query(`INSERT INTO notification_settings (user_id,${fields.join(',')}) VALUES (?,${fields.map(() => '?').join(',')}) ON CONFLICT (user_id) DO UPDATE SET ${fields.map(field => `${field}=EXCLUDED.${field}`).join(',')},updated_at=CURRENT_TIMESTAMP RETURNING ${fields.join(',')}`, [userId, ...fields.map(field => values[field])]);
}

async function writeActivity(userId, action, entityType, metadata = {}) {
  return run('INSERT INTO account_activity_logs (user_id,action,entity_type,metadata) VALUES (?,?,?,?)', [userId, action, entityType, JSON.stringify(metadata)]);
}

async function listBlocks(userId) { return query(`SELECT b.id,b.blocked_user_id,u.name AS blocked_name,u.avatar_url,b.reason,b.created_at FROM user_blocks b JOIN users u ON u.id=b.blocked_user_id WHERE b.blocker_id=? ORDER BY b.created_at DESC LIMIT 100`, [userId]); }
async function createBlock(userId, blockedUserId, reason) { return query(`INSERT INTO user_blocks (blocker_id,blocked_user_id,reason) VALUES (?,?,?) ON CONFLICT (blocker_id,blocked_user_id) DO UPDATE SET reason=EXCLUDED.reason RETURNING id,blocked_user_id,reason,created_at`, [userId, blockedUserId, reason]); }
async function deleteBlock(userId, blockId) { return run('DELETE FROM user_blocks WHERE id=? AND blocker_id=?', [blockId, userId]); }
module.exports = { getAccountBundle, upsertPreferences, upsertPrivacy, upsertNotifications, writeActivity, listBlocks, createBlock, deleteBlock };
