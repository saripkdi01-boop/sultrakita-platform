const { upsertPreferences, upsertPrivacy, upsertNotifications, writeActivity } = require('../repositories/settings.repository');
const APP_ICONS = ['default','sultra-green','teluk-kendari','mosalaki'];

const bool = (value, fallback) => value === undefined ? fallback : Boolean(value);
const enumValue = (value, allowed, fallback) => allowed.includes(String(value)) ? String(value) : fallback;
const text = (value, fallback, max) => value === undefined ? fallback : String(value).trim().slice(0, max);

function normalizePreferences(input = {}, current = {}) {
  return {
    dark_mode: bool(input.dark_mode, current.dark_mode ?? false), language: enumValue(input.language, ['id','en'], current.language || 'id'), app_icon: APP_ICONS.includes(String(input.app_icon)) ? String(input.app_icon) : (APP_ICONS.includes(current.app_icon) ? current.app_icon : 'default'), notifications_enabled: bool(input.notifications_enabled, current.notifications_enabled ?? true),
    autoplay_videos: bool(input.autoplay_videos, current.autoplay_videos ?? true), reduce_motion: bool(input.reduce_motion, current.reduce_motion ?? false), personalized_feed: bool(input.personalized_feed, current.personalized_feed ?? true), personalized_ads: bool(input.personalized_ads, current.personalized_ads ?? true), show_sensitive_content: bool(input.show_sensitive_content, current.show_sensitive_content ?? false), save_link_history: bool(input.save_link_history, current.save_link_history ?? true)
  };
}
function normalizePrivacy(input = {}, current = {}) {
  return {
    profile_visibility: enumValue(input.profile_visibility, ['public','friends','private'], current.profile_visibility || 'public'), show_activity_status: bool(input.show_activity_status, current.show_activity_status ?? true), allow_tagging: bool(input.allow_tagging, current.allow_tagging ?? true), data_sharing_consent: bool(input.data_sharing_consent, current.data_sharing_consent ?? false), activity_visibility: enumValue(input.activity_visibility, ['public','friends','private'], current.activity_visibility || 'friends'), phone_visibility: enumValue(input.phone_visibility, ['public','friends','private'], current.phone_visibility || 'private'), email_visibility: enumValue(input.email_visibility, ['public','friends','private'], current.email_visibility || 'private'), searchable_by_email: bool(input.searchable_by_email, current.searchable_by_email ?? false), searchable_by_phone: bool(input.searchable_by_phone, current.searchable_by_phone ?? false), allow_messages_from: enumValue(input.allow_messages_from, ['everyone','friends','nobody'], current.allow_messages_from || 'everyone'), allow_comments_from: enumValue(input.allow_comments_from, ['everyone','friends','nobody'], current.allow_comments_from || 'everyone'), personalized_recommendations: bool(input.personalized_recommendations, current.personalized_recommendations ?? true), data_collection_analytics: bool(input.data_collection_analytics, current.data_collection_analytics ?? true)
  };
}
function normalizeNotifications(input = {}, current = {}) {
  const values = ['email_notifications','push_notifications','sms_notifications','comments','replies','messages','order_updates','payment_updates','seller_updates','promotions','quiet_hours_enabled'];
  const output = Object.fromEntries(values.map(key => [key, bool(input[key], current[key] ?? (key === 'sms_notifications' || key === 'promotions' ? false : true))]));
  output.security_alerts = true;
  output.quiet_hours_start = input.quiet_hours_start === undefined ? (current.quiet_hours_start || null) : (String(input.quiet_hours_start).match(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/) ? input.quiet_hours_start : null);
  output.quiet_hours_end = input.quiet_hours_end === undefined ? (current.quiet_hours_end || null) : (String(input.quiet_hours_end).match(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/) ? input.quiet_hours_end : null);
  return output;
}
async function savePreferences(userId, input, current) { const values = normalizePreferences(input, current); await upsertPreferences(userId, values); await writeActivity(userId, 'preferences_updated', 'settings'); return values; }
async function savePrivacy(userId, input, current) { const values = normalizePrivacy(input, current); await upsertPrivacy(userId, values); await writeActivity(userId, 'privacy_updated', 'privacy_settings'); return values; }
async function saveNotifications(userId, input, current) { const values = normalizeNotifications(input, current); await upsertNotifications(userId, values); await writeActivity(userId, 'notification_updated', 'notification_settings'); return values; }
module.exports = { APP_ICONS, normalizePreferences, normalizePrivacy, normalizeNotifications, savePreferences, savePrivacy, saveNotifications };
