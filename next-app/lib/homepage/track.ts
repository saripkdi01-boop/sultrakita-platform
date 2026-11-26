/**
 * Pelacakan event homepage (client-side).
 *
 * Kontrak analytics bersama (lib/analytics/events.ts) bersifat server-side dan
 * daftar namanya FINAL milik pemilik kontrak, jadi homepage TIDAK menambah nama
 * ke sana. Sebagai gantinya:
 *   1. Setiap elemen kunci diberi atribut `data-track="<event>"` + `data-track-*`
 *      (bisa dibaca GTM / alat analytics apa pun tanpa ubah kode).
 *   2. `trackHome()` mendorong event ke `window.dataLayer` (bila ada) dan
 *      memancarkan CustomEvent `suki:track` di window.
 * Tanpa PII: props hanya berisi id ruang/paket/mata uang/portofolio.
 */

export type HomeEventName =
  | 'door_click'
  | 'cta_mulai_gratis'
  | 'cta_whatsapp'
  | 'price_tab_switch'
  | 'portfolio_view';

export type HomeEventProps = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackHome(event: HomeEventName, props: HomeEventProps = {}): void {
  if (typeof window === 'undefined') return;
  const detail = { event, ...props, path: window.location.pathname };
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent('suki:track', { detail }));
}

/** Baca `data-track` + semua `data-track-<kunci>` dari elemen yang diklik. */
export function trackFromElement(element: HTMLElement): void {
  const name = element.dataset.track as HomeEventName | undefined;
  if (!name) return;
  const props: HomeEventProps = {};
  for (const [key, value] of Object.entries(element.dataset)) {
    if (key.startsWith('track') && key !== 'track' && value) {
      const prop = key.slice('track'.length);
      props[prop.charAt(0).toLowerCase() + prop.slice(1)] = value;
    }
  }
  trackHome(name, props);
}
