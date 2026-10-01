/**
 * skNavBus — jembatan ringan antar-komponen navigasi SUKI.
 *
 * Tidak ada state global: satu CustomEvent agar item "Notifikasi" di left rail
 * / bottom nav dapat membuka panel NotificationCenter yang dirender di top bar
 * tanpa mengubah komponen tersebut.
 */
export const SK_OPEN_NOTIFICATIONS_EVENT = 'suki:open-notifications';

export function requestOpenNotifications(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SK_OPEN_NOTIFICATIONS_EVENT));
}
